const { checkRankHas, checkRights } = require('../../../functions/func.js')
module.exports = {
    name: 'edit-rank',
    description: 'Изменить ранг',
    aliases: ['editrank'],
    public: true,
    async execute(bot, message, args) {
        const defRanks = ['user','vip','moder','admin','superadmin','owner']
        let clanIID = args[0]
        let rankName = args[1]
        let rankNewPerms = args[2]
        let clanTable = await Clan.findOne({ clanID: clanIID, guildID: message.guild.id })
        if(!clanTable)return(message.reply(":x: Клан с таким ID не найден"))
        let toR = false
        await checkRights(clanIID, message.guild.id, 5, message.member).then(a => {
            if(a !== true){
                message.reply(":x: Вы не состоите в этом клане, либо не имеете прав доступа владельца.")
                toR = true
                return
            }
        })
        if(toR === true)return
        if(!rankName)return(message.reply(":x: Аргументы: [id] [rankName] [newRankPerms]"))
        let toR2 = false
        if(defRanks.includes(rankName))return(message.reply(":x: Вы не можете изменить стандартный ранг."))
        await checkRankHas(clanIID, message.guild.id, rankName).then(r => {
            if(r!==true)return(message.reply(":x: Ранга с таким именем не существует."), toR2 = true)
        })
        if(toR2===true)return
        let toPerms = parseInt(rankNewPerms)
        if(toPerms < 0 || toPerms >= 5 || isNaN(toPerms))return(message.reply(":x: Новые права должны быть от 0 до 4. (5 - владелец)"))
        for(const rank of clanTable.ranks){
            if(rank.rankName === rankName){
                rank.rankAccessLevel = toPerms
            }
        }
        setTimeout(async() => {
            await clanTable.save()
            await message.channel.send(`✅ Ранг ${rankName} в клане ${clanTable.clanName} изменён. Новые права - ${toPerms}.`)
        }, 100)
    }
}