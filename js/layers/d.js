addLayer("d", {
    name: "diplomas",
    symbol: "D",
    color: diplomaColor,
    branches: [ 'r', 's', 'f' ],
    row: 3,
    position: 3,
    resource: "diplomas",
    baseResource: "enrollments",
    infoboxes: {
        lore: {
            title: "diplomas",
            body: `Are you ready for all that time and <span style="color: ${cashColor}">money</span> to pay off? Your <span style="color: ${diplomaColor}">university</span> is finally giving you a piece of paper to recognize your achievements! This paper doesn't really do much, but it might be a good stepping stone to other opportunities.<br/><br/>` +
                  "You'll also be able to get specific degrees for certain fields by demonstrating your mastery of the subject."
        }
    },
    resetDescription: "Graduate for ",
    startData() { return {
        unlocked: false,
        points: new Decimal(0)
    }},
    layerShown() { return player[this.layer].unlocked || (player.a.points.gte(2) && player.g.points.gte(2)) },
    type: "static",
    requires: new Decimal(10),
    base: new Decimal(1.2),
    baseAmount() { return player.s.points },
    exponent: 1,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    roundUpCost: true,
    effect() {
        return player.d.points.mul(player.d.points.add(1)).div(8)
    },
    effectDescription() {
        return `which give you ${format(this.effect())} free levels in each class.`
    },
    hotkeys: [
        {
            key: "d",
            description: "Press D to graduate",
            onPress() { if (canReset(this.layer)) doReset(this.layer) }
        }
    ],
    tabFormat: [
        ["infobox", "lore"],
        "main-display",
        "prestige-button",
        "blank",
        "challenges",
        "blank",
        "upgrades",
        "blank",
        "milestones"
    ],
    update(diff) {
        if (challengeCompletions("d", 21) > 0 && canReset("r")) {
            doReset("r")
        }
        if (hasMilestone("d", 2) && canReset("s")) {
            doReset("s")
        }
        if (challengeCompletions("d", 22) > 0 && canReset("f")) {
            doReset("f")
        }
        if (hasMilestone("d", 3) && player.d["auto-school"]) {
            [11, 12, 21, 22].forEach(id => {
                while (buyBuyable("s", id)) { }
            })
        }
    },
    shouldNotify() {
        return (inChallenge("d", 11) && canCompleteChallenge("d", 11)) ||
               (inChallenge("d", 12) && canCompleteChallenge("d", 12)) ||
               (inChallenge("d", 21) && canCompleteChallenge("d", 21)) ||
               (inChallenge("d", 22) && canCompleteChallenge("d", 22))
    },
    upgrades: {
        rows: 1,
        cols: 1,
        11: {
            title: "Write Thesis",
            description: "Finally, the culmination of all your work: Your Magnum Opus, \"The Game Dev Tree\". Completing this work finishes the game.",
            cost: new Decimal("ee12"),
            currencyDisplayName: "hours of work",
            currencyInternalName: "points",
            currencyLocation: () => player,
            unlocked() { return hasMilestone("d", 4) }
        }
    },
    challenges: {
        rows: 2,
        cols: 2,
        11: {
            name: "B.S. in Computer Science",
            challengeDescription: "Demonstrate your subject mastery by causing a Diploma reset, and disabling all benefits from row 4 layers except for Diplomas and API.",
            rewardDescription: "Unlock 2 new purchasable endpoints",
            goal: new Decimal(8),
            currencyDisplayName: "enrollments",
            currencyInternalName: "points",
            currencyLayer: "s",
            unlocked() { return hasMilestone("a", 3) },
            style: { width: "400px", height: "320px" }
        },
        12: {
            name: "B.A. in Marketing",
            challengeDescription: "Demonstrate your subject mastery by causing a Diploma reset, and disabling all benefits from row 4 layers except for Diplomas and Good Will.",
            rewardDescription: "Spent goodwill also counts towards bonuses, at 50% efficiency",
            goal: new Decimal(8),
            currencyDisplayName: "enrollments",
            currencyInternalName: "points",
            currencyLayer: "s",
            unlocked() { return hasMilestone("g", 1) },
            onStart() { player.r.milestones = [] },
            style: { width: "400px", height: "320px" }
        },
        21: {
            name: "M.S. in Computer Science",
            challengeDescription: "Demonstrate your subject mastery by causing a Diploma reset, and disabling all benefits from row 4 layers except for Diplomas and Time Flux.",
            rewardDescription: "Unlock a 9th ring and Refactors reset nothing and are purchased automatically",
            goal: new Decimal(12),
            currencyDisplayName: "enrollments",
            currencyInternalName: "points",
            currencyLayer: "s",
            unlocked() { return hasMilestone("d", 4) },
            countsAs: [ 11, 12 ],
            style: { width: "400px", height: "320px" }
        },
        22: {
            name: "M.A. in Marketing",
            challengeDescription: "Demonstrate your subject mastery by causing a Diploma reset, and disabling all benefits from row 4 layers except for Diplomas and Lectures.",
            rewardDescription: "Unlock another TA and Fame resets nothing and is purchased automatically",
            goal: new Decimal(12),
            currencyDisplayName: "enrollments",
            currencyInternalName: "points",
            currencyLayer: "s",
            unlocked() { return hasMilestone("d", 4) },
            countsAs: [ 11, 12 ],
            style: { width: "400px", height: "320px" }
        }
    },
    milestones: {
        0: {
            requirementDescription: "1 total diplomas",
            effectDescription: "Releasing updates does not reset hours of work",
            done() { return player[this.layer].points.gte(1) }
        },
        1: {
            requirementDescription: "2 total diplomas",
            effectDescription: "Resetting either the experience or cash layer gives what would've been gained from both",
            done() { return player[this.layer].points.gte(2) }
        },
        2: {
            requirementDescription: "3 total diplomas",
            effectDescription: "School resets nothing and is automatically purchased",
            done() { return player[this.layer].points.gte(3) }
        },
        3: {
            requirementDescription: "4 total diplomas",
            effectDescription: "Automatically take classes you can afford",
            toggles: [["d", "auto-school"]],
            done() { return player[this.layer].points.gte(4) }
        },
        4: {
            requirementDescription: "7 total diplomas",
            effectDescription: "Unlock Masters Degrees and Thesis Upgrade",
            done() { return player[this.layer].points.gte(7) },
            unlocked() { return player.t.unlocked && player.l.unlocked }
        }
    }
})
