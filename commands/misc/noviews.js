const { Embed } = require('guilded.ts');
const moment = require('moment');
const fetch = require('node-fetch');

module.exports = {
    name: 'noviews',
    category: 'misc',
    description: 'Mostra um canal ao vivo do Twitch com nenhum espectador',
    run: async (client, message, args) => {
        fetch(`https://nobody.live/stream`).then(async (response) => {
            let res = await response.json();
            let data = res[0];
            let embed = new Embed()
                .setAuthor(data.user_name, `https://cdn130.picsart.com/293712329019211.png`)
                .setTitle(data.title)
                .setUrl(`https://twitch.tv/${data.user_name}`)
                .setDescription(`Seja a primeira pessoa a assistir **${data.user_name}** transmitindo${data.game_name.length > 0 ? ` **${data.game_name}**` : ''}\nAtualmente transmitindo para **${data.viewer_count}** espectadores\n\n[Clique aqui para assistir](https://twitch.tv/${data.user_name})`)
                .setImage(data.thumbnail_url.replace('{width}', '1920').replace('{height}', '1080'))
                .setFooter(`Iniciou a transmissão ${moment(data.started_at).fromNow()}`);
            message.reply({ embeds: [embed] });
        });
    }
};
