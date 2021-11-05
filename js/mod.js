let modInfo = {
	name: "The Game Dev Tree But Faster",
	id: "gamedevtreebutfaster",
	author: "thepaperpilot edited by RTXT25",
	pointsName: "hours of work",
	endgame: new Decimal("e50"),
	discordName: "The Paper Pilot Community Server",
	discordLink: "https://discord.gg/WzejVAx",
	changelogLink: "https://github.com/thepaperpilot/The-Modding-Tree/blob/gamedevtree/changelog.md",
    offlineLimit: 5,  // In hours
    initialStartPoints: new Decimal (0) // Used for hard resets and new players
}

// Set your version in num and name
let VERSION = {
	num: "1.0.4",
	name: "Version Bump [rebalanced,debuggedx3]",
}

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything", "onStart"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(1)

	let gain = layers.e.effect()
	gain = gain.pow(buyableEffect("c", 11))

	gain = gain.mul(clickableEffect("r", 11))
	gain = gain.mul(clickableEffect("r", 12))
	gain = gain.mul(clickableEffect("r", 13))
	gain = gain.mul(clickableEffect("r", 14))
	gain = gain.mul(layers.f.effect().productivityMult)
	if (hasUpgrade("u", 11)) gain = gain.mul(2)
	if (hasUpgrade("u", 12)) gain = gain.mul(1.5)
	if (hasUpgrade("u", 22)) gain = gain.mul(upgradeEffect("u", 22))
	for (let r = 1; r <= 2; r++)
		for (let c = 1; c <= 4; c++)
			if (hasUpgrade("c", r * 10 + c)) gain = gain.mul(2)
	
	// Apply productivity slow downs
	let slowDownModifier = player.points.add(gain.sqrt()).sub(player.e.total.times(layers.r.effect())).clampMin(0).div(buyableEffect("a", 12)).pow(buyableEffect("s", 12)).clampMin(1)
	gain = gain.divide(slowDownModifier.sqrt())
	gain = gain.divide(slowDownModifier.sqrt().clampMin(10).log10().pow(2))
	slowDownModifier = slowDownModifier.pow(buyableEffect("a", 22))
	if (getClickableState("r", 11)) {
		gain = gain.divide(slowDownModifier.pow(.25))
	} else if (getClickableState("r", 12)) {
		gain = gain.divide(slowDownModifier.pow(.25))
		gain = gain.divide(slowDownModifier.pow(.125))
	} else if (getClickableState("r", 13)) {
		gain = gain.divide(slowDownModifier.pow(.25))
		gain = gain.divide(slowDownModifier.pow(.125))
		gain = gain.divide(slowDownModifier.pow(.0625))
	} else if (getClickableState("r", 14)) {
		gain = gain.divide(slowDownModifier.pow(.25))
		gain = gain.divide(slowDownModifier.pow(.125))
		gain = gain.divide(slowDownModifier.pow(.0625))
		gain = gain.divide(slowDownModifier.pow(.03125))
	}

	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	hqTree: true
}}

// Display extra things at the top of the page
var displayThings = [
	"<br/>",
	() => player.points < 24 * 3 ? "<br/>" :
		  player.points < 24 * 365 * 3 ?          `equivalent to ${format(player.points.div(24))} days of work` :
		  player.points < 24 * 365 * 300 ?        `equivalent to ${format(player.points.div(24 * 365))} years of work` :
		  player.points < 24 * 365 * 3000000 ?    `equivalent to ${format(player.points.div(24 * 365 * 100))} centuries of work` :
		  player.points < 24 * 365 * 3000000000 ? `equivalent to ${format(player.points.div(24 * 365 * 1000000))} epochs of work` :
		  new Decimal(24 * 365).times("3e1000").gte(player.points) ? `equivalent to ${format(player.points.div(24 * 365 * 1000000000))} eons of work` :
		                                          `equivalent to heat death ^${format(player.points.log(new Decimal(24).mul(365).mul("1e1000")))} of work`
]

// Determines when the game "ends"
function isEndgame() {
	return hasUpgrade("d", 11)
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600000000) // Default is 1 hour which is just arbitrarily large
}
