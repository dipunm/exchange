const { PeerRPCClient } = require('grenache-nodejs-http');
const Link = require('grenache-nodejs-link');
const { getClientId } = require('../orderbook');
const uuid = require('uuid');

let peer;
const options = { timeout: 10000 };
const clientId = getClientId();

function connect() {
  const link = new Link({
    grape: 'http://127.0.0.1:30001'
  });
  link.start();

  peer = new PeerRPCClient(link, {});
  peer.init();
}

/**
 * Make an order
 * @param {number} amount - amount in satoshis 
 * @param {number} rate - rate in USD/BTC (eg. $50,000)
 */
function makeOrder(amount, rate) {
  const order = {
    id: uuid.v4(),
    clientId,
    amount,
    rate
  };

  return new Promise((resolve) => {
    peer.map('addToOrderbook', order, options, (err, data) => {
      resolve();
    });
  });
}

function matchOrder(orderId) {
  const match = {
    orderId,
    clientId
  };

  return new Promise((resolve, reject) => {
    // See if the client with the given order is still around
    peer.request('MATCHMYORDER_' + orderId, {}, options, (err, data) => {
      if (err) {
        return reject(err);
      }

      if (data.matched) {
        peer.map('matchComplete', match, () => {
          resolve();
        });
      }

      return reject();
    });
  });
}

function fetchOrders() {
  return new Promise((resolve, reject) => {
    peer.map('getLocalOrders', {}, options, (err, data) => {
      if (!data || !data.length) return resolve([]);
      const orders = data.reduce((agg, curr) => curr ? [...agg, ...curr] : agg, []);
      resolve(orders);
    });
  });
}

module.exports = {
  connect,
  makeOrder,
  matchOrder,
  fetchOrders,
}