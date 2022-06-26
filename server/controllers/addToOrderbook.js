const { addNewOrder } = require("../../orderbook");


module.exports = function addToOrderbook(body, reply) {
    // TODO: Validate Order
    const order = body;

    try {
        addNewOrder(order);
    } catch (err) {
        console.error(err);
    }

    reply(null, null)
}