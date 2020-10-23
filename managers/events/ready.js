module.exports = (bot) => {
    let sid
    if(bot.shard) sid=bot.shard.ids
    else sid="NOT_SHARDED"
    console.log(`[BOT | CLIENT] Started and logged as ${bot.user.tag} | ShardID: ${sid}`)
    bot.presence.set({ activity: { type: "LISTENING", name: "ipo!help > Клан бот от IpoTeams" } })
}