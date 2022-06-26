const { getMyOrders } = require("../../orderbook");

module.exports = function getLocalOrders(body, reply) {
    const orders = getMyOrders();
    reply(null, orders);
}