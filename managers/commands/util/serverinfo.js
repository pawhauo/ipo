module.exports = {
    name: 'serverinfo',
    description: 'Информация о сервере',
    aliases: [],
    public: true,
    async execute(bot, message, args) {
        function checkDays(date) {
            let now = new Date();
            let diff = now.getTime() - date.getTime();
            let days = Math.floor(diff / 86400000);
            return days + (days == 1 ? " day" : " days") + " ago";
        };
        let verifLevels = {
            "NONE": "Отсутствует",
            "LOW": "Низкий",
            "MEDIUM": "Средний",
            "HIGH": "Высокий",
            "VERY_HIGH": "Очень высокий"
        }
        let region = {
            "brazil": ":flag_br: Бразилия",
            "eu-central": ":flag_eu: Центральная Европа",
            "singapore": ":flag_sg: Сингапур",
            "us-central": ":flag_us: США Центральный",
            "sydney": ":flag_au: Сидней",
            "us-east": ":flag_us: Запад США",
            "us-south": ":flag_us: Юг США",
            "us-west": ":flag_us: Восток США",
            "eu-west": ":flag_eu: Восточная Европа",
            "vip-us-east": ":flag_us: ВИП-СЕРВЕР США ЮГ",
            "london": ":flag_gb: Лондон",
            "amsterdam": ":flag_nl: Амстердам",
            "hongkong": ":flag_hk: Гонк конг",
            "russia": ":flag_ru: Россия",
            "southafrica": ":flag_za: Южная Африка"
        };
        const embed = new Discord.MessageEmbed()
            .setThumbnail(message.guild.iconURL())
            .setTitle(`${message.guild.name} | Информация о сервере`)
            .addField("ID", message.guild.id, true)
            .addField("Владелец", `${message.guild.owner.user.tag}`, true)
            .addField("Регион", region[message.guild.region], true)
            .addField(`Участники:`, `<:users:768433537502150676> Всего: ${message.guild.members.cache.size}\n<:user:768433537132920833> Людей: ${message.guild.members.cache.filter(member => !member.user.bot).size}\n<:bot:768433537485111296> Ботов: ${message.guild.members.cache.filter(member => member.user.bot).size}`, true)
            .addField("Уровень проверки", verifLevels[message.guild.verificationLevel], true)
            .addField("Каналов", `<:category:768433537434386472> Категорий: ${message.guild.channels.cache.filter(c => c.type === 'category').size}\n<:voice:768433537161625602> Голосовых: ${message.guild.channels.cache.filter(c => c.type === 'voice').size}\n<:text:768433537329397811> Текстовых: ${message.guild.channels.cache.filter(c => c.type === 'text').size}`, true)
            .addField("Роли", message.guild.roles.cache.size, true)
            .addField("Дата создания", `${message.channel.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})`, true)
            .addField("Статусы",`<:online:768433537455489034> Онлайн: ${message.guild.presences.cache.filter(p => p.status === 'online').size}\n<:dnd:768433537476067338> Не беспокоить: ${message.guild.presences.cache.filter(p => p.status === 'dnd').size}\n<:idle:768433537484849152> Нет на месте: ${message.guild.presences.cache.filter(p => p.status === 'idle').size}\n<:offline:768433537585381376> Оффлайн: ${message.guild.presences.cache.filter(p => p.status === 'offline').size}`)
            .addField("Кластер", `IPO-#${message.guild.shardID+1}`)
            .setFooter("Информация о сервере >")
            .setTimestamp()
        message.channel.send({embed});
    }
}