const { checkRankHas, checkRights } = require('../../../functions/func.js')
module.exports = {
    name: 'delete-rank',
    description: 'Удалить ранг',
    aliases: ['deleterank'],
    public: true,
    async execute(bot, message, args) {
        const defRanks = ['user','vip','moder','admin','superadmin','owner']
        let clanIID = args[0]
        let rankName = args[1]
        let clanTable = await Clan.findOne({ clanID: clanIID })
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
        if(!rankName)return(message.reply(":x: Аргументы: [id] [rankName]"))
        let toR2 = false
        if(defRanks.includes(rankName))return(message.reply(":x: Вы не можете удалить стандартный ранг."))
        await checkRankHas(clanIID, message.guild.id, rankName).then(r => {
            if(r!==true)return(message.reply(":x: Ранга с таким именем не существует."), toR2 = true)
        })
        if(toR2===true)return
        clanTable.ranks = clanTable.ranks.filter(r => r.rankName !== rankName)
        setTimeout(async() => {
            await clanTable.save()
            await message.channel.send(`✅ Ранг ${rankName} в клане ${clanTable.clanName} удалён.`)
        }, 100)
    }
}