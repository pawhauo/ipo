module.exports = {
    name: 'purge',
    description: 'Массовая очистка сообщений',
    aliases: [],
    public: true,
    async execute(bot, message, args) {
      if(!message.member.permissions.has("MANAGE_MESSAGES"))return(message.reply(":x: Недостаточно прав для выполнения **purge**"))
      if(args[0] >= 101 || args[0] <= 0 || isNaN(args[0]))return(message.reply(":x: Укажите кол-во сообщения для очистки (1-100)"))
      await message.react("✅").then(() => {
        setTimeout(() => {
          message.channel.bulkDelete(args[0])
        }, 5000)
      })
    }
}
