/**
 * Type: Order
 *  id
 *  amount
 *  rate
 *  clientId
 *  matchClientId
 */
 const uuid = require('uuid');

const orderbook = {};
const clientId = uuid.v4();

module.exports = {
    getClientId() {
        return clientId;
    },

    getOrder(orderId) {
        return orderbook[orderId];
    },

    addNewOrder(order) {
        if (orderbook[order.id]) throw new Error('Cannot add new order: Order already exists.')
        orderbook[order.id] = { ...order };
    },

    markOrderAsMatched(orderId, matchClientId) {
        // console.log('MARKORDER', orderId, matchClientId, new Error().stack);
        const order = orderbook[orderId];
        if (!order) throw new Error('Cannot mark order as matched: Order not found.');
        if (order.matchClientId) throw new Error('Cannot mark order as matched: Order already matched.');

        order.matchClientId = matchClientId;
    },

    getAvailableOrders() {
        return Object.values(orderbook)
            .filter(order => !order.matchClientId);
    },

    getMyOrders() {
        return Object.values(orderbook)
            .filter(order => order.clientId === clientId)
    },
}