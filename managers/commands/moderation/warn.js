module.exports = {
    name: 'warn',
    description: 'Предупредить пользователя',
    aliases: [],
    public: true,
    async execute(bot, message, args) {
      if(!message.member.permissions.has("BAN_MEMBERS"))return(message.reply(":x: Недостаточно прав для выполнения **warn**"))
      if(!message.mentions.members.first())return(message.reply(":x: Укажите участника для выдачи предупреждения"))
      if(!message.mentions.members.first().bannable)return(message.reply(":x: Этот игрок имеет иммунитет к предупреждениям."))
      if(message.mentions.members.first() === message.member)return(message.reply(":x: Вы не можете использовать эту комманду на самом себе"))
      let reason = args.slice(1).join(" ") || "Не указано"
      let uTable = await User.findOne({ userID: message.mentions.members.first().id, guildID: message.guild.id })
      if(!uTable)return(message.reply(":x: Пользователь не найден или не инициализирован"))
      if(uTable.warns + 1 >= 3){
        message.channel.send(`> Администратор ${message.member} предупредил игрока ${message.mentions.members.first()} за ${reason}. (3/3 - Забанен)`)
        message.mentions.members.first().ban({ days: 7, reason: `${message.author.tag} > Предупреждение 3/3` })
        User.deleteOne({ userID: message.mentions.members.first().id, guildID: message.guild.id }, function(er, re){
        //  if(er)console.error(er)
        //  console.log(re)
        })
      }else{
        uTable.warns++
        setTimeout(() => {
          uTable.save()
        }, 1000)
        message.channel.send(`> Администратор ${message.member} предупредил игрока ${message.mentions.members.first()} за ${reason}. (${uTable.warns}/3)`)
      }
    }
}
