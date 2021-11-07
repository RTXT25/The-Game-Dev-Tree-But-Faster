addLayer("t", {
    name: "time flux",
    symbol: "T",
    color: timeFluxColor,
    branches: [ 'r', 's' ],
    row: 3,
    position: 2,
    resource: "time flux",
    baseResource: "refactors",
    infoboxes: {
        lore: {
            title: "time flux",
            body: `In a discussion with an advisor from yet another <span style="color: ${schoolColor}">college</span>, you notice an interesting course in the advanced Computer Science degree: <span style="color: ${timeFluxColor}">Chronomancy</span>. Interest piqued, you enroll and start learning about methods of <span style="color: ${timeFluxColor}">time manipulation</span> (which is remarkably similar to <span style="color: ${refactoringColor}">refactoring</span>. Who knew!). Now that could be useful!<br/><br/>` +
                  `<span style="color: ${timeFluxColor}">Time flux</span> can be used to charge up <span style="color: ${timeFluxColor}">rings</span> that can produce <span style="color: ${timeFluxColor}">time shards</span>, which in turn can speed up <span style="color: ${timeFluxColor}">time</span>. <span style="color: ${timeFluxColor}">Rings</span> can be placed inside each other using more <span style="color: ${timeFluxColor}">time flux</span>, and make the <span style="color: ${timeFluxColor}">inner ring</span> work faster.`
        }
    },
    resetDescription: "Refactor time for ",
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        shards: new Decimal(0),
        rings: new Array(8).fill(new Decimal(0))
    }},
    layerShown() { return player[this.layer].unlocked || challengeCompletions("d", 11) > 0 },
    type: "normal",
    requires: new Decimal(21),
    baseAmount() { return player.r.points },
    exponent: 25,
    gainMult() {
        mult = new Decimal(1)
        mult = mult.mul(player.r.points.sub(21).pow(1.5).add(1))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    roundUpCost: true,
    effect() {
        if (inChallenge("d", 22)) return 1
        let highestRing = player.t.rings.findIndex(r => r.lte(0))
        if (highestRing == -1) highestRing = 8
        highestRing++
        return player[this.layer].shards.clampMin(1).log10().pow(Decimal.div(highestRing, 4)).add(1).toNumber()
    },
    update(diff) {
        player[this.layer].rings[7] = player[this.layer].rings[7].add(buyableEffect(this.layer, 91).rate.mul(diff))
        player[this.layer].rings[6] = player[this.layer].rings[6].add(buyableEffect(this.layer, 81).rate.mul(diff))
        player[this.layer].rings[5] = player[this.layer].rings[5].add(buyableEffect(this.layer, 71).rate.mul(diff))
        player[this.layer].rings[4] = player[this.layer].rings[4].add(buyableEffect(this.layer, 61).rate.mul(diff))
        player[this.layer].rings[3] = player[this.layer].rings[3].add(buyableEffect(this.layer, 51).rate.mul(diff))
        player[this.layer].rings[2] = player[this.layer].rings[2].add(buyableEffect(this.layer, 41).rate.mul(diff))
        player[this.layer].rings[1] = player[this.layer].rings[1].add(buyableEffect(this.layer, 31).rate.mul(diff))
        player[this.layer].rings[0] = player[this.layer].rings[0].add(buyableEffect(this.layer, 21).rate.mul(diff))
        player[this.layer].shards = player[this.layer].shards.add(buyableEffect(this.layer, 11).mul(diff))
    },
    hotkeys: [
        {
            key: "t",
            description: "Press T to refactor time",
            onPress() { if (canReset(this.layer)) doReset(this.layer) }
        }
    ],
    tabFormat: [
        ["infobox", "lore"],
        ["display-text", () => inChallenge("d", 22) ? `<h2 style="color: red;">Disabled during ${layers.d.challenges[player.d.activeChallenge].name} degree plan</h2>` : ""],
        "main-display",
        "prestige-button",
        "blank",
        ["display-text", () => `You have ${format(player.t.shards)} time shards, speeding up time by ${format(layers.t.effect())}x`],
        "blank",
        "buyables"
    ],
    buyables: {
        rows: 9,
        cols: 1,
        11: {
            title: "1st Ring",
            display() {
                if (getBuyableAmount(this.layer, this.id).gt(0))
                    return `Double time shards generation.<br/>Currently: ${format(this.effect())}/sec<br/>Requires ${formatWhole(this.cost())} time flux.`
                return `Generate time shards.<br/>Currently: ${format(this.effect())}/sec<br/>Requires ${formatWhole(this.cost())} time flux.`
            },
            cost(x) { return new Decimal(1).pow(new Decimal(1).pow(1.5)).pow(x || getBuyableAmount(this.layer, this.id)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                if (getBuyableAmount(this.layer, this.id).gt(0))
                    return new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(1)).times(buyableEffect(this.layer, 21).multiplier)
                return new Decimal(0)
            },
            style: { width: "600px", height: "120px" }
        },
        21: {
            title: "2nd Ring",
            display() {
                const effect = this.effect()
                if (getBuyableAmount(this.layer, this.id).gt(0))
                    return `Double how quickly the multiplier to the 1st Ring increases.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
                return `Power up the 1st Ring over time.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
            },
            cost(x) { return new Decimal(1).pow(new Decimal(2).pow(1.5)).pow(Decimal.add(x || getBuyableAmount(this.layer, this.id), 1)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                return {
                    multiplier: player.t.rings[0].add(1),
                    rate: getBuyableAmount(this.layer, this.id).gt(0) ? new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(1)).mul(buyableEffect("t", 31).multiplier) : new Decimal(0)
                }
            },
            style: { width: "600px", height: "120px" }
        },
        31: {
            title: "3rd Ring",
            display() {
                const effect = this.effect()
                if (getBuyableAmount(this.layer, this.id).gt(0))
                    return `Double how quickly the multiplier to the 2nd Ring increases.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
                return `Power up the 2nd Ring over time.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
            },
            cost(x) { return new Decimal(1).pow(new Decimal(3).pow(1.5)).pow(Decimal.add(x || getBuyableAmount(this.layer, this.id), 1)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                return {
                    multiplier: player.t.rings[1].add(1),
                    rate: getBuyableAmount(this.layer, this.id).gt(0) ? new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(1)).mul(buyableEffect("t", 41).multiplier) : new Decimal(0)
                }
            },
            style: { width: "600px", height: "120px" }
        },
        41: {
            title: "4th Ring",
            display() {
                const effect = this.effect()
                if (getBuyableAmount(this.layer, this.id).gt(0))
                    return `Double how quickly the multiplier to the 3rd Ring increases.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
                return `Power up the 3rd Ring over time.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
            },
            cost(x) { return new Decimal(1).pow(new Decimal(4).pow(1.5)).pow(Decimal.add(x || getBuyableAmount(this.layer, this.id), 1)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                return {
                    multiplier: player.t.rings[2].add(1),
                    rate: getBuyableAmount(this.layer, this.id).gt(0) ? new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(1)).mul(buyableEffect("t", 51).multiplier) : new Decimal(0)
                }
            },
            style: { width: "600px", height: "120px" }
        },
        51: {
            title: "5th Ring",
            display() {
                const effect = this.effect()
                if (getBuyableAmount(this.layer, this.id).gt(0))
                    return `Double how quickly the multiplier to the 4th Ring increases.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
                return `Power up the 4th Ring over time.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
            },
            cost(x) { return new Decimal(1).pow(new Decimal(5).pow(1.5)).pow(Decimal.add(x || getBuyableAmount(this.layer, this.id), 1)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                return {
                    multiplier: player.t.rings[3].add(1),
                    rate: getBuyableAmount(this.layer, this.id).gt(0) ? new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(1)).mul(buyableEffect("t", 61).multiplier) : new Decimal(0)
                }
            },
            style: { width: "600px", height: "120px" }
        },
        61: {
            title: "6th Ring",
            display() {
                const effect = this.effect()
                if (getBuyableAmount(this.layer, this.id).gt(0))
                    return `Double how quickly the multiplier to the 5th Ring increases.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
                return `Power up the 5th Ring over time.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
            },
            cost(x) { return new Decimal(1).pow(new Decimal(6).pow(1.5)).pow(Decimal.add(x || getBuyableAmount(this.layer, this.id), 1)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                return {
                    multiplier: player.t.rings[4].add(1),
                    rate: getBuyableAmount(this.layer, this.id).gt(0) ? new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(1)).mul(buyableEffect("t", 71).multiplier) : new Decimal(0)
                }
            },
            style: { width: "600px", height: "120px" }
        },
        71: {
            title: "7th Ring",
            display() {
                const effect = this.effect()
                if (getBuyableAmount(this.layer, this.id).gt(0))
                    return `Double how quickly the multiplier to the 6th Ring increases.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
                return `Power up the 6th Ring over time.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
            },
            cost(x) { return new Decimal(1).pow(new Decimal(7).pow(1.5)).pow(Decimal.add(x || getBuyableAmount(this.layer, this.id), 1)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                return {
                    multiplier: player.t.rings[5].add(1),
                    rate: getBuyableAmount(this.layer, this.id).gt(0) ? new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(1)).mul(buyableEffect("t", 81).multiplier) : new Decimal(0)
                }
            },
            style: { width: "600px", height: "120px" }
        },
        81: {
            title: "8th Ring",
            display() {
                const effect = this.effect()
                if (getBuyableAmount(this.layer, this.id).gt(0))
                    return `Double how quickly the multiplier to the 7th Ring increases.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
                return `Power up the 7th Ring over time.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
            },
            cost(x) { return new Decimal(1).pow(new Decimal(8).pow(1.5)).pow(Decimal.add(x || getBuyableAmount(this.layer, this.id), 1)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                return {
                    multiplier: player.t.rings[6].add(1),
                    rate: getBuyableAmount(this.layer, this.id).gt(0) ? new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(1)).mul(buyableEffect("t", 91).multiplier) : new Decimal(0)
                }
            },
            style: { width: "600px", height: "120px" }
        },
        91: {
            title: "9th Ring",
            display() {
                const effect = this.effect()
                if (getBuyableAmount(this.layer, this.id).gt(0))
                    return `Double how quickly the multiplier to the 8th Ring increases.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
                return `Power up the 8th Ring over time.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
            },
            cost(x) { return new Decimal(1).pow(new Decimal(9).pow(1.5)).pow(Decimal.add(x || getBuyableAmount(this.layer, this.id), 1)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                return {
                    multiplier: player.t.rings[7].add(1),
                    rate: getBuyableAmount(this.layer, this.id).gt(0) ? new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(1)) : new Decimal(0)
                }
            },
            style: { width: "600px", height: "120px" },
            unlocked() { return challengeCompletions("d", 21) > 0 }
        }
    }
})
