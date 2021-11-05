addLayer("f", {
    name: "fame",
    symbol: "F",
    color: fameColor,
    branches: [ 'c' ],
    row: 2,
    position: 3,
    resource: "fame",
    baseResource: "cash",
    infoboxes: {
        lore: {
            title: "fame",
            body: `You've started accumulating a name for yourself. Some people even recognize your name, and check out your new releases. The more <span style="color: ${fameColor}">fans</span> you have, the more quickly you attract more. Time to take advantage of that!<br/><br/>` +
                  `By creating social media accounts you can harness your <span style="color: ${fameColor}">fan base</span> for all sorts of benefits! In fact, you may as well create some alt accounts while you're at it: the more the merrier, when <span style="color: ${fameColor}">fame</span> is involved!`
        }
    },
    resetDescription: "Elevate your social status by ",
    startData() { return {
        unlocked: false,
        best: new Decimal(0),
        points: new Decimal(0),
        fans: new Decimal(1)
    }},
    layerShown() { return player[this.layer].unlocked || player.u.best.gte(30) },
    type: "static",
    requires: new Decimal(2500),
    base: new Decimal(4),
    baseAmount() { return player.c.points },
    exponent: 1.25,
    gainMult() {
        mult = new Decimal(1)
        if (hasUpgrade("g", 23) && !inChallenge("d", 11)) mult = mult.div(upgradeEffect("g", 23))
        if (hasUpgrade("l", 12)) mult = mult.div(upgradeEffect("l", 12))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    roundUpCost: true,
    canBuyMax() { return true },
    effect() {
        return {
            doubleFrequency: player[this.layer].points.gte(1) ? new Decimal(60).div(player[this.layer].points.mul(layers.g.effect())).div(buyableEffect("f", 11).add(1)) : new Decimal("infinity"),
            productivityMult: player[this.layer].fans.mul(layers.g.effect()).clampMin(10).log10(),
            fanMult: buyableEffect("f", 11),
            cashMult: buyableEffect("f", 12),
            expMult: buyableEffect("f", 13),
            upgMult: buyableEffect("f", 14)
        }
    },
    effectDescription() {
        return player[this.layer].points.lessThan(1) ? "" : `which double your amount of fans every ${format(this.effect().doubleFrequency)} seconds.`
    },
    doReset(resettingLayer) {
        if (['d', 'l', 'g'].includes(resettingLayer)) {
            layerDataReset(this.layer, hasMilestone("g", 2) && !inChallenge("d", 11) ? [ 'milestones', 'upgrades' ] : [])
            if (hasMilestone("g", 0) && !inChallenge("d", 11)) player[this.layer].fans = new Decimal(1000)
            if (hasMilestone("g", 1) && !inChallenge("d", 11)) {
                setBuyableAmount("f", 11, new Decimal(1))
                setBuyableAmount("f", 12, new Decimal(1))
                setBuyableAmount("f", 13, new Decimal(1))
                setBuyableAmount("f", 14, new Decimal(1))
            }
        }
    },
    resetsNothing() { return challengeCompletions("d", 22) > 0 },
    hotkeys: [
        {
            key: "f",
            description: "Press F to elevate your social status",
            onPress() { if (canReset(this.layer)) doReset(this.layer) }
        }
    ],
    tabFormat: [
        ["infobox", "lore"],
        "main-display",
        ["display-text", function() {
            const { productivityMult, fanMult, cashMult, expMult, upgMult } = layers.f.effect()
            let text = `<br/>You currently have ${format(player.f.fans.floor(), 4)} fans, which currently:`
            text += `<br/>Multiplies productivity by ${format(productivityMult)}x`
            if (getBuyableAmount("f", 11).gte(1)) text += `<br/>Multiplies fan gain by ${format(fanMult)}x due to discord`
            if (getBuyableAmount("f", 12).gte(1)) text += `<br/>Multiplies cash gain by ${format(cashMult)}x due to patreon`
            if (getBuyableAmount("f", 13).gte(1)) text += `<br/>Multiplies experience gain by ${format(expMult)}x due to twitch`
            if (getBuyableAmount("f", 14).gte(1)) text += `<br/>Multiplies update gain by ${format(upgMult)}x due to github`
            return text
        }],
        "blank",
        "prestige-button",
        "blank",
        "buyables",
        "blank",
        "upgrades",
        "blank",
        ["display-text", () => `Your best fame is ${player.f.best}`],
        "milestones"
    ],
    update(diff) {
        if (player[this.layer].points.gte(1)) {
            const freq = this.effect().doubleFrequency
            if (freq.gt(0))
                player[this.layer].fans = player[this.layer].fans.mul(new Decimal(2).pow(new Decimal(diff).div(freq)))
        }
        if (hasUpgrade("l", 12) && !inChallenge("d", 21))
            [11, 12, 13, 14].forEach(id => {
                if (layers.f.buyables[id].canAfford()) layers.f.buyables[id].buy()
            })
    },
    buyables: {
        rows: 1,
        cols: 4,
        11: {
            title: "Discord",
            cost() { return getBuyableAmount("f", 11).add(0) },
            display() { return getBuyableAmount("f", 11).gte(1) ? `Each alt account raises your discord effect on fan gain to the ^1.1 power.<br/><br/>Next upgrade cost: ${this.cost()} fame` : `Create a discord, boosting your fan gain the more fans you have<br/><br/>Unlock cost: ${this.cost()} fame` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect() {
                if (getBuyableAmount("f", 11).lte(0)) return new Decimal(1)
                let effect = new Decimal(1.1).pow(getBuyableAmount("f", 11).sub(1)).mul(player[this.layer].fans.clampMin(10).log10().pow(0.3)).mul(layers.g.effect()).add(1)
                if (hasUpgrade("f", 14) && hasUpgrade("g", 12) && !inChallenge("d", 11)) effect = effect.mul(upgradeEffect("f", 14))
                return effect
            },
            buy() {
                if (!hasUpgrade("l", 12) || inChallenge("d", 21)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount("f", 11, getBuyableAmount("f", 11).add(1))
            }
        },
        12: {
            title: "Patreon",
            cost() { return getBuyableAmount("f", 12).add(0).mul(1) },
            display() { return getBuyableAmount("f", 12).gte(1) ? `Each alt account raises your patreon effect on cash gain to the ^1.1 power.<br/><br/>Next upgrade cost: ${this.cost()} fame` : `Create a patreon, boosting your cash gain the more fans you have<br/><br/>Unlock cost: ${this.cost()} fame` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect() {
                if (getBuyableAmount("f", 12).lte(0)) return new Decimal(1)
                return new Decimal(1.1).pow(getBuyableAmount("f", 12).sub(1)).mul(player[this.layer].fans.clampMin(10).log2().sqrt()).mul(layers.g.effect()).add(1)
            },
            buy() {
                if (!hasUpgrade("l", 12) || inChallenge("d", 21)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount("f", 12, getBuyableAmount("f", 12).add(1))
            }
        },
        13: {
            title: "Twitch",
            cost() { return getBuyableAmount("f", 13).add(0).mul(1) },
            display() { return getBuyableAmount("f", 13).gte(1) ? `Each alt account raises your twitch effect on experience gain to the ^1.1 power.<br/><br/>Next upgrade cost: ${this.cost()} fame` : `Create a twitch where you stream development and get instant feedback, boosting your experience gain the more fans you have<br/><br/>Unlock cost: ${this.cost()} fame` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect() {
                if (getBuyableAmount("f", 11).lte(0)) return new Decimal(1)
                return new Decimal(1.1).pow(getBuyableAmount("f", 13).sub(1)).mul(player[this.layer].fans.clampMin(10).log2().pow(0.25)).mul(layers.g.effect()).add(1)
            },
            buy() {
                if (!hasUpgrade("l", 12) || inChallenge("d", 21)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount("f", 13, getBuyableAmount("f", 13).add(1))
            }
        },
        14: {
            title: "Github",
            cost() { return getBuyableAmount("f", 14).add(0).mul(1) },
            display() { return getBuyableAmount("f", 14).gte(1) ? `Each alt account raises your github effect on update gain to the ^1.1 power.<br/><br/>Next upgrade cost: ${this.cost()} fame` : `Add a link in the game to the github repo, boosting your update gain the more fans you have<br/><br/>Unlock cost: ${this.cost()} fame` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect() {
                if (getBuyableAmount("f", 11).lte(0)) return new Decimal(1)
                return new Decimal(1.1).pow(getBuyableAmount("f", 14).sub(1)).mul(player[this.layer].fans.clampMin(10).log10().pow(0.25)).mul(layers.g.effect()).add(1)
            },
            buy() {
                if (!hasUpgrade("l", 12) || inChallenge("d", 21)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount("f", 14, getBuyableAmount("f", 14).add(1))
            }
        }
    },
    upgrades: {
        rows: 1,
        cols: 4,
        11: {
            title: "Create p2p botnet",
            description() { return `Include malware in a game to use your players to pirate textbooks, increasing experience gain based on number of fans.` },
            currencyDisplayName: "updates",
            currencyInternalName: "points",
            currencyLocation() { return player.u },
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("g", 12) && !inChallenge("d", 11) },
            effect() { return player.f.fans.clampMin(10).log10().log(1.5).mul(layers.g.effect()).add(1) }
        },
        12: {
            title: "Use botnet for scalping",
            description() { return `Use your botnet to buy limited supply items before legitimate buyers, increasing cash gain based on number of fans.` },
            currencyDisplayName: "updates",
            currencyInternalName: "points",
            currencyLocation() { return player.u },
            cost: new Decimal(2),
            unlocked() { return hasUpgrade("g", 12) && !inChallenge("d", 11) },
            effect() { return player.f.fans.clampMin(10).log10().log2().mul(layers.g.effect()).add(1) }
        },
        13: {
            title: "Use botnet for distributed processing",
            description() { return `Use your botnet to automatically analyze your games with deep learning, increasing refactoring gain based on number of fans.` },
            currencyDisplayName: "updates",
            currencyInternalName: "points",
            currencyLocation() { return player.u },
            cost: new Decimal(3),
            unlocked() { return hasUpgrade("g", 12) && !inChallenge("d", 11) },
            effect() { return player.f.fans.clampMin(10).log10().log2().sqrt().mul(layers.g.effect()).add(1) }
        },
        14: {
            title: "Use botnet for social media manipulation",
            description() { return `Use your botnet to automatically like posts on social media, increasing fan gain based on number of fans.` },
            currencyDisplayName: "updates",
            currencyInternalName: "points",
            currencyLocation() { return player.u },
            cost: new Decimal(5),
            unlocked() { return hasUpgrade("g", 12) && !inChallenge("d", 11) },
            effect() { return player.f.fans.clampMin(10).log10().log10().mul(layers.g.effect()).add(1) }
        }
    },
    milestones: {
        0: {
            requirementDescription: "1 best fame",
            effectDescription: "Retain the first equipment upgrade",
            done() { return player[this.layer].best.gte(1) }
        },
        1: {
            requirementDescription: "1 best fame",
            effectDescription: "Retain the second equipment upgrade",
            done() { return player[this.layer].best.gte(1) }
        },
        2: {
            requirementDescription: "1 best fame",
            effectDescription: "Retain the third equipment upgrade",
            done() { return player[this.layer].best.gte(1) },
            unlocked() { return hasMilestone("f", 0) }
        },
        3: {
            requirementDescription: "1 best fame",
            effectDescription: "Retain the fourth equipment upgrade",
            done() { return player[this.layer].best.gte(1) },
            unlocked() { return hasMilestone("f", 1) }
        },
        4: {
            requirementDescription: "1 best fame",
            effectDescription: "Retain the fifth equipment upgrade",
            done() { return player[this.layer].best.gte(1) },
            unlocked() { return hasMilestone("f", 2) }
        },
        5: {
            requirementDescription: "1 best fame",
            effectDescription: "Retain the sixth equipment upgrade",
            done() { return player[this.layer].best.gte(1) },
            unlocked() { return hasMilestone("f", 3) }
        },
        6: {
            requirementDescription: "1 best fame",
            effectDescription: "Retain the seventh equipment upgrade",
            done() { return player[this.layer].best.gte(1) },
            unlocked() { return hasMilestone("f", 4) }
        },
        7: {
            requirementDescription: "1 best fame",
            effectDescription: "Retain the eighth equipment upgrade",
            done() { return player[this.layer].best.gte(1) },
            unlocked() { return hasMilestone("f", 5) }
        }
    }
})
