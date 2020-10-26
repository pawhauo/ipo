global.Discord = require('discord.js')
global.fs = require('fs')
global.mongoose = require('mongoose')
const bot = new Discord.Client()
const MainCfg = require('./configs/mainConfig.json')
const CanaryCfg = require('./configs/canaryConfig.json')
global.User = require('./configs/mongoConfig').user
global.Guild = require('./configs/mongoConfig').guild
global.Clan = require('./configs/mongoConfig').clan
bot.cfg = CanaryCfg
bot.commands = new Discord.Collection()
mongoose.connect(bot.cfg.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected',async()=>{
    await console.log('[IPO | DATABASE] - Successful connected to databases!')
})
mongoose.connection.on('error', async (err) => {
    await console.error(`[IPO | DATABASE] - Errored! Process emergency exited. Reason: ${err}`)
    process.exit()
})
fs.readdirSync('./managers/commands').forEach(module => {
    const commandFiles = fs.readdirSync(`./managers/commands/${module}/`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./managers/commands/${module}/${file}`);
        command.category = module;
        bot.commands.set(command.name, command);
    }
})
fs.readdir('./managers/events/', (err, files) => {
    if(err) console.log(err)
    files.forEach(file => {
        if(!file.endsWith('.js'))return
        const evt = require(`./managers/events/${file}`)
        let evtName = file.split('.')[0]
        //console.log(`Loaded |${evtName}| event file`)
        bot.on(evtName, evt.bind(null, bot))
    })
})
bot.on('message', async(message) => {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
    bot.nodb = (user) => message.channel.send(new Discord.MessageEmbed().setColor('RED').setDescription(`К сожелению **${user.tag}** нету в базе-данных.`));
    let user = await User.findOne({ guildID: message.guild.id, userID: message.author.id });
    let guild = await Guild.findOne({ guildID: message.guild.id });
    if(!user) { User.create({ guildID: message.guild.id, userID: message.author.id });}
    if(!guild) { Guild.create({ guildID: message.guild.id, prefix: bot.cfg.prefix }); }

    //if(guild.banned === true)return

    if (!message.content.startsWith(guild.prefix)) return;
    const args = message.content.slice(guild.prefix.length).trim().split(/ +/g);
    const cmdName = args.shift().toLowerCase();
    const command = bot.commands.get(cmdName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
    if(!command)return
    if(!bot.cfg.owner.includes(message.author.id) && command.public === false) return;
    command.execute(bot, message, args);
})
setTimeout(async () => {
   await bot.login(bot.cfg.token)
}, 1000)
