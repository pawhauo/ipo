module.exports = {
    name: 'help',
    description: 'Получить помощь по боту',
    aliases: [],
    public: true,
    async execute(bot, message, args) {
      let gT = await Guild.findOne({ guildID: message.guild.id })
      let prefix = gT.prefix
        let helped = new Discord.MessageEmbed()
        .setTitle("IPO > Помощь по коммандам")
        .setColor("GREEN")
        .setDescription('📗 - Комманда включена\n📙 - Комманда временно отключена\n📕 - Комманда в разработке или отключена')
        .addField('**> Определения**', `🔷[@user] - Упоминание пользователя\n🔷[clanName]; [rankName]; [reason]; [text]; - Текст\n🔷[newPerms | perms] - Права (0-4)`)
        .addField('**> Модерация**',`📗${prefix}ban [@user] [reason] - Забанить пользователя\n📗${prefix}kick [@user] [reason] - Кикнуть пользователя\n📗${prefix}warn [@user] [reason] - Предупредить пользователя\n📗${prefix}unwarn [@user] - Снять предупреждение\n📗${prefix}purge [1-100] - Очистить сообщения`)
        .addField('**> Утилиты**', `📗${prefix}help - Показать помощь\n📗${prefix}prefix - Сменить префикс\n📗${prefix}serverinfo - Информация о сервере\n📗${prefix}userinfo [@user] - Информация о пользователе\n📗${prefix}bio [text] - Установить биографию о себе.'`)
        .addField('**> Клановая система**', `📗${prefix}create [clanName] - Создать клан с разрешения администрации\n📗${prefix}delete-clan [id] - Удалить ваш клан\n📗${prefix}clan-bio [id] [text] - Установить информацию о клане\n📗${prefix}clan-rename [id] [clanName] - Переименовать клан\n📗${prefix}invite [id] [@user] - Пригласить пользователя в клан\n📗${prefix}member-kick [id] [@user] - Выгнать пользователя из клана\n📕${prefix}set-rank [id] [@member] [rankName] - Установить ранг пользователю\n📕${prefix}createrank [id] [rankName] [perms] - Создать ранг с определёнными правами\n📕${prefix}delete-rank [id] [rankName] - Удалить ранг\n📕${prefix}edit-rank [id] [rankName] [rename|perms] [newName|newPerms] - Редактировать ранг группы\n📕${prefix}transfer [id] [@newowner] - Передать клан`)
        .addField('**> Администраторам**', `📕${prefix}forceCreateClan [@owner] [clanName] - Принудительно создать клан\n📕${prefix}forceDeleteClan [clanID] - Принудительно удалить клан\n📕${prefix}forceSetOwner [clanID] [@newOwner] - Принудительно установить нового владельца клана`)
        .setTimestamp()
        .setFooter(`IPO > Developer by IPO Teams`, `${bot.user.displayAvatarURL()}`)

        message.channel.send(helped)
    }
}
