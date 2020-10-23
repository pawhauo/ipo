module.exports = {
    name: 'create',
    description: 'Создать клан',
    aliases: ['create-clan'],
    public: true,
    async execute(bot, message, args) {
        let cancelledByUser = new Discord.MessageEmbed()
            .setTitle('Пользователь отменил создание клана.')
            .setColor('RED')

        let waiting = new Discord.MessageEmbed()
            .setTitle("Ждём решение администратора")
            .setDescription(`✅ - Подтвердить\n❌ - Отклонить`)
            .setColor("RED")

        let deAdmin = new Discord.MessageEmbed()
            .setTitle("Администратор отклонил создание клана")
            .setColor("RED")

        let created = new Discord.MessageEmbed()
            .setTitle("Клан создан!")
            .setColor("GREEN")

        let toClanID = 0
        let guildClans = await Clan.find({ guildID: message.guild.id }, function(err, data){
            console.log(data)
        })
        console.log(guildClans)
        for( let clanID in guildClans) {
            if(!clanID){ toClanID = 0; break; }
            if(toClanID <= clanID){
                toClanID++
            }else{
                break
            }
        }
        console.log(toClanID)
        let cc = await Clan.find({ ownerID: message.member.id, guildID: message.guild.id })
        if(cc.length >= 1)return(message.reply(":x: Вы не можете создать более 1 клана. Обратитесь к администратору сервера."))
        let toClanName = args.slice(0).join(" ")
        if(!toClanName)return(message.reply(":x: !create [clanName]"))
        let e1 = new Discord.MessageEmbed()
            .setTitle("Всё верно?")
            .setDescription(`Название клана - ${toClanName}\n[AUTO] ID Клана: ${toClanID}`)
            .addField("Значение реакций:",`📗 - Да, всё верно, отправьте мой клан на подтверждение администрации.\n📕 - Нет, я ошибся или передумал. Отмените создание клана.`)
            .setColor("ORANGE")
        await message.channel.send(e1).then(async m => {
            await m.react('📗')
            await m.react('📕')
            await m.react('✅')
            await m.react('❌')
            let reacted = false
            const filter = (reaction, user) => { return ['📗', '📕'].includes(reaction.emoji.name) && user.id === message.author.id };
            const userCollector = m.createReactionCollector(filter, { time: 15000 });
            userCollector.on('collect', async reaction => {
                console.log('collec')
                if(reaction.emoji.name === "📗"){
                    reacted = true
                    await m.edit(waiting)
                    const AFilter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && message.guild.member(user).permissions.has("ADMINISTRATOR") };
                    const ACollector = m.createReactionCollector(AFilter, { time: 30000 });
                    let areacted = false
                    ACollector.on('collect', async reaction => {
                        if(reaction.emoji.name === "✅"){
                            areacted = true
                            Clan.create({
                                guildID: message.guild.id,
                                clanName: toClanName,
                                clanID: toClanID,
                                clanBIO: "Не указано",
                                owner: message.member.id,
                                members: [{
                                    userID: message.member.id,
                                    userRank: 'owner',
                                }],
                                ranks: [
                                    {
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
                                    }
                                ]
                            })
                           await m.reactions.removeAll()
                            message.channel.send("Клан создан.")
                            m.edit(created)
                            areacted = true
                            ACollector.stop()
                            return
                        }else if(reaction.emoji.name === "❌"){
                            await m.edit(deAdmin)
                            areacted = true
                            message.channel.send(":x: Создание отменено администратором.")
                            ACollector.stop()
                            return
                        }
                    })
                    ACollector.on('end', async () => {
                        if(areacted === true)return
                        else { message.channel.send(":x: Администратор не нажал на реакцию. Создание отменено."); await m.edit(deAdmin); return; }
                    })
                    userCollector.stop()
                }else if(reaction.emoji.name === "📕"){
                    userCollector.stop()
                    await m.edit(cancelledByUser)
                    reacted = true
                    message.channel.send(":x: Создание отменено.")
                    return
                }
            })
            userCollector.on('end', async () => {
                if(reacted === true)return
                else { message.channel.send(":x: Вы не успели нажать на реакцию. Создание отменено."); await m.edit(cancelledByUser); return; }
            })
        })

    }
}