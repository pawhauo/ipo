const {checkRights, checkMember }  = require('../../../functions/func.js')
module.exports = {
    name: 'invite',
    description: 'Пригласить в клан',
    aliases: [],
    public: true,
    async execute(bot, message, args) {
        let clanIID = args[0]
        let member = message.mentions.members.first()
        let clanTable = await Clan.findOne({ clanID: clanIID, guildID: message.guild.id })
        if(!clanTable)return(message.reply(":x: Клан с таким ID не найден"))
        let toD
        await checkRights(clanIID, message.guild.id, 2, message.member).then(a => {
            if(a !== true)return(message.reply(":x: Вы не состоите в этом клане, либо не имеете прав доступа **2**"), toD = true)
        })
        if(toD===true)return
        if(!member)return(message.reply(":x: Вы не указали пользователя которого нужно пригласить."))
        let toR = false
        await checkMember(clanIID, member, message.guild.id).then(r => {
            if(r !== false){
                message.reply(":x: Этот участник уже состоит в этом клане")
                toR = true
                return
            }
        })
        if(toR===true)return
        let embStatusWait = new Discord.MessageEmbed()
            .setTitle("Вас пригласили в клан "+clanTable.clanName)
            .setDescription(`Статус: **В ожидании**`)
            .addField("INVITE",`Вы были приглашены в клан ${clanTable.clanName} участником клана: ${message.member}.\n| ✅ - Принять приглашение\n| ❌ - Отклонить приглашение.`)
            .setColor("ORANGE")
        let embStatusAccepted = new Discord.MessageEmbed()
            .setTitle("Вас пригласили в клан "+clanTable.clanName)
            .setDescription(`Статус: **Принято**`)
            .addField("INVITE",`Вы были приглашены в клан ${clanTable.clanName} участником клана: ${message.member}.\n| Вы приняли приглашентие.`)
            .setColor("GREEN")
        let embStatusDeclined = new Discord.MessageEmbed()
            .setTitle("Вас пригласили в клан "+clanTable.clanName)
            .setDescription(`Статус: **Отклонено**`)
            .addField("INVITE",`Вы были приглашены в клан ${clanTable.clanName} участником клана: ${message.member}.\n| Вы отклонили приглашение..`)
            .setColor("RED")
        let embStatusTimeout = new Discord.MessageEmbed()
            .setTitle("Вас пригласили в клан "+clanTable.clanName)
            .setDescription(`Статус: **Время истекло**`)
            .addField("INVITE",`Вы были приглашены в клан ${clanTable.clanName} участником клана: ${message.member}.\n| Время для принятия приглашения истекло.`)
            .setColor("DARK_RED")

        await member.send(embStatusWait).then(async m => {
            await m.react("✅")
            await m.react("❌")
            const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === member.id };
            const userCollector = m.createReactionCollector(filter, { time: 15000 });
            userCollector.on('collect', async reaction => {
                if(reaction.emoji.name === "✅"){
                    await m.edit(embStatusAccepted)
                    clanTable.members.push({
                        userID: member.id,
                        userRank: 'user',
                    })
                    setTimeout(async () => {
                        clanTable.save()
                    }, 500)
                    //await m.reactions.removeAll()
                    await message.react("✅")
                    userCollector.stop('reacted')
                }else if(reaction.emoji.name === "❌"){
                    await m.edit(embStatusDeclined)
                    //await m.reactions.removeAll()
                    await message.react("❌")
                    userCollector.stop('reacted')
                }
            })
            userCollector.on('end', async (_, reason) => {
                if(reason === 'reacted')return
                else(m.edit(embStatusTimeout), message.react("🕝"))
            })
        }).catch(() => {
            message.channel.send("❌ Я не смог отправить сообщение данному пользователю, т.к. у него закрыта личка.")
            return
        })
    }
}