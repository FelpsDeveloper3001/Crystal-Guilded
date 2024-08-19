module.exports = {
    name: 'serverRemove',
    async execute(servidor, removidoPor, cliente) {
        await servidor.client.db.delete(servidor.id);
        cliente.logChannel.send(`➖ Fui removida do servidor ${servidor.name}`);
    },
};
