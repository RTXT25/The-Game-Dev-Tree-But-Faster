addLayer("u", {
    name: "updates",
    symbol: "U",
    color: updatesColor,
    row: 0,
    position: 0,
    resource: "updates",
    baseResource: "hours of work",
    infoboxes: {
        lore: {
            title: "updates",
            body: "You've started working on this great little game idea you've had kicking around for awhile! Unfortunately, the longer you work on it the less your productivity seems to translate into hours of work :/<br/><br/>" +
                  "Also, if you're familiar with other TPT mods, you should know this one works differently: layers are only reset along branches!"
        }
    },
    resetDescription: "Release new build for ",
    startData() { return {
        unlocked: true,
        best: new Decimal(0),
        points: new Decimal(0),
    }},
    layerShown: true,
    type: "static",
    requires: new Decimal(5),
    base: new Decimal(0.1),
    baseAmount() { return player.points },
    exponent: 0.5,
    gainMult() {
        mult = new Decimal(1).div(buyableEffect("f", 12))
        if (hasUpgrade("u", 21)) mult = mult.div(2)
        if (hasUpgrade("e", 11)) mult = mult.div(upgradeEffect("e", 11))
        if (hasUpgrade("l", 13)) mult = mult.div(upgradeEffect("l", 13))
        if (!inChallenge("d", 11)) {
            if (hasUpgrade("u", 31) && hasUpgrade("g", 13)) mult = mult.div(10)
            if (hasUpgrade("u", 41) && hasUpgrade("g", 13)) mult = mult.div(upgradeEffect("u", 41))
            if (hasUpgrade("u", 32) && hasUpgrade("g", 13)) mult = mult.pow(2)
            if (hasUpgrade("u", 42) && hasUpgrade("g", 13)) mult = mult.pow(upgradeEffect("u", 42))
        }
        mult = mult.pow(buyableEffect("a", 13))
        if (hasUpgrade("l", 13) && !inChallenge("d", 21)) mult = mult.pow(2)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    roundUpCost: true,
    canBuyMax() { return true },
    doReset(resettingLayer) {
        if (resettingLayer != 'u') {
            const keep = [ 'best' ]
            if (hasMilestone("s", 0)) keep.push('upgrades')
            layerDataReset(this.layer, keep)
        }
    },
    resetsNothing() { return hasMilestone("d", 0) },
    hotkeys: [
        {
            key: "u",
            description: "Press U to release a new build",
            onPress() { if (canReset(this.layer)) doReset(this.layer) }
        }
    ],
    tabFormat: [
        ["infobox", "lore"],
        "main-display",
        "prestige-button",
        "blank",
        "upgrades"
    ],
    upgrades: {
        rows: 4,
        cols: 3,
        11: {
            title: "Convince your friend to help",
            description: "Double your productivity by convincing your friend to help with your game",
            cost: new Decimal(1),
            currencyDisplayName: "hours of work",
            currencyInternalName: "points",
            currencyLocation: ""
        },
        12: {
            title: "Create a github repo",
            description: "Increase your productivity by a massive 50% by opening the floodgates to countless open source developers",
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("u", 11) }
        },
        13:{
            title: "GFuel",
            description: "Increase your produtivity by way to much GFuel",
            cost: new Decimal(1),
        },
        21: {
            title: "Bug fixes count as updates, right?",
            description: "Double your update gain by counting the follow-up bug fixing patch as a separate update",
            cost: new Decimal(1),
            currencyDisplayName: "hours of work",
            currencyInternalName: "points",
            currencyLocation: "",
            unlocked() { return hasUpgrade("u", 11) }
        },
        22: {
            title: "Motivation Momentum",
            description: "Increase productivity by how many current updates have been released",
            cost: new Decimal(1),
            effect() { return player.u.points.add(1) },
            unlocked() { return hasUpgrade("u", 12) }
        },
        31: {
            title: "Cosmetics Economy",
            description: "Let the community make and sell cosmetics in-game, giving 10x update gain",
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("g", 13) && !inChallenge("d", 11) }
        },
        32: {
            title: "Workshop Support",
            description: "Add support for community made mods, squaring update gain",
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("g", 13) && !inChallenge("d", 11) }
        },
        41: {
            title: "Featured creators",
            description: "Make a featured section for popular community creators, multiplying update gain based on the amount of good will",
            cost: new Decimal(1),
            effect() {
                let ret = player.g.unused
                if (challengeCompletions("d", 12) > 0) ret = ret.add(player.g.points.sub(player.g.unused).div(2))
                return ret.pow10()
            },
            unlocked() { return hasUpgrade("g", 13) && !inChallenge("d", 11) }
        },
        42: {
            title: "Community Updates",
            description: "Bundle a bunch of mods together and release them as an \"update\", raising update gain to a power based on the amount of good will",
            cost: new Decimal(1),
            effect() {
                let ret = player.g.unused
                if (challengeCompletions("d", 12) > 0) ret = ret.add(player.g.points.sub(player.g.unused).div(2))
                return ret.add(1)
            },
            unlocked() { return hasUpgrade("g", 13) && !inChallenge("d", 11) }
        }
    }
})
