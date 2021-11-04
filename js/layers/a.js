addLayer("a", {
    name: "api",
    symbol: "A",
    color: apiColor,
    branches: [ 'r' ],
    row: 3,
    position: 1,
    resource: "endpoints",
    baseResource: "refactors",
    infoboxes: {
        lore: {
            title: "api",
            body: `All this <span style="color: ${refactoringColor}">refactoring</span> has given you a new sense of perspective on how all these different game engines tend to work, and you have an idea for a new <span style="color: ${apiColor}">Application Programming Interface (API)</span> that could simplify everything enormously, making almost everything easier to implement. The more <span style="color: ${refactoringColor}">refactoring experience</span> you have, the more <span style="color: ${apiColor}">API end points</span> you can use to implement your design.<br/><br/>` +
                  `Designing your <span style="color: ${apiColor}">API</span> means spending your <span style="color: ${apiColor}">endpoints</span> on adding or improving the various bonuses available to you.`
        }
    },
    resetDescription: "Design ",
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        unused: new Decimal(0)
    }},
    layerShown() { return player[this.layer].unlocked || player.r.total.gte(8) },
    type: "static",
    requires: new Decimal(10),
    base: new Decimal(1.2),
    baseAmount() { return player.r.points },
    exponent: 1,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    roundUpCost: true,
    onPrestige(gain) {
        player[this.layer].unused = player[this.layer].unused.add(gain)
    },
    tooltip() { return `${formatWhole(player.a.unused)} endpoints` },
    hotkeys: [
        {
            key: "a",
            description: "Press A to design API endpoints",
            onPress() { if (canReset(this.layer)) doReset(this.layer) }
        }
    ],
    tabFormat: [
        ["infobox", "lore"],
        ["display-text", () => inChallenge("d", 12) ? `<h2 style="color: red;">Disabled during ${layers.d.challenges[player.d.activeChallenge].name} degree plan</h2>` : ""],
        ["display-text", () => `You have <h2 style="color: ${tmp.a.color}; text-shadow: ${tmp.a.color} 0px 0px 10px">${formatWhole(player.a.unused)}</h2> endpoints`],
        ["display-text", () => `You have earned a total of ${player.a.points} endpoints.`],
        "blank",
        "prestige-button",
        "blank",
        "buyables",
        "blank",
        "milestones"
    ],
    buyables: {
        rows: 2,
        cols: 3,
        respec() {
            player.a.unused = player.a.points
            setBuyableAmount(this.layer, 11, 0)
            setBuyableAmount(this.layer, 12, 0)
            setBuyableAmount(this.layer, 13, 0)
            setBuyableAmount(this.layer, 21, 0)
            setBuyableAmount(this.layer, 22, 0)
            setBuyableAmount(this.layer, 23, 0)
            doReset("a", true)
        },
        respecText: "Re-design API",
        11: {
            title: "/refactoring/bonus",
            display() {
                const cost = this.cost()
                return `Each endpoint squares refactoring bonuses.<br/>Currently: ^${format(this.effect())}<br/>Requires ${formatWhole(cost.endpoints)} endpoints and ${format(cost.updates)} updates.`
            },
            cost(x) {
                const amt = x || getBuyableAmount(this.layer, this.id)
                return {
                    endpoints: new Decimal(1).add(amt),
                    updates: new Decimal(7500).mul(new Decimal(1).add(amt))
                }
            },
            canAfford() {
                const cost = this.cost()
                return player[this.layer].unused.gte(cost.endpoints) && player.u.points.gte(cost.updates)
            },
            buy() {
                const cost = this.cost()
                player[this.layer].unused = player[this.layer].unused.sub(cost.endpoints)
                player.u.points = player.u.points.sub(cost.updates)
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                return inChallenge("d", 12) ? new Decimal(1) : new Decimal(2).pow(Decimal.mul(getBuyableAmount(this.layer, this.id), buyableEffect("a", 23)))
            }
        },
        12: {
            title: "/motivation/boost",
            display() {
                const cost = this.cost()
                return `These endpoints delay the productivity slowdown by 10 raised to the power of (5 raised to the power of endpoints).<br/>Currently: /${format(this.effect())}<br/>Requires ${formatWhole(cost.endpoints)} endpoints and ${format(cost.updates)} updates.`
            },
            cost(x) {
                const amt = x || getBuyableAmount(this.layer, this.id)
                return {
                    endpoints: new Decimal(1).add(amt),
                    updates: new Decimal(10000).mul(new Decimal(2).pow(amt))
                }
            },
            canAfford() {
                const cost = this.cost()
                return player[this.layer].unused.gte(cost.endpoints) && player.u.points.gte(cost.updates)
            },
            buy() {
                const cost = this.cost()
                player[this.layer].unused = player[this.layer].unused.sub(cost.endpoints)
                player.u.points = player.u.points.sub(cost.updates)
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                return inChallenge("d", 12) ? new Decimal(1) : new Decimal(10).pow(new Decimal(5).pow(Decimal.mul(getBuyableAmount(this.layer, this.id), buyableEffect("a", 23))).sub(1))
            }
        },
        13: {
            title: "/updates",
            display() {
                const cost = this.cost()
                return `Each endpoint quadruples update gain.<br/>Currently: x${format(this.effect())}<br/>Requires ${formatWhole(cost.endpoints)} endpoints and ${format(cost.updates)} updates.`
            },
            cost(x) {
                const amt = x || getBuyableAmount(this.layer, this.id)
                return {
                    endpoints: new Decimal(1).add(amt),
                    updates: new Decimal(2).pow(amt).mul(50000)
                }
            },
            canAfford() {
                const cost = this.cost()
                return player[this.layer].unused.gte(cost.endpoints) && player.u.points.gte(cost.updates)
            },
            buy() {
                const cost = this.cost()
                player[this.layer].unused = player[this.layer].unused.sub(cost.endpoints)
                player.u.points = player.u.points.sub(cost.updates)
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                return inChallenge("d", 12) ? new Decimal(1) : new Decimal(4).pow(Decimal.mul(getBuyableAmount(this.layer, this.id), buyableEffect("a", 23)))
            },
            unlocked() { return challengeCompletions("d", 11) > 0 }
        },
        21: {
            title: "/experience",
            display() {
                const cost = this.cost()
                return `Each endpoint multiplies experience gain by 50x.<br/>Currently: x${format(this.effect())}<br/>Requires ${formatWhole(cost.endpoints)} endpoints and ${format(cost.updates)} updates.`
            },
            cost(x) {
                const amt = x || getBuyableAmount(this.layer, this.id)
                return {
                    endpoints: new Decimal(1).add(amt),
                    updates: new Decimal(1000).mul(new Decimal(5).pow(new Decimal(1).add(amt)))
                }
            },
            canAfford() {
                const cost = this.cost()
                return player[this.layer].unused.gte(cost.endpoints) && player.u.points.gte(cost.updates)
            },
            buy() {
                const cost = this.cost()
                player[this.layer].unused = player[this.layer].unused.sub(cost.endpoints)
                player.u.points = player.u.points.sub(cost.updates)
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                return inChallenge("d", 12) ? new Decimal(1) : new Decimal(50).pow(Decimal.mul(getBuyableAmount(this.layer, this.id), buyableEffect("a", 23)))
            }
        },
        22: {
            title: "/refactoring/prod",
            display() {
                const cost = this.cost()
                return `Each endpoint raises the extra slowdown effects of refactoring to the ^.2 power.<br/>Currently: ^${format(this.effect())}<br/>Requires ${formatWhole(cost.endpoints)} endpoints and ${format(cost.updates)} updates.`
            },
            cost(x) {
                const amt = x || getBuyableAmount(this.layer, this.id)
                return {
                    endpoints: new Decimal(1).add(amt),
                    updates: new Decimal(500).mul(new Decimal(5).pow(new Decimal(2).add(amt)))
                }
            },
            canAfford() {
                const cost = this.cost()
                return player[this.layer].unused.gte(cost.endpoints) && player.u.points.gte(cost.updates)
            },
            buy() {
                const cost = this.cost()
                player[this.layer].unused = player[this.layer].unused.sub(cost.endpoints)
                player.u.points = player.u.points.sub(cost.updates)
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                return inChallenge("d", 12) ? new Decimal(1) : new Decimal(.2).pow(Decimal.mul(getBuyableAmount(this.layer, this.id), buyableEffect("a", 23)))
            }
        },
        23: {
            title: "/api/v2",
            display() {
                const cost = this.cost()
                return `Each endpoint multiplies all other endpoint effects by 50%.<br/>Currently: x${format(this.effect())}<br/>Requires ${formatWhole(cost.endpoints)} endpoints and ${format(cost.updates)} updates.`
            },
            cost(x) {
                const amt = x || getBuyableAmount(this.layer, this.id)
                return {
                    endpoints: new Decimal(1).add(amt),
                    updates: new Decimal(2).pow(amt).mul(75000)
                }
            },
            canAfford() {
                const cost = this.cost()
                return player[this.layer].unused.gte(cost.endpoints) && player.u.points.gte(cost.updates)
            },
            buy() {
                const cost = this.cost()
                player[this.layer].unused = player[this.layer].unused.sub(cost.endpoints)
                player.u.points = player.u.points.sub(cost.updates)
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                return inChallenge("d", 12) ? new Decimal(1) : new Decimal(1.5).pow(getBuyableAmount(this.layer, this.id))
            },
            unlocked() { return challengeCompletions("d", 11) > 0 }
        }
    },
    milestones: {
        0: {
            requirementDescription: "1 total API endpoints",
            effectDescription: "Retain the first, second, fourth, and eighth refactors milestones",
            done() { return player[this.layer].points.gte(1) }
        },
        1: {
            requirementDescription: "2 total API endpoints",
            effectDescription: "Buying refactors will buy as many as you can afford",
            done() { return player[this.layer].points.gte(2) }
        },
        2: {
            requirementDescription: "3 total API endpoints",
            effectDescription: "Retain all refactors milestones",
            done() { return player[this.layer].points.gte(3) }
        },
        3: {
            requirementDescription: "4 total API endpoints",
            effectDescription: "Unlock a new Degree program",
            done() { return player[this.layer].points.gte(4) }
        },
        4: {
            requirementDescription: "5 total API endpoints",
            effectDescription: "Row 4 resets don't reset refactorings",
            done() { return player[this.layer].points.gte(5) }
        }
    }
})
