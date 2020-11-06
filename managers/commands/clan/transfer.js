const { checkRights, setOwner } = require('../../../functions/func.js')
module.exports = {
    name: 'transfer',
    description: 'Передать клан в чужое владение',
    aliases: [],
    public: true,
    async execute(bot, message, args) {
        let clanIID = args[0]
        let member = message.mentions.members.first()
        let clanTable = await Clan.findOne({ clanID: clanIID, guildID: message.guild.id })
        if(!clanTable)return(message.reply(":x: Клан с таким ID не найден"))
        let toD = false
        await checkRights(clanIID, message.guild.id, 5, message.member).then(a => {
            if(a !== true)return(message.reply(":x: Вы не состоите в этом клане, либо не имеете прав доступа владельца"), toD = true)
        })
        let r1 = false
        for(const mem of clanTable.members){
            if(mem.userID === member.id){
                r1 = true
                break
            }
        }
        if(r1===false)return(message.reply(":x: Этот пользователь не состоит в клане"))
        if(toD===true)return
        message.channel.send(`Вы точно хотите передать ваш клан участнику ${member}?`).then(async m => {
            await m.react("✅")
            await m.react("❌")
            const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id };
            const userCollector = m.createReactionCollector(filter, { time: 15000 });
            userCollector.on('collect', async reaction => {
                if(reaction.emoji.name === "✅"){
                   await setOwner(clanIID, message.guild.id, member).then(r => {
                       m.edit("✅ Вы успешно передали свой клан.")
                   })
                    userCollector.stop('reacted')
                }else if(reaction.emoji.name === "❌"){
                    await m.edit("Отменено")
                    await m.reactions.removeAll()
                    userCollector.stop('reacted')
                }
            })
            userCollector.on('end', async (_, reason) => {
                if(reason === 'reacted')return
                else(m.edit("Вы не успели нажать на реакцию. Отмена передачи."))
            })
        })
    }
}