module.exports = {
    name: 'info',
    description: 'Инфо о боте',
    aliases: [],
    public: true,
    async execute(bot, message, args) {
        let e1 = new Discord.MessageEmbed()
            .setTitle("IPO > Информация о боте")
            .setColor("GREEN")
            .addField("Сборка",`${bot.cfg.buildname}_${bot.cfg.buildversion}`, true)
            .addField("Разработчик", `ipodelicant#7777`, true)
            .addField("Библиотека", `DISCORD.JS (NodeJSv12)`, true)
            .addField("Сервер Поддержки", `[https://discord.gg/WDVWhQ3](https://discord.gg/WDVWhQ3)`, true)
            .addField("Сообщить о баге", `Вы можете на [Сервере поддержки](https://discord.gg/WDVWhQ3)`, true)
            .setTimestamp()
        message.channel.send(e1)
    }
}