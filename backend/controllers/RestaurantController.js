const RestaurantFood = require('../baseClasses/RestaurantFood');
const Refund = require('../baseClasses/RefundRestaurant');
const { EPOCH_TIME } = require ("@liskhq/lisk-constants");
const transactions = require("@liskhq/lisk-transactions");
const cryptography = require('@liskhq/lisk-cryptography');
const blockchainClient = require ("../APIClient/blockchainClient");
const RestaurantInfo = require('../baseClasses/RestaurantInfo');
const FoodTransaction = require('../../transactions/FoodTransaction');

/* Attention: please, perform a MenuTransaction to establish a menu for this restaurant*/

    var getTransaction = async (options) => {
        return blockchainClient.transactions.get(options);
    }

    var generateDish = async (foodType) => {        
        
        const restaurantAddress = RestaurantInfo.getRestaurantAddress();
        const options = { type: 800, senderId: restaurantAddress,
        sort: 'timestamp:desc', limit: 1 };
        var itemIndex = 0;
        var food = require("../models/food");   
        
        const result = await getTransaction(options);

        const millisSinceEpoc = Date.now() - 8 - Date.parse(EPOCH_TIME);
        const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
        
        itemIndex = result.data.length -1;
        
        if (result.data[itemIndex] !== undefined) {                             
            
            for (var index = 0; index < result.data[itemIndex].asset.items.length; index++) {
                if (result.data[itemIndex].asset.items[index].type == parseInt(foodType)) {
                    food.name = result.data[itemIndex].asset.items[index].name;
                    food.description = result.data[itemIndex].asset.items[index].description;
                    food.amount = result.data[itemIndex].asset.items[index].price;
                    food.discount = result.data[itemIndex].asset.items[index].discount;
                    food.img = result.data[itemIndex].asset.items[index].img;
                    food.request_type = result.data[itemIndex].asset.items[index].type;
                    food.timestamp = parseInt(inSeconds);

                    console.log("food detail: ".concat(food));
                    return food;  
                }
            }
        }
        return "invalid request";        
    }

module.exports = {    
    /* 
    method type: Get
    Index method that retrieves menu from the latest MenuTransaction performed for this restaurant 
    to perform a MenuTransaction please read the readme file on the backend folder, there is a dish1_commands folder with a menu_transaction.request.js file
    */ 
    async index(request, response){
        response.setHeader('Access-Control-Allow-Origin', '*');
        
        const restaurantAddress = RestaurantInfo.getRestaurantAddress();
        const options = { type: 800, senderId: restaurantAddress,
            sort: 'timestamp:desc', limit: 1 };        
        const result = await getTransaction(options);
        var itemIndex = result.data.length-1;     

        if (result.data[itemIndex] !== undefined){
            console.log(result.data[itemIndex].asset.items);            

            return response.json({
                status: "ok",
                result: result.data[itemIndex].asset.items
            })
        }
        
        return response.json({
            status: "error",
            result: null
        })
    },

    /* 
    method type: Get
    Returns the food detailed from the respective food type supplied in the URL
    */
    async foodDetail(request, response){
        response.setHeader('Access-Control-Allow-Origin', '*');        
        var typeId = request.params.id;
        const isInvalidValidRequest = isNaN(typeId) || typeId < 0 || typeId > 50;
        var rsp = await generateDish(typeId);        
        console.log(typeId);        
        console.log(rsp);

        response.json({
            status: isInvalidValidRequest ? "invalid request" : "ok",
            response: rsp
        })
    },

    /*
    method type: Post
    Returns transaction detail by transaction id
    */
    async getTransactionById(request, response){
        response.setHeader('Access-Control-Allow-Origin', '*');

        const { transactionId, address } = request.body;        

        const restaurantAddress = RestaurantInfo.getRestaurantAddress();
        const options = { type: 820, id: transactionId, limit: 1, senderId: address, recipientId: restaurantAddress };        
        var result = await getTransaction(options);

        return response.json({ status: "Transaction result", response: result});
    },

    /* 
    method type: Post
    Returns transaction detail related to the refund information supplied
    */
    async refund(request, response) {
        response.setHeader('Access-Control-Allow-Origin', '*');
        
        const { transactionId, amount, recipientAddress, password } = request.body;        

        var result = null;
        if (password == "pocFoodRestaurant"){
            const refund = new Refund();
            result = await refund.commandRefund(transactionId, amount, recipientAddress);                        

            return response.json({ status: "Transaction result", response: result});
        }else{
            return response.json({
                status: "validation error",
                response: "wrong password"
            });
        }
    },

    /*
    method type: Post
    Returns transaction detail related to food requested
    deprecated
    */
    async store(request, response){
        response.setHeader('Access-Control-Allow-Origin', '*');

        return response.json ({ status: "deprecated" });

        const { request_type, encryptedPassphrase, username, table, phone, deliveryaddress } = request.body;        
        const password = 'luxuryRestaurant';
        
        const decryptedPassphrase = cryptography.decryptPassphraseWithPassword(encryptedPassphrase, password);        

        var result = null;
        const isInvalidValidRequest = isNaN(request_type) || request_type < 0 || request_type > 7;
        console.log("registering payment");        
        
        const meat = await generateDish(request_type);           
        result = await meat.commandFood(decryptedPassphrase, meat, table, request_type, cryptography.encryptPassphraseWithPassword(username, password), cryptography.encryptPassphraseWithPassword(phone, password), cryptography.encryptPassphraseWithPassword(deliveryaddress, password));
        
        return response.json({
            status: isInvalidValidRequest ? "Invalid request type" : "Transaction result",
            response: isInvalidValidRequest ? null : result
        });        
    },    
    
    async storeQrCodeUrlRestaurant(request, response){
        response.setHeader('Access-Control-Allow-Origin', '*');
        const { request_type, username, phone, deliveryaddress, observation } = request.body;            
                
        const meat = await generateDish(request_type);
        const address = RestaurantInfo.getRestaurantAddress();                        
        const amount = `${transactions.utils.convertLSKToBeddows(meat.amount.toString())}`.toString(); 

        var result = "food://wallet?recipient=".concat(address)
            .concat("&amount=").concat(amount)
            .concat("&food=").concat(meat.name)
            .concat("&foodtype=").concat(request_type.toString())
            .concat("&timestamp=").concat(meat.timestamp)
            .concat("&username=").concat(username)
            .concat("&phone=").concat(phone)
            .concat("&deliveryaddress=").concat(deliveryaddress)
            .concat("&observation=").concat(observation)
            .concat("&recipientpublickey=").concat(RestaurantInfo.getRestaurantPublicKey());                

        return response.json({ status: "Waiting payment", response: result});
    },

    async storeQrCodeUrlRestaurantAtPlace(request, response){
        response.setHeader('Access-Control-Allow-Origin', '*');
        const { request_type } = request.body;            

        const meat = await generateDish(request_type);
        const address = RestaurantInfo.getRestaurantAddress();                        
        const amount = `${transactions.utils.convertLSKToBeddows(meat.amount.toString())}`.toString();
                
        var result = null;
        result = "food://wallet?recipient=".concat(address)
            .concat("&amount=").concat(amount);

        return response.json({ status: "Waiting payment", response: result});
    },

    async storePayment(request, response){
        response.setHeader('Access-Control-Allow-Origin', '*');        
        
        const { transaction, networkid } = request.body;            
                
        if (networkid === 'identifier'){            
            const meat = new RestaurantFood();            
            var result = await meat.receivedSignedTransactionForBroadcast(transaction);

            return response.json({ status: "Transaction result", response: result});
        }else{
            return response.json({ status: "Invalid request", response: null});
        }
    },

    async storePaymentWithPassphrase(request, response){
        response.setHeader('Access-Control-Allow-Origin', '*');        
        
        const { transaction, networkid } = request.body;                                    

        if (networkid === 'identifier'){                                                      

            var txFood = new FoodTransaction({
                asset: {
                    name: transaction.asset.name,
                    description: transaction.asset.description,
                    username: transaction.asset.username,
                    phone: transaction.asset.phone,
                    deliveryaddress: transaction.asset.deliveryaddress,
                    foodType: transaction.asset.foodType,
                    observation: transaction.asset.observation,
                    clientData: transaction.asset.clientData,
                    clientNonce: transaction.asset.clientNonce,
                    key: transaction.asset.key,
                    keynonce: transaction.asset.keynonce,  
                    clientpublickey: transaction.asset.clientpublickey              
                },    
                amount: transaction.amount,
                recipientId: transaction.recipientId, //restaurant lisk address
                timestamp: transaction.timestamp
            });

            console.log("transaction: ");
            console.log(txFood);

            txFood.sign(cryptography.decryptMessageWithPassphrase(transaction.asset.key, transaction.asset.keynonce, RestaurantInfo.getRestaurantPassphrase(), transaction.asset.clientpublickey));

            const meat = new RestaurantFood();            
            var result = await meat.receivedSignedTransactionForBroadcast(txFood);

            return response.json({ status: "Transaction result", response: result});
        }else{
            return response.json({ status: "Invalid request", response: null});
        }
    },

    async cryptographyText(request, response){
        response.setHeader('Access-Control-Allow-Origin', '*');
        
        const { text } = request.body;

        var encryptedText = RestaurantInfo.getCryptographedMessage(text);

        return response.json( { response: encryptedText} );
    }
}