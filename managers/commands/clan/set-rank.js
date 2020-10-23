const {checkRights, checkAct, checkRankHas} = require("../../../functions/func");
module.exports = {
    name: 'set-rank',
    description: 'Установить ранг пользователю',
    aliases: ['setrank'],
    public: true,
    async execute(bot, message, args) {
        let clanIID = args[0]
        let member = message.mentions.members.first()
        let rankName = args[2]
        let clanTable = await Clan.findOne({ clanID: clanIID })
        if(!clanTable)return(message.reply(":x: Клан с таким ID не найден"))
        let toD = false
        await checkRights(clanIID, message.guild.id, 4, message.member).then(a => {
            if(a !== true)return(message.reply(":x: Вы не состоите в этом клане, либо не имеете прав доступа **4**"), toD = true)
        })
        if(toD===true)return
        if(!member)return(message.reply(":x: Вы не указали пользователя которому нужно установить ранг."))
        if(!rankName)return(message.reply(":x: Вы не указали ранг который нужно установить пользователю"))
        let toR = false
        await checkAct(clanIID, message.guild.id, message.member, member).then(r => {
            if(r !== true){ message.reply(":x: Вы не можете применить комманду **set-rank** на этого пользователя"), toR = true }
        })
        if(toR===true)return
        let to4 = false
        await checkRankHas(clanIID, message.guild.id, rankName).then(r => {
            if(r !== true)return(message.reply(":x: Такого ранга нет."), to4 = true)
        })
        if(to4===true)return
        for(const memberr of clanTable.members){
            if(memberr.userID === member.id){
                memberr.userRank = rankName
            }
        }
        setTimeout(async() => {
            await clanTable.save()
            await message.channel.send(`:white_check_mark: ${message.member} установил пользователю ${member} ранг ${rankName}.`)
        }, 500)

    }
}