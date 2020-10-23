const schema1 = mongoose.Schema({
    guildID: String,
    prefix: String,

    banned: { type: Boolean, default: false }
});
module.exports.guild = mongoose.model("Guild", schema1)
const schema2 = mongoose.Schema({
    guildID: String,
    userID: String,

    warns: {type: Number, default: 0},
    bio: { type: String, default: "<prefix>bio [Текст BIO-Информации]" }
});
module.exports.user = mongoose.model("User", schema2)
const schema3 = mongoose.Schema({
    guildID: String,
    clanName: String,
    clanID: Number,
    clanBIO: String,
    owner: String,
    members: [{
        userID: String,
        userRank: { type: String, default: "user" }
    }],
    ranks: [{
        rankName: String,
        rankAccessLevel: { type: Number, default: 0 }
    }]

});
module.exports.clan = mongoose.model("Clan", schema3)
