const { Embed } = require('guilded.ts');

module.exports = {
    name: 'trumptweet',
    category: 'fun',
    description: 'Gera tweets falsos do Trump',
    args: ['texto'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['trumptweet']);
        let embed = new Embed()
            .setImage(`https://un5vyw.deta.dev/tweet?text=${encodeURIComponent(args.join(' '))}`);
        message.reply({ embeds: [embed] });
    }
}
