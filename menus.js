const { EntoliList, EntoliPrompt } = require("entoli");

function combine(...menus) {
    return async () => {
        const answers = {};
        for (var i = 0; i < menus.length; i++) {
            const [key, fn] = menus[i];
            answers[key] = await fn();
        }
        return answers;
    }
}

const mainMenu = new EntoliList([
    ['Make an order', 'make'],
    ['List orders', 'list'],
    ['Match order', 'match'],
    ['Exit', 'exit'],
]);

const makeOrderMenu = combine(
    ['amount', new EntoliPrompt('Enter amount in satoshis (default: 100000000):')],
    ['rate', new EntoliPrompt('Enter BTC/USD rate for 1 BTC  (default: 50000):')],
);

const getMatchId = new EntoliPrompt('Enter the order id:');

module.exports = {
    mainMenu,
    makeOrderMenu,
    getMatchId
};