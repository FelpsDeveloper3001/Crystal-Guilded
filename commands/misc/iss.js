const fetch = require('node-fetch');
const { Embed } = require('guilded.ts');

module.exports = {
    name: 'iss',
    category: 'misc',
    description: 'Mostra a localização atual da Estação Espacial Internacional',
    run: async (client, message, args) => {
        fetch('http://api.open-notify.org/iss-now.json')
            .then(async (response) => {
                let data = await response.json();
                let lon = data.iss_position.longitude;
                let lat = data.iss_position.latitude;
                
                let embed = new Embed()
                    .setTitle('Localização atual da ISS')
                    .addField('Longitude', lon, true)
                    .addField('Latitude', lat, true)
                    .setImage(`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l-airport+f74e4e(${lon},${lat})/${lon},${lat},2.65,0/600x450?access_token=pk.eyJ1IjoiZnJlc2hlcjg4OSIsImEiOiJjbDJlZzY0ODMwMGZxM2xwOWZjbmVqdnd1In0.j6bVs3UmqxA9V7lNmXSMtg&logo=false&attribution=false`)
                    .setFooter('Mapa por: Mapbox & OpenStreetMap');
                
                message.reply({ embeds: [embed] });
            })
            .catch((err) => {
                console.error('Erro ao buscar a localização da ISS:', err);
                message.reply('⚠️ Não foi possível obter a localização atual da Estação Espacial Internacional');
            });
    }
};
