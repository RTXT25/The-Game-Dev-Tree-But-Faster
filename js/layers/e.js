addLayer("e", {
    name: "experience",
    symbol: "E",
    color: experienceColor,
    branches: [ 'u' ],
    row: 1,
    position: 0,
    resource: "experience",
    baseResource: "updates",
    infoboxes: {
        lore: {
            title: "experience",
            body: "Look, maybe that idea just wasn't very good. You just saw a comment online that gave you this idea for a much better game! You can't even bear to think of your current game now that this new idea is in your head!<br/><br/>" +
                  "Don't worry, though, you're sure your time spent on that last idea will surely help you on this one."
        }
    },
    resetDescription: "Start Over for ",
    startData() { return {
        unlocked: false,
        total: new Decimal(0),
        points: new Decimal(0),
        exp: new Decimal(0)
    }},
    layerShown() { return player[this.layer].unlocked || player.u.best.gte(3) },
    type: "normal",
    requires: new Decimal(5),
    baseAmount() { return player.u.points },
    exponent: 2,
    gainMult() {
        mult = new Decimal(1).mul(buyableEffect("f", 13)).mul(buyableEffect("a", 21))
        if (hasUpgrade("f", 11) && hasUpgrade("g", 12) && !inChallenge("d", 11)) mult = mult.mul(upgradeEffect("f", 11))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    roundUpCost: true,
    onPrestige(gain) {
        if (hasMilestone("d", 1)) addPoints("c", getResetGain("c"))
    },
    doReset(resettingLayer) {
        if (['r', 's', 'a', 't', 'd', 'l'].includes(resettingLayer)) {
            const shouldKeepUpgrades = {
                11: hasMilestone("r", 2),
                12: hasMilestone("r", 0),
                13: hasMilestone("r", 0),
                21: hasMilestone("r", 4),
                22: hasMilestone("r", 5),
                23: hasMilestone("r", 6)
            }
            const upgradesToKeep = []
            for (let upgrade of player[this.layer].upgrades) {
                if (shouldKeepUpgrades[upgrade]) {
                    upgradesToKeep.push(upgrade)
                }
            }
            layerDataReset(this.layer)
            player[this.layer].upgrades = upgradesToKeep
        }
    },
    resetsNothing() { return hasMilestone("s", 5) },
    effect() { return player.e.points.pow(buyableEffect("s", 11)).sqrt().add(1) },
    effectDescription() {
        return `multiplying base productivity by ${format(this.effect())}x.`
    },
    hotkeys: [
        {
            key: "e",
            description: "Press E to scrap your game and start over",
            onPress() { if (canReset(this.layer)) doReset(this.layer) }
        }
    ],
    tabFormat: [
        ["infobox", "lore"],
        "main-display",
        ["display-text", () => `Your total experience is also delaying the productivity slow down by ${format(player.e.total.mul(layers.r.effect()).mul(buyableEffect("a", 12)))} hours.`],
        "blank",
        "prestige-button",
        "blank",
        "upgrades"
    ],
    upgrades: {
        rows: 2,
        cols: 3,
        11: {
            title: "Learn a new programming language",
            description: "Wow! This programming language is so much easier to write in! Total experience now effects update gain",
            cost: new Decimal(1),
            effect() { return player.e.total.times(layers.r.effect()).clampMin(1).log10().add(1) }
        },
        12: {
            title: "Contact publisher",
            description: "Use your experience to contact a publisher, unlocking an adjacent prestige layer",
            cost: new Decimal(1)
        },
        13: {
            title: "Contact ad company",
            description: "Use your experience to contact an ad provider, unlocking passive cash generation",
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("e", 12) }
        },
        21: {
            title: "Read Game Programming Patterns",
            description: "This treasure trove of a book makes me twice as productive",
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("e", 12) }
        },
        22: {
            title: "Subscribe to Sebastian Lague",
            description: "Just being subscribed infuses you with enough knowledge to make you twice as productive",
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("e", 12) }
        },
        23: {
            title: "Play Davey Wreden's games",
            description: "Davey Wreden's insights on the relationships between games and their creators and players make you once again twice as productive",
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("e", 12) }
        }
    }
})
