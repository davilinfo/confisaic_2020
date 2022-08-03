const Entrance = require("../transactions/FoodTransaction");
const transactions = require("@liskhq/lisk-transactions");
const { EPOCH_TIME } = require("@liskhq/lisk-constants");
const cryptography = require('@liskhq/lisk-cryptography');

const getTimestamp = () => {
    const millisSinceEpoc = Date.now() - Date.parse(EPOCH_TIME);
    const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
    return parseInt(inSeconds);
}

var passphrase = 'wagon stock borrow episode laundry kitten salute link globe zero feed marble';
var recipient = cryptography.getAddressAndPublicKeyFromPassphrase('unfair canvas settle chief pattern solar three village fat barely mean ethics');

var clientData = cryptography.encryptMessageWithPassphrase(
    "davi".concat(' ***Field*** ')
    .concat("71997035287").concat(' ***Field*** ')
    .concat("Salvador").concat(' ***Field*** ')
    .concat(""),
    passphrase,
    cryptography.getPrivateAndPublicKeyFromPassphrase(passphrase).publicKey);                    

var encryptedclient= cryptography.encryptMessageWithPassphrase(
    "davi".concat(' ***Field*** ')
    .concat("71997035287").concat(' ***Field*** ')
    .concat("Salvador").concat(' ***Field*** ')
    .concat(""),
    passphrase, 
    recipient.publicKey);

let txEntrance1 = new Entrance({
    asset: {
        name: 'oysters',
        description: '12 fresh oysters served in a plate',
        foodType: 1,
        username: "username",
        phone: "phone",
        deliveryaddress: "deliveryaddress",        
        observation: "",
        clientData: clientData.encryptedMessage,
        clientNonce: clientData.nonce,
        key: encryptedclient.encryptedMessage,
        keynonce: encryptedclient.nonce,
        clientpublickey: cryptography.getAddressAndPublicKeyFromPassphrase(passphrase).publicKey
    },
    amount: `${transactions.utils.convertLSKToBeddows('48')}`,
    recipientId: recipient.address, //restaurant lisk address
    timestamp: getTimestamp()
});

//signing transaction
txEntrance1.sign(passphrase);

console.log(txEntrance1.stringify());
process.exit(0);
