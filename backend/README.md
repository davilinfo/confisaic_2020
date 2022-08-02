# backend of restaurant_sidechain
The backend of the luxury restaurant business based on Lisk blockchain is the responsible to perform any request to the sidechain blockchain. Also, it is responsible to receive requests from any client and perform transactions to the sidechain.
Restaurants can take advantage of RestaurantFood class and specify its restaurant lisk address on RestaurantInfo.js. For example: Restaurant 1 would have its food types, use the RestaurantFood class for its business and perform transactions to the same sidechain consumed by Restaurant 2. The difference is that Restaurant 2 can be a completely different restaurant business, it just need to specify its own restaurant lisk address on RestaurantInfo.js and peform a MenuTransaction to specify its food types with desserts, menu, entrances ...

Configuring
/*After configure the restaurant sidechain, now is time to configure the backend*/
/*Run*/
npm ci

/*open the config folder and configure the config.json file including the ip address(es) of restaurant sidechain*/

/*open the index.js folder and change the ip address 3333 of this line, server.listen(3333);, to any you desire, or just let it the way it is.*/

/*open the baseClasses folder and specify the restaurant address, passphrase in RestaurantInfo.js file*/

/*Configuring new food type inside luxury restaurant
running a dish command to include all the menu items of your restaurant from inside of restaurant_sidechains folder. First all lets give some lsk to restaurant account with the following command*/ 

node dish_commands/balance_request.js | tee >(curl -X POST -H "Content-Type: application/json" -d @- localhost:4000/api/transactions)

/*Change the file menu_transaction_request.js properly and then run the following command from the restaurant_sidechain folder:*/ 

node dish_commands/menu_transaction_request.js | tee >(curl -X POST -H "Content-Type: application/json" -d @- localhost:4000/api/transactions)

/*this command will create a transaction and broadcast it into de restaurant sidechain, after confirmed the website of the restauraunt will have all menu items described in the MenuTransaction*/

/*ok you are ready to run the backend*/
node index.js

/*If you can read Initiated, then the backend is up and running. Stop it and run it with pm2*/
pm2 start --name luxury_restaurant_backend index.js

/*After configure the backend is time to configure the frontend. The site will make things possible to an user. Go to the web folder from the restaurant_sidechain folder and read the Readme*/
