addLayer("l", {
    name: "lectures",
    symbol: "L",
    color: lecturesColor,
    branches: [ 's', 'f' ],
    row: 3,
    position: 4,
    resource: "lectures",
    baseResource: "fame",
    infoboxes: {
        lore: {
            title: "lectures",
            body: `Realizing you are both <span style="color: ${fameColor}">famous</span> and an extensive <span style="color: ${schoolColor}">multi-college education</span>, you have the bright idea of becoming an <span style="color: ${lecturesColor}">adjunt professor</span>. It won't benefit you directly, but with enough <span style="color: ${lecturesColor}">lectures</span> under your belt you should be able to start hiring <span style="color: ${lecturesColor}">Teacher Assistants</span> to <del>take advantage of</del> help you out.<br/><br/>` +
                  `Each <span style="color: ${lecturesColor}">TA</span> you unlock will gain experience over time - the more <span style="color: ${lecturesColor}">lectures</span> you teach, the more experience they can earn! As they level up they'll be able to boost different layers, in addition to their regular duty.`
        }
    },
    resetDescription: "Teach ",
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        gabenExp: new Decimal(0),
        gabenLevel: new Decimal(0),
        lExp: new Decimal(0),
        lLevel: new Decimal(0),
        carmackExp: new Decimal(0),
        carmackLevel: new Decimal(0),
        thompsonExp: new Decimal(0),
        thompsonLevel: new Decimal(0),
        meierExp: new Decimal(0),
        meierLevel: new Decimal(0)
    }},
    layerShown() { return player[this.layer].unlocked || challengeCompletions("d", 12) > 0 },
    type: "normal",
    requires: new Decimal(13),
    baseAmount() { return player.f.points },
    exponent: 10,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    effect() {
        return player[this.layer].points.sqrt()
    },
    effectDescription() {
        return `which generate ${format(this.effect())} experience for your TAs every second`
    },
    update(diff) {
        const effect = this.effect().mul(diff)
        if (hasUpgrade(this.layer, 11)) player[this.layer].gabenExp = player[this.layer].gabenExp.add(effect)
        if (player[this.layer].gabenExp.gte(this.bars.gaben.cost())) {
            player[this.layer].gabenLevel = player[this.layer].gabenLevel.add(1)
            player[this.layer].gabenExp = new Decimal(0)
        }
        if (hasUpgrade(this.layer, 12)) player[this.layer].lExp = player[this.layer].lExp.add(effect)
        if (player[this.layer].lExp.gte(this.bars.l.cost())) {
            player[this.layer].lLevel = player[this.layer].lLevel.add(1)
            player[this.layer].lExp = new Decimal(0)
        }
        if (hasUpgrade(this.layer, 13)) player[this.layer].carmackExp = player[this.layer].carmackExp.add(effect)
        if (player[this.layer].carmackExp.gte(this.bars.carmack.cost())) {
            player[this.layer].carmackLevel = player[this.layer].carmackLevel.add(1)
            player[this.layer].carmackExp = new Decimal(0)
        }
        if (hasUpgrade(this.layer, 14)) player[this.layer].thompsonExp = player[this.layer].thompsonExp.add(effect)
        if (player[this.layer].thompsonExp.gte(this.bars.thompson.cost())) {
            player[this.layer].thompsonLevel = player[this.layer].thompsonLevel.add(1)
            player[this.layer].thompsonExp = new Decimal(0)
        }
        if (hasUpgrade(this.layer, 15)) player[this.layer].meierExp = player[this.layer].meierExp.add(effect)
        if (player[this.layer].meierExp.gte(this.bars.meier.cost())) {
            player[this.layer].meierLevel = player[this.layer].meierLevel.add(1)
            player[this.layer].meierExp = new Decimal(0)
        }
    },
    roundUpCost: true,
    hotkeys: [
        {
            key: "l",
            description: "Press L to teach lectures",
            onPress() { if (canReset(this.layer)) doReset(this.layer) }
        }
    ],
    tabFormat: [
        ["infobox", "lore"],
        ["display-text", () => inChallenge("d", 21) ? `<h2 style="color: red;">Disabled during ${layers.d.challenges[player.d.activeChallenge].name} degree plan</h2>` : ""],
        "main-display",
        "prestige-button",
        "blank",
        ["display-text", "<h2>Gabriel Newell</h2>"],
        ["row", [["upgrade", 11], "blank", ["bar", "gaben"]]],
        "blank",
        ["display-text", () => hasUpgrade("l", 11) ? "<h2>L</h2>" : ""],
        ["row", [["upgrade", 12], "blank", ["bar", "l"]]],
        "blank",
        ["display-text", () => hasUpgrade("l", 12) ? "<h2>Jean Carmack</h2>" : ""],
        ["row", [["upgrade", 13], "blank", ["bar", "carmack"]]],
        "blank",
        ["display-text", () => hasUpgrade("l", 13) ? "<h2>Jen Thompson</h2>" : ""],
        ["row", [["upgrade", 14], "blank", ["bar", "thompson"]]],
        "blank",
        ["display-text", () => challengeCompletions("d", 22) > 0 ? "<h2>Sidney Meier</h2>" : ""],
        ["row", [["upgrade", 15], "blank", ["bar", "meier"]]]
    ],
    bars: {
        gaben: {
            fillStyle: {'background-color' : "#1b2838"},
            baseStyle: {'background-color' : "#171a21"},
            textStyle: {'color': '#04e050'},
            borderStyle() {return {}},
            direction: RIGHT,
            width: 400,
            height: 140,
            progress() {
                return (player[this.layer].gabenExp.div(this.cost())).toNumber()
            },
            display() {
                return `Current TA Level: ${formatWhole(player[this.layer].gabenLevel)}<br/><br/>${format(player[this.layer].gabenExp)} / ${formatWhole(this.cost())} to next level`
            },
            cost() { return new Decimal(4).pow(player[this.layer].gabenLevel).mul(2000) },
            unlocked: true
        },
        l: {
            fillStyle: {'background-color' : "#2B5293"},
            baseStyle: {'background-color' : "#2b772b"},
            textStyle: {'color': '#04e050'},
            borderStyle() {return {}},
            direction: RIGHT,
            width: 400,
            height: 140,
            progress() {
                return (player[this.layer].lExp.div(this.cost())).toNumber()
            },
            display() {
                return `Current TA Level: ${formatWhole(player[this.layer].lLevel)}<br/><br/>${format(player[this.layer].lExp)} / ${formatWhole(this.cost())} to next level`
            },
            cost() { return new Decimal(100).pow(player[this.layer].lLevel).mul(2401) },
            unlocked() { return hasUpgrade("l", 11) }
        },
        carmack: {
            fillStyle: {'background-color' : "#cb5e29"},
            baseStyle: {'background-color' : "#692f17"},
            textStyle: {'color': '#04e050'},
            borderStyle() {return {}},
            direction: RIGHT,
            width: 400,
            height: 140,
            progress() {
                return (player[this.layer].carmackExp.div(this.cost())).toNumber()
            },
            display() {
                return `Current TA Level: ${formatWhole(player[this.layer].carmackLevel)}<br/><br/>${format(player[this.layer].carmackExp)} / ${formatWhole(this.cost())} to next level`
            },
            cost() { return new Decimal(6).pow(player[this.layer].carmackLevel).mul(10000) },
            unlocked() { return hasUpgrade("l", 12) }
        },
        thompson: {
            fillStyle: {'background-color' : "#ffffff"},
            baseStyle: {'background-color' : "#000000"},
            textStyle: {'color': '#04e050'},
            borderStyle() {return {}},
            direction: RIGHT,
            width: 400,
            height: 140,
            progress() {
                return (player[this.layer].thompsonExp.div(this.cost())).toNumber()
            },
            display() {
                return `Current TA Level: ${formatWhole(player[this.layer].thompsonLevel)}<br/><br/>${format(player[this.layer].thompsonExp)} / ${formatWhole(this.cost())} to next level`
            },
            cost() { return new Decimal(12).pow(player[this.layer].thompsonLevel).mul(50000) },
            unlocked() { return hasUpgrade("l", 13) }
        },
        meier: {
            fillStyle: {'background-color' : "#947728"},
            baseStyle: {'background-color' : "#04467a"},
            textStyle: {'color': '#04e050'},
            borderStyle() {return {}},
            direction: RIGHT,
            width: 400,
            height: 140,
            progress() {
                return (player[this.layer].meierExp.div(this.cost())).toNumber()
            },
            display() {
                return `Current TA Level: ${formatWhole(player[this.layer].meierLevel)}<br/><br/>${format(player[this.layer].meierExp)} / ${formatWhole(this.cost())} to next level`
            },
            cost() { return new Decimal(12).pow(player[this.layer].meierLevel).mul(50000) },
            unlocked() { return challengeCompletions("d", 22) > 0 }
        }
    },
    upgrades: {
        rows: 1,
        cols: 5,
        11: {
            title: "Hire Gabriel",
            cost: new Decimal(1),
            description() { return "<br/>Gabriel will make upgrading hardware not spend any cash, and increase cash gain based on level<br/>" },
            effect() { return inChallenge("d", 21) ? new Decimal(1) : new Decimal(2).pow(player[this.layer].gabenLevel) },
            effectDisplay() { return `${format(this.effect())}x cash gain` }
        },
        12: {
            title: "Hire L",
            cost: new Decimal(50),
            description() { return "<br/>L will autopurchase alt accounts and not spend any fame, and increase fame gain based on level<br/>" },
            effect() { return inChallenge("d", 21) ? new Decimal(1) : player[this.layer].lLevel.add(1).pow(.9) },
            effectDisplay() { return `${format(this.effect())}x fame gain` },
            unlocked() { return hasUpgrade("l", 11) }
        },
        13: {
            title: "Hire Jean",
            cost: new Decimal(2000),
            description() { return "<br/>Jean will square updates gain, and increase updates gain based on level<br/>" },
            effect() { return inChallenge("d", 21) ? new Decimal(1) : new Decimal(1.75).pow(player[this.layer].carmackLevel) },
            effectDisplay() { return `${format(this.effect())}x update gain` },
            unlocked() { return hasUpgrade("l", 12) }
        },
        14: {
            title: "Hire Jen",
            cost: new Decimal(60000),
            description() { return "<br/>Jen will make taking classes not spend any cash, and increase enrollments gain based on level<br/>" },
            effect() { return inChallenge("d", 21) ? new Decimal(1) : new Decimal(1.5).pow(player[this.layer].thompsonLevel) },
            effectDisplay() { return `${format(this.effect())}x enrollments gain` },
            unlocked() { return hasUpgrade("l", 13) }
        },
        15: {
            title: "Hire Sidney",
            cost: new Decimal(1200000),
            description() { return "<br/>Sidney will square good will affect, and increase good will gain based on level<br/>" },
            effect() { return inChallenge("d", 21) ? new Decimal(1) : new Decimal(1.05).pow(player[this.layer].meierLevel) },
            effectDisplay() { return `${format(this.effect())}x good will gain` },
            unlocked() { return challengeCompletions("d", 22) > 0 }
        }
    }
})
