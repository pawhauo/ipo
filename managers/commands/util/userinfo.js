const moment = require('moment')
moment.locale('ru')
module.exports = {
    name: 'userinfo',
    description: 'Узнать инфо о пльзователе',
    aliases: [],
    public: true,
    async execute(bot, message, args) {
        let argsUser = message.mentions.members.first() || message.member
        let status = {
            "online": "<:online:768433537455489034> Онлайн",
            "dnd": "<:dnd:768433537476067338> Не беспокоить",
            "idle": "<:idle:768433537484849152> Нет на месте",
            "offline": "<:offline:768433537585381376> Оффлайн"
        }
        let devices = {
            "web": "с браузера 🌐",
            "mobile": "с телефона 📱",
            "desktop": "с компьютера 💻"
        }
        let userDevice
        if(argsUser.user.presence.status !== "offline"){
            userDevice = "<:online:768433537455489034> В сети "+devices[Object.keys(argsUser.user.presence.clientStatus)]
        }else{
            userDevice = "<:offline:768433537585381376> Пользователь оффлайн."
        }
        let gTable = await Guild.findOne({ guildID: message.guild.id })
        let uTable = await User.findOne({ userID: argsUser.id, guildID: message.guild.id })
        if(!uTable)return(message.reply(":x: Пользователь мне неизвестен."))
        let bio = uTable.bio.replace(/<prefix>/gi, gTable.prefix)

        let names
        let gangCount
        await Clan.find({ owner: argsUser.id, guildID: message.guild.id }, async (err, data) => {
            names = data.map(g => g.clanName).join(',') || "Отсутствуют"
            gangCount = data.length
            //console.log(data)
            //console.log(err)
        })

        //console.log(`${gangs} ||| ${gangCount}`)
        let unames = ""
        let ugangCount = 0
        await Clan.find({ guildID: message.guild.id }, async (err, data) => {
            for (const clan of data){
                for(const member of clan.members){
                    if(member.userID === argsUser.id){
                        unames += `${clan.clanName}, `
                        ugangCount++
                    }
                }
            }
        })

        //console.log(JSON.stringify(argsUser.user.presence.clientStatus))
        //console.log(`${ugangs} | ${unames} | ${ugangCount} ||| ${gangs} | ${names} | ${gangCount}`)

        let embed = new Discord.MessageEmbed()
            .setAuthor(`${argsUser.user.tag}`,`${argsUser.user.avatarURL()}`)
            .setTitle("Информация о пользователе > "+argsUser.user.tag)
            .setDescription(bio)
            .setColor(argsUser.displayColor)
            .addField("ID", `${argsUser.id}`, true)
            .addField('Вошёл на сервер:', `${moment.utc(argsUser.joinedAt).format('dddd, Do MMMM  YYYY, HH:mm:ss')} (${moment.utc(argsUser.joinedAt).fromNow()})`, true)
            .addField('Создал аккаунт:', `${moment.utc(argsUser.user.createdAt).format('dddd, Do MMMM  YYYY, HH:mm:ss')} (${moment.utc(argsUser.user.createdAt).fromNow()})`, true)
            .addField("Роли:", `${argsUser.roles.cache.map(r => `${r}`).join(" | ")}`, true)
            .addField("Статус:",`${status[argsUser.presence.status]}`, true)
            .addField("Предупреждений:", `${uTable.warns}`, true)
            .addField("Устройство:", `${userDevice}`)

        setTimeout(() => {
            embed.addField("Кланы (Владелец):", `${names} [${gangCount}]`, true)
            embed.addField("Кланы (Участник):",`${unames} [${ugangCount}]`, true)
        }, 100)
        setTimeout(() => {
            message.channel.send(embed)
        }, 500)


    }
}