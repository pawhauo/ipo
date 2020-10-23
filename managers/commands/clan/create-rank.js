const { checkRankHas, checkRights } = require('../../../functions/func.js')
module.exports = {
    name: 'create-rank',
    description: 'Создать ранг',
    aliases: ['createrank'],
    public: true,
    async execute(bot, message, args) {
        let clanIID = args[0]
        let trankAccess = args[1]
        let rankName = args[2]
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
        if(!trankAccess || !rankName)return(message.reply(":x: Аргументы: [id] [rankAccessLevel] [rankName]"))
        if(rankName.length <= 0 || rankName.length >= 10)return(message.reply(":x: Вы не можете установить название ранга. Длина ранга должна иметь не более 10 символов и не менее 0."))
        let rankAccess = parseInt(trankAccess)
        if(rankAccess < 0 || rankAccess >= 5 || isNaN(rankAccess))return(message.reply(":x: Допустимый уровень доступа для рангов: 0-4. [5 уровень для владельцев клана]"))
        let toR2 = false
        await checkRankHas(clanIID, message.guild.id, rankName).then(r => {
            if(r!==false)return(message.reply(":x: Ранг с таким именем уже существует."), toR2 = true)
        })
        if(toR2===true)return
        clanTable.ranks.push({
            rankName: `${rankName}`,
            rankAccessLevel: rankAccess
        })
        setTimeout(async() => {
            await clanTable.save()
            await message.channel.send(`✅ Ранг ${rankName} с уровнем доступа ${rankAccess} в клане ${clanTable.clanName} создан.`)
        }, 100)
    }
}