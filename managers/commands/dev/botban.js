module.exports = {
    name: 'botban',
    description: '[DEV] Добавить гильдию в бан бота',
    aliases: [],
    public: false,
    async execute(bot, message, args) {
        let act = args[0]
        let id = args[1]
        if(!act || !id)return
        if(act === 'add') {
            if(id === "768194388185972747")return(message.reply(":x: You can`t ban support guild"))
            let uTable = await Guild.findOne({ guildID: id })
            if(!uTable)return(message.reply(":x: Guild not found"))
            if(uTable.banned === true)return(message.reply(":x: Guild arleady banned"))
            uTable.banned = true
            setTimeout(async() => {
                await uTable.save()
                await message.channel.send(':white_check_mark: Guild successfully banned.')
            }, 1000)
        }else if(act === 'remove'){
            let uTable = await Guild.findOne({ guildID: id })
            if(!uTable)return(message.reply(":x: Guild not found"))
            if(uTable.banned === false)return(message.reply(":x: Guild not banned"))
            uTable.banned = false
            setTimeout(async() => {
                await uTable.save()
                await message.channel.send(':white_check_mark: Guild successfully unbanned.')
            }, 1000)
        }
    }
}