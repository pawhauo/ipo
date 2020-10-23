const { setOwner } = require('../../../functions/func')
module.exports = {
    name: 'forceSetOwner',
    description: 'Предварительно установить владельца [0]',
    aliases: [],
    public: true,
    async execute(bot, message, args) {
        if(!message.member.permissions.has("ADMINISTRATOR"))return(message.reply(":x: Недостаточно прав для выполенния **forceSetOwner**"))
        let clannID = args[0]
        let toOwner = message.mentions.members.first()
        let clanTable = await Clan.findOne({ clanID: clannID })
        if(!clanTable)return(message.reply(":x: Клан с таким ID не найден."))
        if(!toOwner)return(message.reply(":x: Укажите участника которому передать владение."))
        let oldOwner
        let oldOwnerID
        let r1 = false
        for(const mem of clanTable.members){
            if(mem.userID === toOwner.id){
                r1 = true
                break
            }
        }
        if(r1===false)return(message.reply(":x: Этот пользователь не состоит в клане"))
        for(const member of clanTable.members){
            if(member.userRank === 'owner'){
                oldOwnerID = member.userID
                break
            }
        }
        oldOwner = message.guild.member(bot.users.fetch(oldOwnerID))

    }
}