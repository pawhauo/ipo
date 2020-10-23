module.exports = {
    name: 'forceCreateClan',
    description: 'Создать клан [A]',
    aliases: ['forcecreateclan'],
    public: true,
    async execute(bot, message, args) {
        if(!message.member.permissions.has("ADMINISTRATOR"))return(message.reply(":x: Недостаточно прав для выполенния **forceCreateClan**"))

        let toClanID = 0
        let guildClans = await Clan.find({ guildID: message.guild.id })
        //console.log(guildClans)
        for( let clanID in guildClans) {
            if(!clanID){ toClanID = 0; break; }
            if(toClanID <= clanID){
                toClanID++
            }else{
                break
            }
        }
        //console.log(toClanID)
        let cc = await Clan.find({ ownerID: message.member.id, guildID: message.guild.id })
        if(cc.length >= 1)return(message.reply(":x: Вы не можете создать более 1 клана. Обратитесь к администратору сервера."))
        let ow = message.mentions.members.first()
        if(!ow)return(message.reply(":x: !forceCreateClan [@owner] [clanName]"))
        let toClanName = args.slice(1).join(" ")
        if(!toClanName)return(message.reply(":x: !forceCreateClan [@owner] [clanName]"))
        Clan.create({
            guildID: message.guild.id,
            clanName: toClanName,
            clanID: toClanID,
            clanBIO: "Не указано",
            owner: ow.id,
            members: [{
                userID: ow.id,
                userRank: 'owner',
            }],
            ranks: [{
                    rankName: "user",
                    rankAccessLevel: 0
                },
                {
                    rankName: "vip",
                    rankAccessLevel: 1
                },
                {
                    rankName: "moder",
                    rankAccessLevel: 2
                },
                {
                    rankName: "admin",
                    rankAccessLevel: 3
                },
                {
                    rankName: "superadmin",
                    rankAccessLevel: 4
                },
                {
                    rankName: "owner",
                    rankAccessLevel: 5
                }]
        }).then(() => {
            message.channel.send(`✅ ${ow} теперь владеет кланом ${toClanName} с ID ${toClanID}. Выполнил: ${message.member}`)
        }).catch(async(err) => {
            let toerr = "```"+err+"```"
                message.channel.send(":x: Произошла непредвиденная ошибка.\n"+toerr)
        })
    }
}