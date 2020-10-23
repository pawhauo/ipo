module.exports = {
    name: 'unwarn',
    description: 'Снять предупреждение пользователя',
    aliases: [],
    public: true,
    async execute(bot, message, args) {
      if(!message.member.permissions.has("BAN_MEMBERS"))return(message.reply(":x: Недостаточно прав для выполнения **unwarn**"))
      if(!message.mentions.members.first())return(message.reply(":x: Укажите участника для снятия предупреждения"))
      if(!message.mentions.members.first().bannable)return(message.reply(":x: Этот игрок имеет иммунитет к предупреждениям."))
      if(message.mentions.members.first() === message.member)return(message.reply(":x: Вы не можете использовать эту комманду на самом себе"))
      let reason = args.slice(1).join(" ") || "Не указано"
      let uTable = await User.findOne({ userID: message.mentions.members.first().id, guildID: message.guild.id })
      if(!uTable)return(message.reply(":x: Пользователь не найден или не инициализирован"))
      if(uTable.warns - 1 < 0)return(message.reply(":x: У данного пользователя и так мало предупреждений"))
        uTable.warns--
        setTimeout(() => {
          uTable.save()
        }, 1000)
        message.channel.send(`> Администратор ${message.member} снял предупреждение игрока ${message.mentions.members.first()} из-за ${reason}. (Осталось: ${uTable.warns}/3)`)
    }
}
