const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')
const { whois } = require('../../config.json').api

module.exports = {
    name: 'whois',
    category: 'utility',
    description: 'Mostra as informações WHOIS do domínio fornecido',
    args: ['domínio'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['whois'])
        let response
        try {
            response = await fetch(`https://api.ip2whois.com/v2?key=${whois}&domain=${args[0]}`)
        } catch (err) {
            return message.reply({ content: "⚠️ O domínio que você forneceu não é suportado" })
        }

        let dat = await response.json()
        let desc = `
\`\`\`
Nome do Domínio: ${dat.domain}
ID do Domínio: ${dat.domain_id}\nStatus: ${dat.status}
Data de Criação: ${dat.create_date}
Data de Atualização: ${dat.update_date}
Data de Expiração: ${dat.expire_date}
Servidor WHOIS: ${dat.whois_server}

REGISTRADOR
\tID IANA: ${dat.registrar.iana_id}
\tNome: ${dat.registrar.name}
\tURL: ${dat.registrar.url}

REGISTRANTE
\tNome: ${dat.registrant.name}
\tOrganização: ${dat.registrant.organization}
\tEndereço: ${dat.registrant.street_address}
\tCidade: ${dat.registrant.city}
\tRegião: ${dat.registrant.region}
\tCEP: ${dat.registrant.zip_code}
\tPaís: ${dat.registrant.country}
\tTelefone: ${dat.registrant.phone}
\tFax: ${dat.registrant.fax}
\tEmail: ${dat.registrant.email}

ADMINISTRADOR
\tNome: ${dat.admin.name}
\tOrganização: ${dat.admin.organization}
\tEndereço: ${dat.admin.street_address}
\tCidade: ${dat.admin.city}
\tRegião: ${dat.admin.region}
\tCEP: ${dat.admin.zip_code}
\tPaís: ${dat.admin.country}
\tTelefone: ${dat.admin.phone}
\tFax: ${dat.admin.fax}
\tEmail: ${dat.admin.email}

TECNICO
\tNome: ${dat.tech.name}
\tOrganização: ${dat.tech.organization}
\tEndereço: ${dat.tech.street_address}
\tCidade: ${dat.tech.city}
\tRegião: ${dat.tech.region}
\tCEP: ${dat.tech.zip_code}
\tPaís: ${dat.tech.country}
\tTelefone: ${dat.tech.phone}
\tFax: ${dat.tech.fax}
\tEmail: ${dat.tech.email}
\`\`\`
        `
        let embed = new Embed()
            .setDescription(desc)
        message.reply({ embeds: [embed] })
    }
}
