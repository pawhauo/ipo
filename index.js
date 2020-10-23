const { ShardingManager } = require('discord.js')
const manager = new ShardingManager('./bot.js', { token: "NzY4MjAwNTY2MTAyNTU2Njkz.X49Ahw.rI1eaOTlkcXe2Be1Wirk_FYPapw" })

manager.on('shardCreate', shard => {
    console.log(`---[BOT | SHARD] - Shard ${shard.id} launched.`)
})
manager.spawn(2);