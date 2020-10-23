module.exports = {
    name: 'kick',
    description: 'Выгнать пользователя',
    aliases: [],
    public: true,
    async execute(bot, message, args) {
      if(!message.member.permissions.has("KICK_MEMBERS"))return(message.reply(":x: Недостаточно прав для выполенния **kick**"))
      if(!message.mentions.members.first())return(message.reply(":x: Укажите участника для кика"))
      if(message.mentions.members.first() === message.member)return(message.reply(":x: Вы не можете использовать эту комманду на самом себе"))
      let reason = args.slice(1).join(" ") || "Не указано"
      if(!message.mentions.members.first().kickable)return(message.reply(":x: Этот пользователь не может быть кикнут."))
      message.mentions.members.first().kick(`${message.author.tag} | ${reason}`).then(() => {
        message.channel.send(`> ${message.member} кикнул ${message.mentions.members.first()}; Причина: ${reason} `)
      }).catch(() => {
        message.channel.send(`> Произошла неизвестная ошибка.`)
      })
    }
}
