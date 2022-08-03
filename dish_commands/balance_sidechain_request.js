const transactions = require('@liskhq/lisk-transactions');
const { EPOCH_TIME } = require ("@liskhq/lisk-constants");
const { APIClient } = require('@liskhq/lisk-api-client');

const api = new APIClient(['http://localhost:4000']);

const getTimestamp = () => {
    const millisSinceEpoc = Date.now() - Date.parse(EPOCH_TIME);
    const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
    return parseInt(inSeconds);
}

var address = "6181773985994883123L";
let tx = new transactions.TransferTransaction({    
    amount: transactions.utils.convertLSKToBeddows('200000'),
    recipientId: address,
    timestamp: getTimestamp()    
});

tx.sign('wagon stock borrow episode laundry kitten salute link globe zero feed marble');

console.log(tx.stringify());
process.exit(0);