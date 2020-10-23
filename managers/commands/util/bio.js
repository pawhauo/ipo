module.exports = {
    name: 'bio',
    description: 'Установить информацию в поле О СЕБЕ',
    aliases: [],
    public: true,
    async execute(bot, message, args) {
        let uTable = await User.findOne({ userID: message.member.id, guildID: message.guild.id })
        if(args.slice(0).join(" ").length >= 1000 || args.slice(0).join(" ").length <= 0)return(message.reply(":x: Укажите BIO Информацию длинной не более чем в 1000 букв."))
        uTable.bio = args.slice(0).join(" ")
        setTimeout(() => {
            uTable.save()
            message.channel.send(":white_check_mark: Био-информация сохранена")
        }, 500)
    }
}