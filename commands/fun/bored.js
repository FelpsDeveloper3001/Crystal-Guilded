const fetch = require('node-fetch');

module.exports = {
    name: 'bored',
    category: 'fun',
    description: 'Dá uma tarefa aleatória para fazer quando estiver entediado',
    run: async (client, message, args) => {
        fetch('https://www.boredapi.com/api/activity/').then(async (response) => {
            let res = await response.json();
            message.reply(res.activity);
        }).catch(error => {
            console.error('Erro ao buscar atividade:', error);
            message.reply('Oops! Algo deu errado ao buscar uma atividade aleatória.');
        });
    }
};
