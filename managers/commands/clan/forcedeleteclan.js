module.exports = {
    name: 'forceDeleteClan',
    description: 'Удалить клан [A]',
    aliases: ["forcedeleteclan"],
    public: true,
    async execute(bot, message, args) {
        if(!message.member.permissions.has("ADMINISTRATOR"))return(message.reply(":x: Недостаточно прав для выполенния **forceDeleteClan**"))
        let clannID = args[0]
        let clanTable = await Clan.findOne({ clanID: clannID })
        if(!clanTable)return(message.reply(":x: Клан с таким ID не найден."))
        message.channel.send(`Вы точно хотите удалить клан ${clanTable.clanName}?`).then(async m => {
            await m.react("✅")
            await m.react("❌")
            const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id };
            const userCollector = m.createReactionCollector(filter, { time: 15000 });
            userCollector.on('collect', async reaction => {
                if(reaction.emoji.name === "✅"){
                    Clan.deleteOne({ clanID: clannID }).then(async () => {
                        await m.edit("Клан удалён.")
                        await m.reactions.removeAll()
                        userCollector.stop('reacted')
                    }).catch(async () => {
                        await m.edit("Что-то пошло не так :/")
                        await m.reactions.removeAll()
                        userCollector.stop('reacted')
                    })
                }else if(reaction.emoji.name === "❌"){
                    await m.edit("Отменено")
                    await m.reactions.removeAll()
                    userCollector.stop('reacted')
                }
            })
            userCollector.on('end', async (_, reason) => {
                if(reason === 'reacted')return
                else(m.edit("Вы не успели нажать на реакцию. Отмена удаления."))
            })
        })
    }
}