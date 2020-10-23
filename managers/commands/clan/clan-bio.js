const checkRights = require('../../../functions/func.js').checkRights
module.exports = {
    name: 'clan-bio',
    description: 'Установить БИО-Информацию клана',
    aliases: ["clanbio"],
    public: true,
    async execute(bot, message, args) {
        let clanIID = args[0]
        let toBio = args.slice(1).join(" ")
        let clanTable = await Clan.findOne({ clanID: clanIID })
        if(!clanTable)return(message.reply(":x: Клан с таким ID не найден"))
        let toR = false
        await checkRights(clanIID, message.guild.id, 3, message.member).then(a => {
            if(a !== true){
                message.reply(":x: Вы не состоите в этом клане, либо не имеете прав доступа **3**")
                toR = true
                return
            }
        })
        if(toR === true)return
        if(toBio.length <= 0 || toBio.length >= 1000)return(message.reply(":x: Длинна BIO-Описания должна состоять не менее чем из 1 символа, и не более чем 1000 символов."))
        clanTable.clanBIO = toBio
        setTimeout(async () => {
            await clanTable.save()
            await message.channel.send("✅ Описание клана установлено")
        })
    }
}