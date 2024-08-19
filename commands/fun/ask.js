const fetch = require('node-fetch');
const { brainshop } = require('../../config.json').api;

module.exports = {
    name: 'ask',
    category: 'fun',
    description: 'Faça qualquer pergunta e eu responderei',
    args: ['pergunta'],
    run: async (client, message, args) => {
        if (!args[0]) {
            return message.reply('❌ Tente `/ask Quanto é 2 + 2?`');
        }
        if (message.authorId === 'dODMpQPm' && args[0] === 'chatgpt') {
            let content = await client.cgpt.ask(args.slice(0).join(' '));
            try {
                message.reply(content);
            } catch (err) {
                message.reply('⚠️ Ocorreu um erro');
            }
        } else {
            let content = encodeURIComponent(args.join(' '));
            fetch(`http://api.brainshop.ai/get?bid=182649&key=${brainshop}&uid=${message.createdById}&msg=${content}`)
                .then(async (response) => {
                    let res = await response.json();
                    message.reply(res.cnt);
                });
        }
    }
};
