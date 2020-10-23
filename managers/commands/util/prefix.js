module.exports = {
    name: 'prefix',
    description: 'Установить префикс на сервере',
    aliases: [],
    public: true,
    async execute(bot, message, args) {
        if(!message.member.permissions.has("ADMINISTRATOR"))return(message.reply(':x: Недостаточно прав для использования **prefix**'))
        let prefix = args[0]
        if(!prefix || prefix.length >= 6 || prefix.length <= 0)return(message.reply(':x: Укажите префикс длинной не более 5 символов.'))
        let gTable = await Guild.findOne({ guildID: message.guild.id })
        gTable.prefix = prefix
        setTimeout(async() => {
            await gTable.save()
            await message.channel.send(`> :white_check_mark: Администратор ${message.member} изменил префикс сервера на **${prefix}**`)
        }, 1000)
    }
}