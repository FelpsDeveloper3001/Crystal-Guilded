const fetch = require('node-fetch');

module.exports = {
    name: 'advice',
    category: 'fun',
    description: "Dá um conselho aleatório. (Não leve a sério)",
    run: async (client, message, args) => {
        fetch('https://api.adviceslip.com/advice').then(async (response) => {
            let res = await response.json();
            message.reply(res.slip.advice);
        });
    }
};
