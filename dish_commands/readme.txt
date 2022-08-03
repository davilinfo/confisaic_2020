Example of use to sign and broadcast transaction:
node dish_commands/balance_request.js | tee >(curl -X POST -H "Content-Type: application/json" -d @- localhost:4000/api/transactions)

node dish_commands/balance_sidechain_request.js | tee >(curl -X POST -H "Content-Type: application/json" -d @- localhost:4000/api/transactions)

node dish_commands/menu_transaction_request.js | tee >(curl -X POST -H "Content-Type: application/json" -d @- localhost:4000/api/transactions)

node dish_commands/food_request.js | tee >(curl -X POST -H "Content-Type: application/json" -d @- localhost:4000/api/transactions)
