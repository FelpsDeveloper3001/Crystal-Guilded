module.exports = {
    name: "ping",
    description: "Envia a você a latência do bot",
    category: "bot",
    run: async (client, message, args) => {
        let ping = await client.ws.ping
        message.reply(`${ping}ms`)
    }
}
