addLayer("c", {
    name: "cash",
    symbol: "C",
    color: cashColor,
    branches: [ 'u' ],
    row: 1,
    position: 1,
    resource: "cash",
    baseResource: "updates",
    infoboxes: {
        lore: {
            title: "cash",
            body: `<span style="color: ${cashColor}">Selling</span> your game to a publisher means needing to start over on a new one, but you can use the <span style="color: ${cashColor}">money</span> to finally upgrade your PC! You're confident buying new hardware and such is the best way to work more efficiently.`
        }
    },
    resetDescription: "Sell game to publisher for ",
    startData() { return {
        unlocked: false,
        total: new Decimal(0),
        points: new Decimal(0)
    }},
    layerShown() { return player[this.layer].unlocked || hasUpgrade("e", 12) },
    type: "normal",
    requires: new Decimal(10),
    baseAmount() { return player.u.points },
    exponent: 1.5,
    gainMult() {
        mult = new Decimal(100).mul(buyableEffect("f", 12))
        if (hasUpgrade("f", 12) && hasUpgrade("g", 12)) mult = mult.mul(upgradeEffect("f", 12))
        if (hasUpgrade("l", 11)) mult = mult.mul(upgradeEffect("l", 11))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    roundUpCost: true,
    onPrestige(gain) {
        if (hasMilestone("d", 1)) addPoints("e", getResetGain("e"))
    },
    doReset(resettingLayer) {
        if (['s', 'f', 't', 'd', 'l', 'g'].includes(resettingLayer)) {
            const shouldKeepUpgrades = {
                11: hasMilestone("f", 0),
                12: hasMilestone("f", 1),
                13: hasMilestone("f", 2),
                14: hasMilestone("f", 3),
                21: hasMilestone("f", 4),
                22: hasMilestone("f", 5),
                23: hasMilestone("f", 6),
                24: hasMilestone("f", 7),
                111: hasMilestone("s", 3),
                112: hasMilestone("s", 3),
                113: hasMilestone("s", 3),
                114: hasMilestone("s", 3),
                121: hasMilestone("s", 3),
                122: hasMilestone("s", 3),
                123: hasMilestone("s", 3),
                124: hasMilestone("s", 3)
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
    hotkeys: [
        {
            key: "c",
            description: "Press C to sell your game to a publisher",
            onPress() { if (canReset(this.layer)) doReset(this.layer) }
        }
    ],
    tabFormat: [
        ["infobox", "lore"],
        "main-display",
        ["display-text", function() {
                return hasUpgrade("e", 13) && tmp.c.resetGain.times ? `(${format(tmp.c.resetGain.times(layers.c.revenue(1)))}/sec)` : ""
            },
            { "marginTop": "-1em", "display": "block" }
        ],
        "blank",
        "prestige-button",
        "blank",
        () => hasUpgrade("e", 13) ? ["display-text", "Equipment", { "font-size": "32px" }] : [],
        () => hasUpgrade("e", 13) ? "blank" : [],
        "buyables",
        "blank",
        "upgrades",
        () => hasUpgrade("e", 13) ? ["display-text", "Revenue", { "font-size": "32px" }] : [],
        () => hasUpgrade("e", 13) ? "blank" : [],
        () => hasUpgrade("e", 13) ? ["row", [["upgrade", 111], ["upgrade", 112], ["upgrade", 113], ["upgrade", 114]]] : [],
        () => hasUpgrade("g", 11) && !inChallenge("d", 11) ? ["row", [["upgrade", 121], ["upgrade", 122], ["upgrade", 123], ["upgrade", 124]]] : []
    ],
    update(diff) {
        generatePoints("c", this.revenue(diff))
    },
    shouldNotify() {
        return canAffordPurchase("c", layers[this.layer].buyables[11], layers[this.layer].buyables[11].cost())
    },
    upgrades: {
        rows: 2,
        cols: 4,
        11: {
            title: "Buy premium text editor",
            description: "Purchase a text editor, allowing you to double your productivity",
            cost: new Decimal(1)
        },
        12: {
            title: "Buy premium git client",
            description: "Purchase a git client, allowing you to double your productivity",
            cost: new Decimal(1)
        },
        13: {
            title: "Buy ambient sound machine",
            description: "Purchase an overpriced machine to do a website's job, allowing you to double your productivity",
            cost: new Decimal(1)
        },
        14: {
            title: "Buy Keurig",
            description: "Purchase an overhyped coffee machine, allowing you to double your productivity",
            cost: new Decimal(1)
        },
        21: {
            title: "Buy incense burner",
            description: "Purchase an overpriced incense burner, allowing you to double your productivity",
            cost: new Decimal(1)
        },
        22: {
            title: "Buy mechanical keyboard",
            description: "Purchase an overpriced keyboard, allowing you to double your productivity at the expense of your coworkers'",
            cost: new Decimal(1)
        },
        23: {
            title: "Buy massaging chair",
            description: "Purchase an overpriced chair, allowing you to double your productivity",
            cost: new Decimal(1)
        },
        24: {
            title: "Buy sensory deprivation egg",
            description: "Purchase an isolation tank, allowing you to double your productivity",
            cost: new Decimal(1)
        },
        // 1XX represents revenue upgrades
        // since they appear in a different tab they can have whatever id I want to give them,
        // because I'll be manually including them in a grid. Making them 1XX means they won't show up
        // in the normal grid of upgrades unless it gets 11 rows
        111: {
            title: "Add a banner ad",
            description: "Yum, a delicious $1 cpm, which equates to automatically earning .1% of cash gain per second",
            currencyDisplayName: "updates",
            currencyInternalName: "points",
            currencyLocation() { return player.u },
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("e", 13) }
        },
        112: {
            title: "Add an interactive banner ad",
            description: "By adding interactivity to the banner ad you can earn an additional .2% of cash gain per second",
            currencyDisplayName: "updates",
            currencyInternalName: "points",
            currencyLocation() { return player.u },
            cost: new Decimal(100),
            unlocked() { return hasUpgrade("c", 111) }
        },
        113: {
            title: "Add pre-game ad",
            description: "Making players watch an ad before playing your game puts another .2% of cash gain per second directly in your pocket",
            currencyDisplayName: "updates",
            currencyInternalName: "points",
            currencyLocation() { return player.u },
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("c", 112) }
        },
        114: {
            title: "Add an interstitial ad",
            description: "Placing ads between levels further engages the players and compensates you accordingly, earning an additional .5% of cash gain per second",
            currencyDisplayName: "updates",
            currencyInternalName: "points",
            currencyLocation() { return player.u },
            cost: new Decimal(100),
            unlocked() { return hasUpgrade("c", 113) }
        },
        121: {
            title: "Add cosmetic microtransactions",
            description: "Cosmetic microtransactions allow players to support you ethically, earning an additional 9% of cash gain per second",
            currencyDisplayName: "updates",
            currencyInternalName: "points",
            currencyLocation() { return player.u },
            cost: new Decimal(100),
            unlocked() { return hasUpgrade("g", 11) && !inChallenge("d", 11) }
        },
        122: {
            title: "Add cosmetic loot crates",
            description: "Adding some randomness to the cosmetics can encourage players to spend even more, earning an additional 90% of cash gain per second",
            currencyDisplayName: "updates",
            currencyInternalName: "points",
            currencyLocation() { return player.u },
            cost: new Decimal(100),
            unlocked() { return hasUpgrade("g", 11) && !inChallenge("d", 11) }
        },
        123: {
            title: "Add loot crate weapons",
            description: "Adding just a little bit of gameplay advantages to paying customers makes sense, and earns an additional 900% of cash gain per second",
            currencyDisplayName: "updates",
            currencyInternalName: "points",
            currencyLocation() { return player.u },
            cost: new Decimal(100),
            unlocked() { return hasUpgrade("g", 11) && !inChallenge("d", 11) }
        },
        124: {
            title: "Add gacha mechanics",
            description: "Completely disregarding the consumer's wellbeing allows you to earn an additional 9000% of cash gain per second",
            currencyDisplayName: "updates",
            currencyInternalName: "points",
            currencyLocation() { return player.u },
            cost: new Decimal(100),
            unlocked() { return hasUpgrade("g", 11) && !inChallenge("d", 11) }
        }
    },
    buyables: {
        rows: 1,
        cols: 1,
        11: {
            title: "Upgrade hardware",
            cost() { return new Decimal(2).mul(new Decimal(2).pow(getBuyableAmount("c", 11))).round() },
            display() { return `Each upgrade additively raises your base productivity to the +.25 power.<br/><br/>Currently: ^${format(this.effect())}<br/><br/>Next upgrade cost: ${format(this.cost())} cash` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect() { return new Decimal(0.25).add(buyableEffect("s", 22)).mul(getBuyableAmount("c", 11)).add(1) },
            buy() {
                if (!hasUpgrade("l", 11) || inChallenge("d", 21))
                    player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount("c", 11, getBuyableAmount("c", 11).add(1))
            }
        }
    },
    revenue(diff) {
        let cpm = 0
        if (hasUpgrade("c",111)) cpm += 1
        if (hasUpgrade("c",112)) cpm += 2
        if (hasUpgrade("c",113)) cpm += 2
        if (hasUpgrade("c",114)) cpm += 5
        if (hasUpgrade("c",121) && hasUpgrade("g", 11) && !inChallenge("d", 11)) cpm += 90
        if (hasUpgrade("c",122) && hasUpgrade("g", 11) && !inChallenge("d", 11)) cpm += 900
        if (hasUpgrade("c",123) && hasUpgrade("g", 11) && !inChallenge("d", 11)) cpm += 9000
        if (hasUpgrade("c",124) && hasUpgrade("g", 11) && !inChallenge("d", 11)) cpm += 90000
        return diff * cpm / 1000
    }
})
