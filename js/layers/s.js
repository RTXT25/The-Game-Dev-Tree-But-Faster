addLayer("s", {
    name: "school",
    symbol: "S",
    color: schoolColor,
    branches: [ 'e', 'c' ],
    row: 2,
    position: 2,
    resource: "enrollments",
    baseResource: "experience",
    infoboxes: {
        lore: {
            title: "school",
            body: `With all this <span style="color: ${experienceColor}">programming experience</span>, you think you finally have what it takes to go to college. It'll take a lot of <span style="color: ${cashColor}">cash</span>, and require a lot of <span style="color: ${experienceColor}">experience</span> to get accepted, but the payoff for a formal education should maybe probably help you make games faster.<br/><br/>` +
                  `Each class has very powerful effects, but costs an exorbitant amount of <span style="color: ${cashColor}">cash</span>. Enrolling in multiple colleges helps you take further advantage of this knowledge.<br/><br/>` +
                  `Additionally, the more classes you take the more you should be able to write quick automation scripts to push out <span style="color: ${updatesColor}">builds</span> and such automatically!`
        }
    },
    resetDescription: "Apply to another college for ",
    startData() { return {
        unlocked: false,
        best: new Decimal(0),
        points: new Decimal(0),
        classes: new Decimal(0),
        time: new Decimal(0),
        "auto-update": false,
        "auto-upgradehardware": false,
        "auto-experience": false,
        "auto-cash": false
    }},
    layerShown() { return player[this.layer].unlocked || (player.r.total.gte(1) && player.f.best.gte(1)) },
    type: "static",
    requires: new Decimal(1e6),
    base: new Decimal(8),
    baseAmount() { return player.e.points },
    exponent: 1.2,
    gainMult() {
        mult = new Decimal(1)
        if (hasUpgrade("g", 22) && !inChallenge("d", 11)) mult = mult.div(upgradeEffect("g", 22))
        if (hasUpgrade("l", 14)) mult = mult.div(upgradeEffect("l", 14))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    roundUpCost: true,
    effect() {
        return new Decimal(1).add(new Decimal(0.05).mul(player.s.points))
    },
    effectDescription() {
        return `which raise your class effects to the ^${format(this.effect())} power.`
    },
    doReset(resettingLayer) {
        if (['t', 'd', 'l'].includes(resettingLayer)) {
            layerDataReset(this.layer, ["auto-both", "auto-cash", "auto-experience", "auto-update", "auto-upgradehardware"])
            const buyablesAmount = layers.d.effect()
            setBuyableAmount("s", 11, buyablesAmount)
            setBuyableAmount("s", 12, buyablesAmount)
            setBuyableAmount("s", 21, buyablesAmount)
            setBuyableAmount("s", 22, buyablesAmount)
            updateMilestones(this.layer)
        }
    },
    resetsNothing() { return hasMilestone("d", 2) },
    hotkeys: [
        {
            key: "s",
            description: "Press S to apply for college",
            onPress() { if (canReset(this.layer)) doReset(this.layer) }
        }
    ],
    tabFormat: [
        ["infobox", "lore"],
        "main-display",
        "prestige-button",
        "blank",
        "buyables",
        "blank",
        ["display-text", () => `You've taken a total of ${player.s.classes.add(layers.d.effect().times(4))} classes`],
        "milestones"
    ],
    update(diff) {
        if (hasMilestone("s", 1) && player.s["auto-update"] && canReset("u")) {
            doReset("u")
        }
        player.s.time = player.s.time.add(diff)
        if (player.s.time.gte(new Decimal(1).div(buyableEffect("s", 21)))) {
            if (hasMilestone("s", 2) && player.s["auto-upgradehardware"]) {
                while (buyBuyable("c", 11)) { }
            }
            if (hasMilestone("s", 4)) {
                if (hasMilestone("d", 1)) {
                    if (player.s["auto-both"] && (canReset("e") || canReset("c"))) {
                        if (hasMilestone("s", 5)) {
                            const mul = player.s.time.div(new Decimal(1).div(buyableEffect("s", 21))).sqrt()
                            addPoints("e", getResetGain("e").mul(mul))
                            addPoints("c", getResetGain("c").mul(mul))
                        } else doReset("e")
                    }
                } else {
                    if (player.s["auto-experience"] && canReset("e")) {
                        doReset("e")
                    }
                    if (player.s["auto-cash"] && canReset("c")) {
                        doReset("c")
                    }
                }
            }
            player.s.time = new Decimal(0)
        }
    },
    shouldNotify() {
        if (!player.s.best.gt(0)) return false
        return canAffordPurchase("c", layers[this.layer].buyables[11], layers[this.layer].buyables[11].cost()) ||
               canAffordPurchase("c", layers[this.layer].buyables[12], layers[this.layer].buyables[12].cost()) ||
               canAffordPurchase("c", layers[this.layer].buyables[21], layers[this.layer].buyables[21].cost()) ||
               canAffordPurchase("c", layers[this.layer].buyables[22], layers[this.layer].buyables[22].cost())
    },
    buyables: {
        rows: 2,
        cols: 2,
        11: {
            title: "CS 1337 Computer Science",
            cost() { return getBuyableAmount("s", 11).sub(layers.d.effect()).add(6).pow10() },
            display() { return `Each class additively raises the effectiveness of experience on productivity to the power of +.025<br/><br/>Currently: ^${format(this.effect())}<br/><br/>Next upgrade cost: ${format(this.cost())} cash` },
            canAfford() { return player.c.points.gte(this.cost()) && player.s.best.gte(1) },
            effect() { return getBuyableAmount("s", 11).pow(layers.s.effect()).mul(0.025).add(1) },
            buy() {
                if (!hasUpgrade("l", 14) || inChallenge("d", 21)) player.c.points = player.c.points.sub(this.cost())
                setBuyableAmount("s", 11, getBuyableAmount("s", 11).add(1))
                player[this.layer].classes = player[this.layer].classes.add(1)
            }
        },
        12: {
            title: "CS 2305 Discrete Math",
            cost() { return getBuyableAmount("s", 12).sub(layers.d.effect()).mul(2).add(8).pow10() },
            display() { return `Each class divides the productivity slowdown modifier exponent by 1.05<br/><br/>Currently: ^${format(this.effect())}<br/><br/>Next upgrade cost: ${format(this.cost())} cash` },
            canAfford() { return player.c.points.gte(this.cost()) && player.s.best.gte(1) },
            effect() { return new Decimal(1).div(new Decimal(1.05).pow(getBuyableAmount("s", 12))) },
            buy() {
                if (!hasUpgrade("l", 14) || inChallenge("d", 21)) player.c.points = player.c.points.sub(this.cost())
                setBuyableAmount("s", 12, getBuyableAmount("s", 12).add(1))
                player[this.layer].classes = player[this.layer].classes.add(1)
            }
        },
        21: {
            title: "CS 3354 Software Engineering",
            cost() { return getBuyableAmount("s", 21).sub(layers.d.effect()).mul(3).add(9).pow10() },
            display() { return `Each class additively speeds this layer's automation milestones by 50%<br/><br/>Currently: x${format(this.effect())}<br/><br/>Next upgrade cost: ${format(this.cost())} cash` },
            canAfford() { return player.c.points.gte(this.cost()) && player.s.best.gte(1) },
            effect() { return new Decimal(.5).mul(getBuyableAmount("s", 21).pow(layers.s.effect())).add(1) },
            buy() {
                if (!hasUpgrade("l", 14) || inChallenge("d", 21)) player.c.points = player.c.points.sub(this.cost())
                setBuyableAmount("s", 21, getBuyableAmount("s", 21).add(1))
                player[this.layer].classes = player[this.layer].classes.add(1)
            }
        },
        22: {
            title: "CS 4352 Human Computer Interactions",
            cost() { return getBuyableAmount("s", 22).sub(layers.d.effect()).mul(4).add(10).pow10() },
            display() { return `Each class increases the effect of upgrading hardware by +.05<br/><br/>Currently: +${format(this.effect())}<br/><br/>Next upgrade cost: ${format(this.cost())} cash` },
            canAfford() { return player.c.points.gte(this.cost()) && player.s.best.gte(1) },
            effect() { return getBuyableAmount("s", 22).pow(layers.s.effect()).mul(0.05) },
            buy() {
                if (!hasUpgrade("l", 14) || inChallenge("d", 21)) player.c.points = player.c.points.sub(this.cost())
                setBuyableAmount("s", 22, getBuyableAmount("s", 22).add(1))
                player[this.layer].classes = player[this.layer].classes.add(1)
            }
        }
    },
    milestones: {
        0: {
            requirementDescription: "1 class taken",
            effectDescription: "Retain all Update upgrades",
            done() { return player[this.layer].classes.add(layers.d.effect().times(4)).gte(1) }
        },
        1: {
            requirementDescription: "1 classes taken",
            effectDescription: "Automatically reset Update layer",
            done() { return player[this.layer].classes.add(layers.d.effect().times(4)).gte(1) },
            toggles: [["s", "auto-update"]],
            unlocked() { return player[this.layer].classes.add(layers.d.effect().times(4)).gte(1) }
        },
        2: {
            requirementDescription: "1 classes taken",
            effectDescription: "Automatically buy Upgrade Hardware every second",
            done() { return player[this.layer].classes.add(layers.d.effect().times(4)).gte(1) },
            toggles: [["s", "auto-upgradehardware"]],
            unlocked() { return player[this.layer].classes.add(layers.d.effect().times(4)).gte(1) }
        },
        3: {
            requirementDescription: "1 classes taken",
            effectDescription: "Retain Cash Revenue upgrades",
            done() { return player[this.layer].classes.add(layers.d.effect().times(4)).gte(1) },
            unlocked() { return player[this.layer].classes.add(layers.d.effect().times(4)).gte(1) }
        },
        4: {
            requirementDescription: "1 classes taken",
            effectDescription: "Automatically reset Experience and Cash layers every second<br/>(Recommended to only do 1 at a time)",
            done() { return player[this.layer].classes.add(layers.d.effect().times(4)).gte(1) },
            toggles() { return hasMilestone("d", 1) ? [["s", "auto-both"]] : [["s", "auto-experience"], ["s", "auto-cash"]] },
            unlocked() { return player[this.layer].classes.add(layers.d.effect().times(4)).gte(1) }
        },
        5: {
            requirementDescription: "1 classes taken",
            effectDescription: "Experience and Cash layers reset nothing, and the previous milestone can reset multiple times per tick, with diminishing returns",
            done() { return player[this.layer].classes.add(layers.d.effect().times(4)).gte(1) },
            unlocked() { return player[this.layer].classes.add(layers.d.effect().times(4)).gte(1) }
        }
    }
})
