const {checkRights, checkAct} = require("../../../functions/func");
module.exports = {
    name: 'member-kick',
    description: 'Кикнуть участника из клана',
    aliases: ['memberkick'],
    public: true,
    async execute(bot, message, args) {
        let clanIID = args[0]
        let member = message.mentions.members.first()
        let clanTable = await Clan.findOne({ clanID: clanIID })
        if(!clanTable)return(message.reply(":x: Клан с таким ID не найден"))
        let toD
        await checkRights(clanIID, message.guild.id, 2, message.member).then(a => {
            if(a !== true)return(message.reply(":x: Вы не состоите в этом клане, либо не имеете прав доступа **2**"), toD = true)
        })
        if(toD===true)return
        if(!member)return(message.reply(":x: Вы не указали пользователя которого нужно пригласить."))
        let toR = false
        await checkAct(clanIID, message.guild.id, message.member, member).then(r => {
            if(r !== true){ message.reply(":x: Вы не можете применить комманду **kick** на этого пользователя"), toR = true }
        })
        if(toR===true)return
        message.channel.send(`> ${message.member} выкинул ${member} из клана ${clanTable.clanName}.`)
        clanTable.members = clanTable.members.filter(u => u.userID !== member.id)
        setTimeout(async() => {
            await clanTable.save()
        }, 500)

    }
}