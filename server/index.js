const { PeerRPCServer }  = require('grenache-nodejs-http');
const Link = require('grenache-nodejs-link');
const { getMyOrders } = require('../orderbook');
const controllers = require('./controllers');


function getRoutes() {
    return [
        ...Object.keys(controllers),
        ...getMyOrders().map(order => `MATCHMYORDER_${order.id}`),
    ];
}

function getController(route) {
    if (route.startsWith('MATCHMYORDER_')) {
        const orderId = route.replace(/^MATCHMYORDER_/, '');
        return (body, reply) => {
            controllers.matchOrder({ ...body, orderId }, reply)
        }
    } else {
        return controllers[route];
    }
}

const port = 1024 + Math.floor(Math.random() * 1000);
function start() {
    const link = new Link({
        grape: 'http://127.0.0.1:30001'
    });
    link.start();
    
    const peer = new PeerRPCServer(link, {
        timeout: 300000
    });
    peer.init();
    
    const service = peer.transport('server');
    console.log('starting server using port: ' + port);
    service.listen(port);
    
    setInterval(function () {
        getRoutes().forEach(route => {
            link.announce(route, service.port, {});
        });
    }, 1000);
    
    service.on('request', (rid, key, payload, handler) => {
        const reply = handler.reply.bind(handler);
        const controller = getController(key);
        if (controller) {
            controller(payload, reply);
        } else {
            reply('Unrecognised request.')
        }
    });
}

module.exports = {
    start,
};
