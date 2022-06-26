/**
 * A user launches an application which acts as a host and a client simultaneously.
 * 
 * Grape handles the peer discovery for us.
 * 
 * A user can:
 *  - Make an order
 *     - Need a client identifier
 *     - Need the order amount
 *     - Need the order rate
 *     - Maker of order needs to be master
 *  - List orders
 *  - Match an order
 *     - Need a client identifier
 *     - Need an order identifier
 * 
 *  ON Make order:
 *   - Update all peers
 *  ON Startup:
 *   - Get order ids from all peers
 *   - Get orders from one peers
 *  ON Interval:
 *   - Get order ids from all peers
 *  ON Match order:
 *   - 
 *   - Update all peers
 */

const server = require('./server');
const client = require('./client');
const { mainMenu, makeOrderMenu, getMatchId } = require('./menus');
const { getAvailableOrders, getOrder, addNewOrder } = require('./orderbook');

server.start();
client.connect();


async function makeOrder() {
    const { amount, rate } = await makeOrderMenu();
    client.makeOrder(amount || 100000000, rate || 50000);
}

function listOrders() {
    const orders = getAvailableOrders();
    orders.forEach(order => console.log(`- id: ${order.id}, amount: ${order.amount}, rate: ${order.rate}`));
}

async function matchOrder() {
    const id = await getMatchId();
    order = getOrder(id);
    if (!order) {
        return console.error('Order not found.')
    }
    if (order.matchClientId) {
        return console.error('Order already matched.')
    }

    client.matchOrder(id);
}

async function begin() {
    let exit = false;
    while (!exit) {
        const selection = await mainMenu();
        switch(selection[1]) {
            case 'make':
                await makeOrder();
                break;

            case 'list':
                await listOrders();
                break;
            
            case 'match':
                await matchOrder();
                break;
            
            case 'exit':
                exit = true;
                break;
        }
    }
}

function syncWithOrders(orders) {
    orders.forEach(o => {
        if (!getOrder(o.id)) {
            addNewOrder(o);
        }
    });
}

// Timeout may not have been necessary.
setTimeout(async () => {
    const orders = await client.fetchRemoteOrders();
    syncWithOrders(orders);

    const interval = setInterval(async () => {
        const orders = await client.fetchRemoteOrders();
        syncWithOrders(orders);
    }, 1000);

    await begin();
    // Note: No documented cleanup code to execute :(
    clearInterval(interval);
    process.exit();
}, 1000);