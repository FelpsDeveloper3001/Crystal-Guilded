const { Client } = require('guilded.ts')
const { token } = require('./config.json').bot
const fs = require('fs')
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = 20003;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

const client = new Client()

client.commands = new Map()
client.aliases = new Map();
client.callStatus = new Map()

require(`./Utils/handler`)(client);

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'))
for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client))
    } else {
        client.on(event.name, (...args) => event.execute(...args, client))
    }
}

client.login(token)
process.on('unhandledRejection', (err) => {
    console.error(err)
})
