module.exports = {
    name: 'delete-clan',
    description: 'Удалить клан',
    aliases: ["deleteclan"],
    public: true,
    async execute(bot, message, args) {
        let clannID = args[0]
        let clanTable = await Clan.findOne({ clanID: clannID })
        if(!clanTable)return(message.reply(":x: Клан с таким ID не найден."))
        let isOwner = false;
        for (const member of clanTable.members){
            if (member.userID === message.member.id && member.userRank === "owner") {
                isOwner = true;
                break;
            }
        }
        if(isOwner === false)return(message.reply(":x: Вы должны быть владельцем клана чтобы его удалить"))
        message.channel.send("Вы точно хотите удалить ваш клан?").then(async m => {
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