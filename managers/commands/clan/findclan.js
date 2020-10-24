module.exports = {
    name: 'find-clan',
    description: 'Найти клан по имени',
    aliases: ['findclan'],
    public: true,
    async execute(bot, message, args) {
        let toClanName = args.slice(0).join(" ")
        if(!toClanName)return(message.reply(":x: Укажите название по которому будем искать"))
        if(toClanName.length >= 1002)return(message.reply(":x: Слишком длинное название."))
        let toS = ""
        let dataa = await Clan.find({ guildID: message.guild.id })
        if(!dataa)return(message.reply(":x: Не найдено."))
        for(const clan of dataa){
            let clann = clan.clanName.toString().toLowerCase()
            if(clann.startsWith(`${toClanName.toLowerCase()}`)) {
                toS += `${clan.clanName} [ID: ${clan.clanID}]\n`
            }
        }
        if(toS === ""){ toS = "Не найдено:/" }
        let e1 = new Discord.MessageEmbed()
            .setTitle("Поиск по кланам")
            .setDescription("Название по которому будем искать: "+toClanName)
            .addField("Найдено:",`${toS}`, true)
            .setColor("GREEN")
        message.channel.send(e1)
    }
}