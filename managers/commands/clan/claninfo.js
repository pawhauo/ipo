module.exports = {
    name: 'clan-info',
    description: 'Просмотреть информацию о клане',
    aliases: ['claninfo'],
    public: true,
    async execute(bot, message, args) {
        let toClanIID = args[0]
        let clanTable = await Clan.findOne({ guildID: message.guild.id, clanID: toClanIID })
        if(!clanTable)return(message.reply(":x: Клан с таким ID не найден."))
        let ow = bot.users.cache.find(u => u.id === clanTable.owner)
        let embed = new Discord.MessageEmbed()
            .setTitle(`Информация о клане ${clanTable.clanName}`)
            .setDescription(`Описание: ${clanTable.clanBIO}`)
            .addField("Владелец", `${ow} (${clanTable.owner})`, true)
            .addField("Участников", `${clanTable.members.length}`, true)
            .addField("Рангов", `${clanTable.ranks.length-5} [5 стандартных]`, true)
            .setColor("ORANGE")
        message.channel.send(embed)
    }
}