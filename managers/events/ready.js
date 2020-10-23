module.exports = (bot) => {
    console.log(`[BOT | CLIENT] Started and logged as ${bot.user.tag} | ShardID: ${bot.shard.ids}`)
    bot.presence.set({ activity: { type: "LISTENING", name: "ipo!help > Клан бот от IpoTeams" } })
}