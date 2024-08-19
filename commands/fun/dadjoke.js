const fetch = require('node-fetch');

module.exports = {
    name: 'dadjoke',
    category: 'fun',
    description: 'Conta uma piada de pai aleatória',
    aliases: ['dj'],
    run: async (client, message, args) => {
        fetch('https://icanhazdadjoke.com/', { headers: { 'Accept': 'application/json' } }).then(async (response) => {
            let dat = await response.json();
            message.reply(dat.joke);
        });
    }
}
