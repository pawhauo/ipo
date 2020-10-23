module.exports = {
    name: 'ban',
    description: 'Блокировка пользователя',
    aliases: [],
    public: true,
    async execute(bot, message, args) {
      if(!message.member.permissions.has("BAN_MEMBERS"))return(message.reply(":x: Недостаточно прав для выполенния **ban**"))
      if(!message.mentions.members.first())return(message.reply(":x: Укажите участника для бана"))
      if(message.mentions.members.first() === message.member)return(message.reply(":x: Вы не можете использовать эту комманду на самом себе"))
      let reason = args.slice(1).join(" ") || "Не указано"
      if(!message.mentions.members.first().bannable)return(message.reply(":x: Этот пользователь не может быть забанен."))
      message.mentions.members.first().ban({ days: 7, reason: `${message.author.tag} | ${reason}` }).then(() => {
        message.channel.send(`> ${message.member} забанил ${message.mentions.members.first()}; Причина: ${reason} `)
      }).catch(() => {
        message.channel.send(`> Произошла неизвестная ошибка.`)
      })
    }
}
