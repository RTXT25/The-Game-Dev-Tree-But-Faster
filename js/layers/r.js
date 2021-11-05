addLayer("r", {
    name: "refactors",
    symbol: "R",
    color: refactoringColor,
    branches: [ 'e' ],
    row: 2,
    position: 1,
    resource: "refactors",
    baseResource: "experience",
    infoboxes: {
        lore: {
            title: "refactors",
            body: `After working on a game for so long, you start to realize some initial design decisions haven't really scaled well over so many countless <span style="color: ${updatesColor}">updates</span>.<br/><br/>` +
                  "You do, however, have some ideas on how you would've structured it to better support the features you've since added, and will continue to add. All you have to do is rewrite a couple parts of it.<br/><br/>" +
                  `You'll take a minor setback on your <span style="color: ${experienceColor}">experience</span> on a changing codebase, but it'll pay off dividends in the long run!<br/><br/>` +
                  `This layer also unlocks "<span style="color: ${refactoringColor}">Refactorings</span>": Enabling these actively refactors your codebase, increasing your productivity based on the hours worked. However, the productivity slow down will be much quicker due to the grueling work.`
        }
    },
    resetDescription: "Re-design your game framework for ",
    startData() { return {
        unlocked: false,
        total: new Decimal(0),
        points: new Decimal(0),
        renameVariablesHoursWorked: new Decimal(0),
        encapsulateFieldHoursWorked: new Decimal(0),
        optimizeFormulasHoursWorked: new Decimal(0),
        rollLibraryHoursWorked: new Decimal(0)
    }},
    layerShown() { return player[this.layer].unlocked || player.u.best.gte(30) },
    type: "static",
    requires: new Decimal(500),
    base: new Decimal(2.5),
    baseAmount() { return player.e.points },
    exponent: 1.25,
    gainMult() {
        mult = new Decimal(1)
        if (hasUpgrade("f", 13) && hasUpgrade("g", 12) && !inChallenge("d", 11)) mult = mult.div(upgradeEffect("f", 13))
        if (hasUpgrade("g", 21) && !inChallenge("d", 11)) mult = mult.div(upgradeEffect("g", 21))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    roundUpCost: true,
    canBuyMax() { return hasMilestone("a", 1) && !inChallenge("d", 12) },
    effect() { return player[this.layer].points.pow(player[this.layer].points.mul(1.5)).add(1) },
    effectDescription() {
        return `multiplying all bonuses based on total experience by ${format(this.effect())}x.`
    },
    doReset(resettingLayer) {
        if (['a', 't', 'd'].includes(resettingLayer)) {
            const keep = []
            if (hasMilestone("a", 2) && !inChallenge("d", 12)) keep.push('milestones')
            if (hasMilestone("a", 4) && !inChallenge("d", 12)) keep.push('renameVariablesHoursWorked', 'encapsulateFieldHoursWorked', 'optimizeFormulasHoursWorked', 'rollLibraryHoursWorked')
            layerDataReset(this.layer, keep)
            if (hasMilestone("a", 0) && !hasMilestone("a", 2) && !inChallenge("d", 12)) {
                player[this.layer].milestones.push(0)
                player[this.layer].milestones.push(1)
                player[this.layer].milestones.push(3)
                player[this.layer].milestones.push(7)
            }
        }
    },
    resetsNothing() { return challengeCompletions("d", 21) > 0 },
    hotkeys: [
        {
            key: "r",
            description: "Press R to re-design your game framework",
            onPress() { if (canReset(this.layer)) doReset(this.layer) }
        }
    ],
    tabFormat: [
        ["infobox", "lore"],
        "main-display",
        "prestige-button",
        "blank",
        "clickables",
        "blank",
        ["display-text", () => `You've performed a total of ${player.r.total} refactors`],
        "milestones"
    ],
    update(diff) {
        if (getClickableState("r", 11))
            player.r.renameVariablesHoursWorked = player.r.renameVariablesHoursWorked.add(tmp.pointGen.mul(diff))
        else if (getClickableState("r", 12))
            player.r.encapsulateFieldHoursWorked = player.r.encapsulateFieldHoursWorked.add(tmp.pointGen.mul(diff))
        else if (getClickableState("r", 13))
            player.r.optimizeFormulasHoursWorked = player.r.optimizeFormulasHoursWorked.add(tmp.pointGen.mul(diff))
        else if (getClickableState("r", 14))
            player.r.rollLibraryHoursWorked = player.r.rollLibraryHoursWorked.add(tmp.pointGen.mul(diff))
    },
    clickables: {
        rows: 1,
        cols: 4,
        11: {
            title: "Rename variables",
            display: function() {
                return `Take time to rename your variables more sensibly, making your productivity slow down even stronger but you gain a boost to productivity based on hours of work produced with this active.\n\nCurrently: ${format(clickableEffect("r", 11))}x productivity`
            },
            effect: function() {
                if (player.r.renameVariablesHoursWorked.lessThan(1)) return new Decimal(1)
                return player.r.renameVariablesHoursWorked.log(10).pow(2).add(1).pow(buyableEffect("a", 11))
            },
            unlocked() { return hasMilestone("r", 0) },
            canClick: function() { return !getClickableState("r", 12) && !getClickableState("r", 13) && !getClickableState("r", 14) },
            onClick: function() {
                setClickableState("r", 11, !getClickableState("r", 11))
            },
            style: {
                "height": "180px",
                "width": "200px"
            }
        },
        12: {
            title: "Encapsulate fields",
            display: function() {
                return `Take time to comply with arbitrary programming practices, making your productivity slow down even more strongly but you gain another boost to productivity based on hours of work produced with this active.\n\nCurrently: ${format(clickableEffect("r", 12))}x productivity`
            },
            effect: function() {
                if (player.r.encapsulateFieldHoursWorked.lessThan(1)) return new Decimal(1)
                return player.r.encapsulateFieldHoursWorked.log(10).pow(2).add(1).pow(buyableEffect("a", 11))
            },
            unlocked() { return hasMilestone("r", 1) },
            canClick: function() { return !getClickableState("r", 11) && !getClickableState("r", 13) && !getClickableState("r", 14) },
            onClick: function() {
                setClickableState("r", 12, !getClickableState("r", 12))
            },
            style: {
                "height": "180px",
                "width": "200px"
            }
        },
        13: {
            title: "Optimize formulas",
            display: function() {
                return `Take time to figure out how to get that darn bottleneck to O(1), making your productivity slow down like really strongly but you gain yet another boost to productivity based on hours of work produced with this active.\n\nCurrently: ${format(clickableEffect("r", 13))}x productivity`
            },
            effect: function() {
                if (player.r.optimizeFormulasHoursWorked.lessThan(1)) return new Decimal(1)
                return player.r.optimizeFormulasHoursWorked.log(10).pow(2).add(1).pow(buyableEffect("a", 11))
            },
            unlocked() { return hasMilestone("r", 3) },
            canClick: function() { return !getClickableState("r", 11) && !getClickableState("r", 12) && !getClickableState("r", 14) },
            onClick: function() {
                setClickableState("r", 13, !getClickableState("r", 13))
            },
            style: {
                "height": "180px",
                "width": "200px"
            }
        },
        14: {
            title: "Roll your own library",
            display: function() {
                return `Take time to replace that slow library with your own, making your productivity slow down most strongly but you gain, surprising no one, another boost to productivity based on hours of work produced with this active.\n\nCurrently: ${format(clickableEffect("r", 14))}x productivity`
            },
            effect: function() {
                if (player.r.rollLibraryHoursWorked.lessThan(1)) return new Decimal(1)
                return player.r.rollLibraryHoursWorked.log(10).pow(2).add(1).pow(buyableEffect("a", 11))
            },
            unlocked() { return hasMilestone("r", 7) },
            canClick: function() { return !getClickableState("r", 11) && !getClickableState("r", 12) && !getClickableState("r", 13) },
            onClick: function() {
                setClickableState("r", 14, !getClickableState("r", 14))
            },
            style: {
                "height": "180px",
                "width": "200px"
            }
        }
    },
    milestones: {
        0: {
            requirementDescription: "1 refactor",
            effectDescription: "Unlock first refactoring, and retain the second and third Experience upgrades",
            done() { return player[this.layer].total.gte(1) || (player.a.unlocked && !inChallenge("d", 12)) }
        },
        1: {
            requirementDescription: "1 refactors",
            effectDescription: "Unlock second refactoring",
            done() { return player[this.layer].total.gte(1) || (player.a.unlocked && !inChallenge("d", 12)) }
        },
        2: {
            requirementDescription: "1 refactors",
            effectDescription: "Retain the first Experience upgrade",
            done() { return player[this.layer].total.gte(1) },
            unlocked() { return player[this.layer].total.gte(1) || (player.a.unlocked && !inChallenge("d", 12)) }
        },
        3: {
            requirementDescription: "1 refactors",
            effectDescription: "Unlock third refactoring",
            done() { return player[this.layer].total.gte(1) },
            unlocked() { return player[this.layer].total.gte(1) || (player.a.unlocked && !inChallenge("d", 12)) }
        },
        4: {
            requirementDescription: "1 refactors",
            effectDescription: "Retain the fourth Experience upgrade",
            done() { return player[this.layer].total.gte(1) },
            unlocked() { return player[this.layer].total.gte(1) || (player.a.unlocked && !inChallenge("d", 12)) }
        },
        5: {
            requirementDescription: "1 refactors",
            effectDescription: "Retain the fifth Experience upgrade",
            done() { return player[this.layer].total.gte(1) },
            unlocked() { return player[this.layer].total.gte(1) || (player.a.unlocked && !inChallenge("d", 12)) }
        },
        6: {
            requirementDescription: "1 refactors",
            effectDescription: "Retain the sixth Experience upgrade",
            done() { return player[this.layer].total.gte(1) },
            unlocked() { return player[this.layer].total.gte(1) || (player.a.unlocked && !inChallenge("d", 12)) }
        },
        7: {
            requirementDescription: "1 refactors",
            effectDescription: "Unlock fourth refactoring",
            done() { return player[this.layer].total.gte(1) },
            unlocked() { return player[this.layer].total.gte(1) || (player.a.unlocked && !inChallenge("d", 12)) }
        }
    }
})
