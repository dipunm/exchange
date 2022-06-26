const Grape = require('grenache-grape').Grape

const g = new Grape({
  host: '127.0.0.1', // if undefined the Grape binds all interfaces
  dht_port: 20001,
  dht_bootstrap: [

  ],
  api_port: 30001
})

g.start()

g.on('announce', (...args) =>console.log('announce:',...args))
g.on('warning', (...args) =>console.log('warning:',...args))
g.on('node', (...args) =>console.log('node:',...args))
g.on('peer', (...args) =>console.log('peer:',...args))
g.on('listening', (...args) =>console.log('listening:',...args))
g.on('ready', (...args) =>console.log('ready:',...args))