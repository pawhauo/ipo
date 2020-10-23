const checkRights = require('../../../functions/func.js').checkRights
module.exports = {
    name: 'clan-rename',
    description: 'Установить новое имя клану.',
    aliases: ["clanrename"],
    public: true,
    async execute(bot, message, args) {
        let clanIID = args[0]
        let toName = args.slice(1).join(" ")
        let clanTable = await Clan.findOne({ clanID: clanIID })
        if(!clanTable)return(message.reply(":x: Клан с таким ID не найден"))
        let toR = false
       await checkRights(clanIID, message.guild.id, 4, message.member).then(a => {
            if(a !== true){
                message.reply(":x: Вы не состоите в этом клане, либо не имеете прав доступа **4**")
                toR = true
                return
            }
        })
        if(toR===true)return
        if(toName.length <= 0 || toName.length >= 50)return(message.reply(":x: Длинна нового имени должна состоять не менее чем из 1 символа, и не более чем 50 символов."))
        clanTable.clanName = toName
        setTimeout(async () => {
            await clanTable.save()
            await message.channel.send("✅ Новое имя установлено")
        }, 500)
    }
}