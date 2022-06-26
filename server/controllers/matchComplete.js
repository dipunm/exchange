const { markOrderAsMatched } = require("../../orderbook");

module.exports = function matchComplete(body, reply) {
    const { orderId, clientId } = body;
    
    try {
        markOrderAsMatched(orderId, clientId);
    } catch (err) {
        console.error(err);
    }

    reply(null, null);
}