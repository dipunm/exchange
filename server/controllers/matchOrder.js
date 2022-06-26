const { getOrder, getClientId } = require("../../orderbook");

module.exports = function matchOrder(body, reply) {
    const { orderId } = body;
    const clientId = getClientId();
    const order = getOrder(orderId);
    if (!order || order.clientId !== clientId) {
        return reply(null, {
            matched: false
        });
    }

    return reply(null, {
        matched: true
    });
}