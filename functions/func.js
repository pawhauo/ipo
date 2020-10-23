async function checkRights(clanID, guildid, rights, member){
    let toRank = parseInt(rights)
    let clanTable = await Clan.findOne({ clanID: clanID, guildID: guildid })
    if(!clanTable)return(new Error("Clan not found"))
    let ranks = clanTable.ranks
    let accessRanks = []
    for(const rank of ranks){
        if(rank.rankAccessLevel >= toRank){
            accessRanks.push(rank.rankName)
        }
    }
    let founded = false
    for(const memberr of clanTable.members){
        if(memberr.userID === member.id && accessRanks.includes(memberr.userRank)){
            founded = true
        }
    }
    return founded
}
module.exports.checkRights = checkRights

async function checkMember(clanID, member, guildid){
    let clanTable = await Clan.findOne({ clanID: clanID, guildID: guildid })
    if(!clanTable)return(new Error("Clan not found"))
    let toReturn = false
    for (const memberr of clanTable.members){
        if(memberr.userID === member.id){
            toReturn = true
            break;
        }
    }
    return toReturn
}
module.exports.checkMember = checkMember

async function checkAct(clanID, guildid, member1, member2){
    let clanTable = await Clan.findOne({ clanID: clanID, guildID: guildid })
    if(!clanTable)return(new Error("Clan not found"))
    let ranks = clanTable.ranks
    let memberOneRank
    let memberTwoRank
    for(const member of clanTable.members){
        if(member.userID === member1.id){
            memberOneRank = member.userRank
            break
        }
    }
    for(const member of clanTable.members){
        if(member.userID === member2.id){
            memberTwoRank = member.userRank
            break
        }
    }
    let mOneLVL
    let mTwoLVL
    for(const rank of clanTable.ranks){
        if(rank.rankName === memberOneRank){
            mOneLVL = rank.rankAccessLevel
            break
        }
    }
    for(const rank of clanTable.ranks){
        if(rank.rankName === memberTwoRank){
            mTwoLVL = rank.rankAccessLevel
            break
        }
    }
    let toReturn = false
    const toOne = parseInt(mOneLVL)
    const toTwo = parseInt(mTwoLVL)
    if(toOne >= toTwo){ toReturn = true }
    return toReturn
}
module.exports.checkAct = checkAct

async function setOwner(clanID, guildID, newOwner){
    let clanTable = await Clan.findOne({ clanID: clanID, guildID: guildid })
    if(!clanTable)return(new Error("Clan not found"))
    let oldOwner
    for(const member of clanTable.members){
        if(member.userRank === 'owner'){
            member.userRank = 'user'
            break
        }
    }
    for(const member of clanTable.members){
        if(member.userID === newOwner.id){
            member.userRank = 'owner'
        }
    }
    let roR = false
    clanTable.owner = newOwner.id
    setTimeout(async() => {
        await clanTable.save()
        if(clanTable.owner === newOwner.id){
            for(const member of clanTable.members){
                if(member.userID === newOwner.id && member.userRank === 'owner'){
                    roR = true
                }
            }
        }
    return roR
    }, 100)
}
module.exports.setOwner = setOwner

module.exports.checkRankHas = async (clanID, guildID, rankName) => {
    let clanTable = await Clan.findOne({ clanID: clanID, guildID: guildID })
    if(!clanTable)return(new Error("Clan not found"))
    let toR = false
    for(const rank of clanTable.ranks){
        if(rank.rankName === rankName){
            toR = true
            break
        }
    }
    return toR
}