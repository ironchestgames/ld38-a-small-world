var gameVars = require('./gameVars')
var TweenLib = require('tween.js');

var rowCount = 4
var colCount = 6

var tiles
var buildingButtons

var baseProducedResources
var baseUsedResources

var TERRAIN_PLAIN = 'TERRAIN_PLAIN'
var TERRAIN_SAND = 'TERRAIN_SAND'
var TERRAIN_ICE = 'TERRAIN_ICE'
var TERRAIN_ORE = 'TERRAIN_ORE'
var TERRAIN_DOME = 'TERRAIN_DOME'

var RESOURCE_PEOPLE = 'RESOURCE_PEOPLE'
var RESOURCE_HEAT = 'RESOURCE_HEAT'
var RESOURCE_ORE = 'RESOURCE_ORE'
var RESOURCE_SAND = 'RESOURCE_SAND'
var RESOURCE_ICE = 'RESOURCE_ICE'
var RESOURCE_GLASS = 'RESOURCE_GLASS'
var RESOURCE_METAL = 'RESOURCE_METAL'
var RESOURCE_WATER = 'RESOURCE_WATER'
var RESOURCE_DOME = 'RESOURCE_DOME'

//Base buildings
var BUILDING_HEAT_GENERATOR = 'BUILDING_HEAT_GENERATOR'
var BUILDING_MINING = 'BUILDING_MINING'
var BUILDING_QUARRY = 'BUILDING_QUARRY'
var BUILDING_HQ = 'BUILDING_HQ'
var BUILDING_ICE_COLLECTOR = 'BUILDING_ICE_COLLECTOR'
var BUILDING_LIVING_QUARTERS = 'BUILDING_LIVING_QUARTERS'

//Resource converters
var BUILDING_METAL_AND_GLASS_TO_DOME = 'BUILDING_METAL_AND_GLASS_TO_DOME'
var BUILDING_ICE_AND_HEAT_TO_WATER = 'BUILDING_ICE_AND_HEAT_TO_WATER'
var BUILDING_ORE_TO_METAL = 'BUILDING_ORE_TO_METAL'
var BUILDING_SAND_TO_GLASS = 'BUILDING_SAND_TO_GLASS'
var BUILDING_DOME = 'BUILDING_DOME'

var buildingNeeds = {}
//Base buildings
buildingNeeds[BUILDING_HEAT_GENERATOR] = [RESOURCE_PEOPLE]
buildingNeeds[BUILDING_MINING] = [RESOURCE_PEOPLE]
buildingNeeds[BUILDING_QUARRY] = [RESOURCE_PEOPLE]
buildingNeeds[BUILDING_HQ] = []
buildingNeeds[BUILDING_ICE_COLLECTOR] = [RESOURCE_PEOPLE]
buildingNeeds[BUILDING_LIVING_QUARTERS] = []

//Resource converters
buildingNeeds[BUILDING_METAL_AND_GLASS_TO_DOME] = [RESOURCE_PEOPLE, RESOURCE_GLASS, RESOURCE_METAL]
buildingNeeds[BUILDING_ICE_AND_HEAT_TO_WATER] = [RESOURCE_PEOPLE, RESOURCE_ICE, RESOURCE_HEAT]
buildingNeeds[BUILDING_ORE_TO_METAL] = [RESOURCE_PEOPLE, RESOURCE_ORE]
buildingNeeds[BUILDING_SAND_TO_GLASS] = [RESOURCE_PEOPLE, RESOURCE_SAND]
buildingNeeds[BUILDING_DOME] = [RESOURCE_DOME]

var buildingProvides = {}
//Base buildings
buildingProvides[BUILDING_HEAT_GENERATOR] = RESOURCE_HEAT
buildingProvides[BUILDING_MINING] = RESOURCE_ORE
buildingProvides[BUILDING_QUARRY] = RESOURCE_SAND
buildingProvides[BUILDING_HQ] = RESOURCE_PEOPLE
buildingProvides[BUILDING_ICE_COLLECTOR] = RESOURCE_ICE
buildingProvides[BUILDING_LIVING_QUARTERS] = RESOURCE_PEOPLE

//Resource converters
buildingProvides[BUILDING_METAL_AND_GLASS_TO_DOME] = RESOURCE_DOME
buildingProvides[BUILDING_ICE_AND_HEAT_TO_WATER] = RESOURCE_WATER
buildingProvides[BUILDING_ORE_TO_METAL] = RESOURCE_METAL
buildingProvides[BUILDING_SAND_TO_GLASS] = RESOURCE_GLASS

var buildingTerrainPermissions = {}
buildingTerrainPermissions[null] = []
buildingTerrainPermissions[BUILDING_HEAT_GENERATOR] = [TERRAIN_PLAIN, TERRAIN_SAND, TERRAIN_ORE]
buildingTerrainPermissions[BUILDING_MINING] = [TERRAIN_ORE]
buildingTerrainPermissions[BUILDING_QUARRY] = [TERRAIN_SAND]
buildingTerrainPermissions[BUILDING_HQ] = [TERRAIN_PLAIN, TERRAIN_SAND, TERRAIN_ICE, TERRAIN_ORE]
buildingTerrainPermissions[BUILDING_ICE_COLLECTOR] = [TERRAIN_ICE]
buildingTerrainPermissions[BUILDING_LIVING_QUARTERS] = [TERRAIN_PLAIN, TERRAIN_SAND, TERRAIN_ORE]

//Resource converters
buildingTerrainPermissions[BUILDING_METAL_AND_GLASS_TO_DOME] = [TERRAIN_PLAIN, TERRAIN_SAND, TERRAIN_ICE, TERRAIN_ORE]
buildingTerrainPermissions[BUILDING_ICE_AND_HEAT_TO_WATER] = [TERRAIN_PLAIN, TERRAIN_SAND, TERRAIN_ICE, TERRAIN_ORE]
buildingTerrainPermissions[BUILDING_ORE_TO_METAL] = [TERRAIN_PLAIN, TERRAIN_SAND, TERRAIN_ICE, TERRAIN_ORE]
buildingTerrainPermissions[BUILDING_SAND_TO_GLASS] = [TERRAIN_PLAIN, TERRAIN_SAND, TERRAIN_ICE, TERRAIN_ORE]
buildingTerrainPermissions[BUILDING_DOME] = [TERRAIN_DOME]

var buildingNamesCapitalized = {}
buildingNamesCapitalized[BUILDING_HEAT_GENERATOR] = 'HEAT GENERATOR'
buildingNamesCapitalized[BUILDING_MINING] = 'ORE MINE'
buildingNamesCapitalized[BUILDING_QUARRY] = 'QUARRY'
buildingNamesCapitalized[BUILDING_HQ] = 'BASE HQ'
buildingNamesCapitalized[BUILDING_ICE_COLLECTOR] = 'ICE COLLECTOR'
buildingNamesCapitalized[BUILDING_LIVING_QUARTERS] = 'LIVING QUARTERS'
buildingNamesCapitalized[BUILDING_METAL_AND_GLASS_TO_DOME] = 'DOME MAINTENANCE FACILITY'
buildingNamesCapitalized[BUILDING_ICE_AND_HEAT_TO_WATER] = 'WATER PLANT'
buildingNamesCapitalized[BUILDING_ORE_TO_METAL] = 'METAL WORKS'
buildingNamesCapitalized[BUILDING_SAND_TO_GLASS] = 'GLASS WORKS'
buildingNamesCapitalized[BUILDING_DOME] = 'DOME'

var infoTexts = {}
infoTexts[BUILDING_HEAT_GENERATOR] = buildingNamesCapitalized[BUILDING_HEAT_GENERATOR] + '\nProduces heat'
infoTexts[BUILDING_MINING] = buildingNamesCapitalized[BUILDING_MINING] + '\nProduces ore from ore tiles'
infoTexts[BUILDING_QUARRY] = buildingNamesCapitalized[BUILDING_QUARRY] + '\nProduces sand from sand tiles'
infoTexts[BUILDING_HQ] = buildingNamesCapitalized[BUILDING_HQ] + '\nProvides a starting population\nCan not be removed'
infoTexts[BUILDING_ICE_COLLECTOR] = buildingNamesCapitalized[BUILDING_ICE_COLLECTOR] + '\nProduces ice from ice tiles'
infoTexts[BUILDING_LIVING_QUARTERS] = buildingNamesCapitalized[BUILDING_LIVING_QUARTERS] + '\nProvides 4 people'

//Resource converters
infoTexts[BUILDING_METAL_AND_GLASS_TO_DOME] = buildingNamesCapitalized[BUILDING_METAL_AND_GLASS_TO_DOME] + '\nConsumes metal and glass to construct and maintain the dome'
infoTexts[BUILDING_ICE_AND_HEAT_TO_WATER] = buildingNamesCapitalized[BUILDING_ICE_AND_HEAT_TO_WATER] + '\nConsumes ice and heat to produce water\nControls water levels on the asteroid'
infoTexts[BUILDING_ORE_TO_METAL] = buildingNamesCapitalized[BUILDING_ORE_TO_METAL] + '\nConsumes ore to produce metal'
infoTexts[BUILDING_SAND_TO_GLASS] = buildingNamesCapitalized[BUILDING_SAND_TO_GLASS] + '\nConsumes sand to produce glass'
infoTexts[BUILDING_DOME] = buildingNamesCapitalized[BUILDING_DOME] + '\nHolds atmosphere'

infoTexts[TERRAIN_PLAIN] = '(No resource)'
infoTexts[TERRAIN_SAND] = 'SAND'
infoTexts[TERRAIN_ICE] = 'ICE'
infoTexts[TERRAIN_ORE] = 'ORE'
infoTexts[TERRAIN_DOME] = '(Dome placement)'

var buttonHumanTexts = {}
buttonHumanTexts[BUILDING_HEAT_GENERATOR] = 'Heat Generator'
buttonHumanTexts[BUILDING_MINING] = 'Ore Mine'
buttonHumanTexts[BUILDING_QUARRY] = 'Quarry'
buttonHumanTexts[BUILDING_HQ] = 'Base HQ'
buttonHumanTexts[BUILDING_ICE_COLLECTOR] = 'Ice Collector'
buttonHumanTexts[BUILDING_LIVING_QUARTERS] = 'Living Quarters'
buttonHumanTexts[BUILDING_METAL_AND_GLASS_TO_DOME] = 'Dome Maintena..'
buttonHumanTexts[BUILDING_ICE_AND_HEAT_TO_WATER] = 'Water Plant'
buttonHumanTexts[BUILDING_ORE_TO_METAL] = 'Metal Works'
buttonHumanTexts[BUILDING_SAND_TO_GLASS] = 'Glass Works'
buttonHumanTexts[BUILDING_DOME] = 'Dome'

buttonHumanTexts[RESOURCE_PEOPLE] = 'People'
buttonHumanTexts[RESOURCE_HEAT] = 'Heat'
buttonHumanTexts[RESOURCE_ORE] = 'Ore'
buttonHumanTexts[RESOURCE_SAND] = 'Sand'
buttonHumanTexts[RESOURCE_ICE] = 'Ice'
buttonHumanTexts[RESOURCE_GLASS] = 'Glass'
buttonHumanTexts[RESOURCE_METAL] = 'Metal'
buttonHumanTexts[RESOURCE_WATER] = 'Water'
buttonHumanTexts[RESOURCE_DOME] = 'Dome parts'

var score = {}

var resourceScoreFactors = {}
resourceScoreFactors[RESOURCE_HEAT] = 4
resourceScoreFactors[RESOURCE_PEOPLE] = 4
resourceScoreFactors[RESOURCE_SAND] = 2
resourceScoreFactors[RESOURCE_GLASS] = 1
resourceScoreFactors[RESOURCE_METAL] = 3
resourceScoreFactors[RESOURCE_WATER] = 10
resourceScoreFactors[RESOURCE_DOME] = 9

var SCORE_CONSTANT_DOME = 50
var SCORE_CONSTANT_UNBUILT_TERRAIN = 12

var SCORE_FACTOR_TOO_BIG_LQ_CLUSTER = -0.65
var SCORE_FACTOR_TREES_NEXT_TO_LQ = 0.05
var SCORE_FACTOR_METAL_WORKS_NEXT_TO_TREES = -0.7
var SCORE_FACTOR_OVERWORKED_POPULATION = -0.75
var SCORE_FACTOR_ICE_WITHOUT_COLLECTORS = -0.25
var SCORE_FACTOR_ALL_WATER_IN_WATER_CHAIN = 0.5
var SCORE_FACTOR_DOME_NOT_MAINTAINED = -0.5

var FLARE_DOME_BUILT = 'FLARE_DOME_BUILT'
var FLARE_TREES_NEXT_TO_LQ = 'FLARE_TREES_NEXT_TO_LQ'
var FLARE_ALL_WATER_IN_WATER_CHAIN = 'FLARE_ALL_WATER_IN_WATER_CHAIN'

var FLARE_TOO_BIG_LQ_CLUSTER = 'FLARE_TOO_BIG_LQ_CLUSTER'
var FLARE_ICE_AND_DOME = 'FLARE_ICE_AND_DOME'
var FLARE_METAL_WORKS_NEXT_TO_TREES = 'FLARE_METAL_WORKS_NEXT_TO_TREES'
var FLARE_OVERWORKED_POPULATION = 'FLARE_OVERWORKED_POPULATION'
var FLARE_DOME_NOT_MAINTAINED = 'FLARE_DOME_NOT_MAINTAINED'

var resourceNames = {}
resourceNames[TERRAIN_PLAIN] = 'tile_plain'
resourceNames[TERRAIN_SAND] = 'tile_sand'
resourceNames[TERRAIN_ICE] = 'tile_ice'
resourceNames[TERRAIN_ORE] = 'tile_ore'

resourceNames[BUILDING_HEAT_GENERATOR] = 'heat_generator'
resourceNames[BUILDING_MINING] = 'mining'
resourceNames[BUILDING_QUARRY] = 'quarry'
resourceNames[BUILDING_HQ] = 'hq'
resourceNames[BUILDING_ICE_COLLECTOR] = 'ice_collector'
resourceNames[BUILDING_LIVING_QUARTERS] = 'living_quarters'
resourceNames[BUILDING_METAL_AND_GLASS_TO_DOME] = 'dome_main'
resourceNames[BUILDING_ICE_AND_HEAT_TO_WATER] = 'ice_and_heat_to_water'
resourceNames[BUILDING_ORE_TO_METAL] = 'ore_to_metal'
resourceNames[BUILDING_SAND_TO_GLASS] = 'sand_to_glass'
resourceNames[BUILDING_DOME] = 'dome'
resourceNames.DOME_ICON = 'dome_icon'

resourceNames[RESOURCE_PEOPLE] = 'resource_people'
resourceNames[RESOURCE_HEAT] = 'resource_heat'
resourceNames[RESOURCE_ORE] = 'resource_ore'
resourceNames[RESOURCE_SAND] = 'resource_sand'
resourceNames[RESOURCE_ICE] = 'resource_ice'
resourceNames[RESOURCE_GLASS] = 'resource_glass'
resourceNames[RESOURCE_METAL] = 'resource_metal'
resourceNames[RESOURCE_WATER] = 'resource_water'
resourceNames[RESOURCE_DOME] = 'resource_dome'

var selectedBuildingButton = null

var buildingButtonTypes = [ // this is the order for the buttons
  BUILDING_LIVING_QUARTERS,

  BUILDING_HEAT_GENERATOR,
  BUILDING_ICE_COLLECTOR,
  BUILDING_ICE_AND_HEAT_TO_WATER,

  BUILDING_MINING,
  BUILDING_ORE_TO_METAL,

  BUILDING_QUARRY,
  BUILDING_SAND_TO_GLASS,

  BUILDING_METAL_AND_GLASS_TO_DOME,

  BUILDING_DOME,
]

var resourceTexts = {} // inited in gameScene create
resourceTexts[RESOURCE_PEOPLE] = null
resourceTexts[RESOURCE_HEAT] = null
resourceTexts[RESOURCE_ORE] = null
resourceTexts[RESOURCE_SAND] = null
resourceTexts[RESOURCE_ICE] = null
resourceTexts[RESOURCE_GLASS] = null
resourceTexts[RESOURCE_METAL] = null
resourceTexts[RESOURCE_WATER] = null
resourceTexts[RESOURCE_DOME] = null

var deselectBuildingButton = function () {
  selectedBuildingButton = null
  updateTileMarkers()
  updateBuildingButtons()
}

var buildingHasAllRequiredResources = function(tile) {
  var myBuildingNeeds = buildingNeeds[tile.buildingType]
  for (var i = 0; i < myBuildingNeeds.length; i++) {
    var buildingNeed = myBuildingNeeds[i]
    if (!baseProducedResources.includes(buildingNeed)) {
      return false
    }
  }
  return true
}

var isTileProducingResource = function (tile, resource) {

  if (!tile.buildingType) {
    return false
  }

  switch (resource) {

    // level 1
    case RESOURCE_HEAT:
      return tile.buildingType == BUILDING_HEAT_GENERATOR && buildingHasAllRequiredResources(tile)

    case RESOURCE_SAND:
      return tile.buildingType == BUILDING_QUARRY && buildingHasAllRequiredResources(tile)

    case RESOURCE_ICE:
      return tile.buildingType == BUILDING_ICE_COLLECTOR && buildingHasAllRequiredResources(tile)

    case RESOURCE_ORE:
      return tile.buildingType == BUILDING_MINING && buildingHasAllRequiredResources(tile)

    case RESOURCE_PEOPLE:
      return (tile.buildingType == BUILDING_LIVING_QUARTERS) || (tile.buildingType == BUILDING_HQ)

    // level 2
    case RESOURCE_GLASS:
      return tile.buildingType == BUILDING_SAND_TO_GLASS && buildingHasAllRequiredResources(tile)

    case RESOURCE_METAL:
      return tile.buildingType == BUILDING_ORE_TO_METAL && buildingHasAllRequiredResources(tile)

    case RESOURCE_DOME:
      return tile.buildingType == BUILDING_METAL_AND_GLASS_TO_DOME && buildingHasAllRequiredResources(tile)

    case RESOURCE_WATER:
      return tile.buildingType == BUILDING_ICE_AND_HEAT_TO_WATER && buildingHasAllRequiredResources(tile)

  }
}

var getInsideGrid = function (x, y) {
  return tiles.find(function (tile) {
    return tile.x === x && tile.y === y
  })
}

var produceResource = function (resource) {
  for (var i = 0; i < tiles.length; i++) {
    var tile = tiles[i]

    if (isTileProducingResource(tile, resource)) {
      baseProducedResources.push(resource)

      // add in total 4 peoples from LQs
      if (tile.buildingType === BUILDING_LIVING_QUARTERS && resource === RESOURCE_PEOPLE) {
        baseProducedResources.push(resource)
        baseProducedResources.push(resource)
        baseProducedResources.push(resource)
      }
    }
  }
}

var updateGame = function () {
  updateTiles()
  updateBuildingButtons()
  updateNumbers()
}

var updateTiles = function () {
  baseProducedResources = []
  baseUsedResources = []

  // level 1
  produceResource(RESOURCE_PEOPLE)

  // level 2
  produceResource(RESOURCE_SAND)
  produceResource(RESOURCE_ICE)
  produceResource(RESOURCE_ORE)
  produceResource(RESOURCE_HEAT)

  // level 3
  produceResource(RESOURCE_GLASS)
  produceResource(RESOURCE_METAL)
  produceResource(RESOURCE_WATER)

  // level 5
  produceResource(RESOURCE_DOME)

  for (var i = 0; i < tiles.length; i++) {
    tiles[i].update()
  }
}

var updateBuildingButtons = function () {
  for (var buildingType in buildingButtons) {
    if (selectedBuildingButton === buildingType) {
      buildingButtons[buildingType].setSelected(true)  
    } else {
      buildingButtons[buildingType].setSelected(false)
    }
    var buildingButton = buildingButtons[buildingType]
    buildingButton.setActive(true)
    var myBuildingNeeds = buildingNeeds[buildingButton.buildingType]
    for (var i = 0; i < myBuildingNeeds.length; i++) {
      if (!baseProducedResources.includes(myBuildingNeeds[i])) {
        buildingButton.setActive(false)
      }
    }
  }
}

var updateNumbers = function () {
  for (var resourceTextName in resourceTexts) {
    var textObject = resourceTexts[resourceTextName]
    var produced = getResourceProduced(resourceTextName)
    var consumed = getResourceConsumed(resourceTextName)

    textObject.style.fill = '#000000'
    if (produced - consumed > 0) {
      textObject.style.fill = '#00aa00'
    } else if (produced - consumed < 0) {
      textObject.style.fill = '#dd0000'
    }

    textObject.text = ': ' +
        produced + ' / ' +
        consumed
  }
}

var updateTileMarkers = function () {
  for (var i = 0; i < tiles.length; i++) {
    var tile = tiles[i]
    tile.isAvailableForSelectedBuilding =
        buildingTerrainPermissions[selectedBuildingButton].includes(tile.terrainType)

    tile.greenMarkerSprite.visible = false
    tile.yellowMarkerSprite.visible = false
    if (tile.isAvailableForSelectedBuilding) {
      if (tile.buildingType) {
        tile.yellowMarkerSprite.visible = true
      } else {
        tile.greenMarkerSprite.visible = true
      }
    }
  }
}

var getResourceProduced = function (resource) {
  return baseProducedResources.filter(function (producedResource) {
    return producedResource === resource
  }).length
}

var getResourceConsumed = function (resource) {
  return baseUsedResources.filter(function (producedResource) {
    return producedResource === resource
  }).length
}

var findBuildingByType = function (buildingType) {
  for (var i = 0; i < tiles.length; i++) {
    var tile = tiles[i]
    if (tile.buildingType === buildingType) {
      return tile
    }
  }
  return null
}

var getResourceTallyHo = function (resource) {
  return getResourceProduced(resource) * resourceScoreFactors[resource]
}

var getSurroundingTiles = function (tile) {
  var surroundingTiles = []

  var other = getInsideGrid(tile.x + 1, tile.y)
  if (other) {
    surroundingTiles.push(other)
  }

  other = getInsideGrid(tile.x, tile.y + 1)
  if (other) {
    surroundingTiles.push(other)
  }

  other = getInsideGrid(tile.x - 1, tile.y)
  if (other) {
    surroundingTiles.push(other)
  }

  other = getInsideGrid(tile.x, tile.y - 1)
  if (other) {
    surroundingTiles.push(other)
  }

  return surroundingTiles
}

var terraform = function () {
  gameScene.asteroidSprite.texture = PIXI.loader.resources['astroid_green'].texture

  tiles.forEach(function (tile) {
    if (!tile.buildingType) {
      var forest = new PIXI.Sprite(PIXI.loader.resources['trees'].texture)
      tile.container.addChild(forest)
    }
  })
}

var countScore = function () {

  score.extra = 0
  score.totalFactors = []
  score.flares = []

  score[RESOURCE_PEOPLE] = getResourceTallyHo(RESOURCE_PEOPLE)
  score[RESOURCE_HEAT] = getResourceTallyHo(RESOURCE_HEAT)
  score[RESOURCE_SAND] = getResourceTallyHo(RESOURCE_SAND)
  score[RESOURCE_WATER] = getResourceTallyHo(RESOURCE_WATER)
  score[RESOURCE_METAL] = getResourceTallyHo(RESOURCE_METAL)
  score[RESOURCE_GLASS] = getResourceTallyHo(RESOURCE_GLASS)
  score[RESOURCE_DOME] = getResourceTallyHo(RESOURCE_DOME)

  // DOME BUILT
  if (findBuildingByType(BUILDING_DOME)) {

    score.extra += SCORE_CONSTANT_DOME
    score.flares.push(FLARE_DOME_BUILT)

    // DOME NOT MAINTAINED
    var domeParts = getResourceProduced(RESOURCE_DOME)
    if (domeParts === 0) {
      score.flares.push(FLARE_DOME_NOT_MAINTAINED)
      score.totalFactors.push(SCORE_FACTOR_DOME_NOT_MAINTAINED)
    }

    // UNBUILT TERRAIN -> TREES
    var unbuiltTerrainCount = 0
    for (var i = 0; i < tiles.length; i++) {
      var tile = tiles[i]
      if (!tile.buildingType) {
        unbuiltTerrainCount++
      }
    }
    score.extra += unbuiltTerrainCount * SCORE_CONSTANT_UNBUILT_TERRAIN

    // TREES NEXT TO LQs
    var isFound = false
    for (var i = 0; i < tiles.length; i++) {
      var tile = tiles[i]
      if (tile.buildingType === BUILDING_LIVING_QUARTERS) {
        var surroundingTiles = getSurroundingTiles(tile)
        var surroundingUnbuiltTiles = surroundingTiles.filter(function (_tile) {
          return !_tile.buildingType
        })
        if (surroundingUnbuiltTiles.length > 0) {
          score.totalFactors.push(SCORE_FACTOR_TREES_NEXT_TO_LQ)
          isFound = true
        }
      }
    }
    if (isFound) {
      score.flares.push(FLARE_TREES_NEXT_TO_LQ)
    }

    // METAL WORKS NEXT TO TREES (VERY BAD, FIRE)
    for (var i = 0; i < tiles.length; i++) {
      var tile = tiles[i]
      if (tile.buildingType === BUILDING_ORE_TO_METAL) {
        var surroundingTiles = getSurroundingTiles(tile)
        var surroundingUnbuiltTiles = surroundingTiles.filter(function (_tile) {
          return !_tile.buildingType
        })
        if (surroundingUnbuiltTiles.length > 0) {
          score.totalFactors.push(SCORE_FACTOR_METAL_WORKS_NEXT_TO_TREES)
          score.flares.push(FLARE_METAL_WORKS_NEXT_TO_TREES)
          break
        }
      }
    }

    // ICE WITHOUT COLLECTORS
    var iceWithoutCollector = 0
    for (var i = 0; i < tiles.length; i++) {
      var tile = tiles[i]
      if (tile.terrainType === TERRAIN_ICE && tile.buildingType !== BUILDING_ICE_COLLECTOR)
        iceWithoutCollector++
    }
    if (iceWithoutCollector > 0) {
      score.flares.push(FLARE_ICE_AND_DOME)
      score.totalFactors.push(SCORE_FACTOR_ICE_WITHOUT_COLLECTORS)
    }
  }

  // --- regardless of dome ---

  // TOO BIG CLUSTERS OF LQ
  for (var i = 0; i < tiles.length; i++) {
    var tile = tiles[i]
    if (tile.buildingType === BUILDING_LIVING_QUARTERS) {
      var surroundingTiles = getSurroundingTiles(tile)
      var surroundingLivingQuarters = surroundingTiles.filter(function (_tile) {
        return _tile.buildingType === BUILDING_LIVING_QUARTERS
      })
      if (surroundingLivingQuarters.length > 1) {
        score.totalFactors.push(SCORE_FACTOR_TOO_BIG_LQ_CLUSTER)
        score.flares.push(FLARE_TOO_BIG_LQ_CLUSTER)
        break
      }
    }
  }

  // OVERWORKED POPULATION
  if (getResourceProduced(RESOURCE_PEOPLE) - getResourceConsumed(RESOURCE_PEOPLE) < 0) {
    score.flares.push(FLARE_OVERWORKED_POPULATION)
    score.totalFactors.push(SCORE_FACTOR_OVERWORKED_POPULATION)
  }

  // ALL WATER IS IN WATER CHAIN
  var uncollectedIce = tiles.filter(function (tile) {
    return tile.terrainType === TERRAIN_ICE && tile.buildingType !== BUILDING_ICE_COLLECTOR
  }).length

  var waterProduced = getResourceProduced(RESOURCE_WATER)
  var heatProduced = getResourceProduced(RESOURCE_HEAT)
  var iceProduced = getResourceProduced(RESOURCE_ICE)

  if (uncollectedIce === 0 &&
      iceProduced === waterProduced &&
      heatProduced === waterProduced) {
    score.flares.push(FLARE_ALL_WATER_IN_WATER_CHAIN)
    score.totalFactors.push(SCORE_FACTOR_ALL_WATER_IN_WATER_CHAIN)
  }

  // sum

  var baseTotal =
      score[RESOURCE_PEOPLE] +
      score[RESOURCE_GLASS] +
      score[RESOURCE_HEAT] +
      score[RESOURCE_WATER] +
      score[RESOURCE_SAND] +
      score[RESOURCE_METAL]

  score.baseTotal = baseTotal
  score.total = baseTotal + score.extra

  for (var i = 0; i < score.totalFactors.length; i++) {
    score.total += baseTotal * score.totalFactors[i]
  }

  score.total = Math.ceil(score.total)

  if (score.total < 0) {
    score.total = 0
  }

  gameScene.showResultScreen(score)
}

var setInformationBoxText = function (text) {
  gameScene.informationBoxText.text = text
}

var Tile = function (x, y, terrainType) {
  this.x = x
  this.y = y
  this.terrainType = terrainType
  this.buildingType = null
  this.isAvailableForSelectedBuilding = false

  var resourceName = resourceNames[terrainType]

  this.container = new PIXI.Container()
  this.iconsContainer = new PIXI.Container()
  this.iconsContainer.y = 2
  this.buildingContainer = new PIXI.Container()

  if (this.terrainType === BUILDING_HQ) {
    resourceName = resourceNames[TERRAIN_PLAIN]
    this.terrainSprite = new PIXI.Sprite(PIXI.loader.resources[resourceName].texture)
    this.changeBuilding(BUILDING_HQ)
  } else {
    if (this.terrainType === TERRAIN_DOME) {
      this.terrainSprite = new PIXI.Sprite(PIXI.Texture.EMPTY)
      this.terrainSprite.width = 64
      this.terrainSprite.height = 64
    } else {
      this.terrainSprite = new PIXI.Sprite(PIXI.loader.resources[resourceName].texture)
    }
  }

  if (this.terrainType !== TERRAIN_DOME) {
    this.terrainSprite.interactive = true
  }
  this.terrainSprite.on('click', function () {
    if (selectedBuildingButton) {
      if (this.isAvailableForSelectedBuilding) {
        this.changeBuilding(selectedBuildingButton)
        updateGame()

        deselectBuildingButton()
        setInformationBoxText('')
      } else {
        if (this.terrainType === BUILDING_HQ) {
          setInformationBoxText('Can\'t replace HQ')

          deselectBuildingButton()
        } else {
          setInformationBoxText('Must place building on green tiles')
        }
      }
    } else {
      var str = infoTexts[this.terrainType]
      if (this.buildingType && this.buildingType !== BUILDING_HQ) {
        str = infoTexts[this.buildingType] + '\n(terrain: ' + str + ')'
      }
      setInformationBoxText(str)
    }
  }.bind(this))

  this.greenMarkerSprite = new PIXI.Sprite(PIXI.loader.resources['tile_placement_available'].texture)
  this.greenMarkerSprite.visible = false

  this.yellowMarkerSprite = new PIXI.Sprite(PIXI.loader.resources['tile_placement_yellow'].texture)
  this.yellowMarkerSprite.visible = false

  this.container.addChild(this.terrainSprite)
  this.container.addChild(this.buildingContainer)
  this.container.addChild(this.iconsContainer)
  this.container.addChild(this.greenMarkerSprite)
  this.container.addChild(this.yellowMarkerSprite)

  this.container.x = x * 64
  this.container.y = y * 64
}

Tile.prototype.changeTileScreenPosition = function (x, y) {
  this.container.x = x
  this.container.y = y
}

Tile.prototype.changeBuilding = function (buildingType) {
  var resourceName = resourceNames[buildingType]

  var buildingSprite = new PIXI.Sprite(PIXI.loader.resources[resourceName].texture)

  if (buildingType === BUILDING_METAL_AND_GLASS_TO_DOME) {
    var sheet_textures = []
    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["dome_main_spritesheet"].texture,
      new PIXI.Rectangle(0, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["dome_main_spritesheet"].texture,
      new PIXI.Rectangle(64, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["dome_main_spritesheet"].texture,
      new PIXI.Rectangle(64 * 2, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["dome_main_spritesheet"].texture,
      new PIXI.Rectangle(64 * 3, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["dome_main_spritesheet"].texture,
      new PIXI.Rectangle(64 * 2, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["dome_main_spritesheet"].texture,
      new PIXI.Rectangle(64, 0, 64, 64)))

    new TweenLib.Tween({ index: 0 })
      .to({index: 20}, 2500)
      .repeat(Infinity)
      .onUpdate(function() {
        var idx = (this.index > 5) ? 0 : Math.round(this.index);
        buildingSprite.texture = sheet_textures[idx]
      })
      .start()
  }

  if (buildingType === BUILDING_ORE_TO_METAL) {
    var sheet_textures = []
    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["ore_to_metal-sheet"].texture,
      new PIXI.Rectangle(0, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["ore_to_metal-sheet"].texture,
      new PIXI.Rectangle(64, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["ore_to_metal-sheet"].texture,
      new PIXI.Rectangle(64 * 2, 0, 64, 64)))

    new TweenLib.Tween({ index: 0 })
      .to({index: 3}, 1000)
      .repeat(Infinity)
      .onUpdate(function() {
        var idx = (this.index > 2) ? 0 : Math.round(this.index);
        buildingSprite.texture = sheet_textures[idx]
      })
      .start()
  }

  if (buildingType === BUILDING_QUARRY) {
    var sheet_textures = []
    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["quarry-sheet"].texture,
      new PIXI.Rectangle(0, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["quarry-sheet"].texture,
      new PIXI.Rectangle(64, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["quarry-sheet"].texture,
      new PIXI.Rectangle(64 * 2, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["quarry-sheet"].texture,
      new PIXI.Rectangle(64 * 2, 0, 64, 64)))

    new TweenLib.Tween({ index: 0 })
      .to({index: 10}, 2000)
      .repeat(Infinity)
      .onUpdate(function() {
        var idx = (this.index > 3) ? 0 : Math.round(this.index);
        buildingSprite.texture = sheet_textures[idx]
      })
      .start()
  }

  if (buildingType === BUILDING_MINING) {
    var sheet_textures = []
    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["mining-sheet"].texture,
      new PIXI.Rectangle(0, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["mining-sheet"].texture,
      new PIXI.Rectangle(64, 0, 64, 64)))

    new TweenLib.Tween({ index: 0 })
      .to({index: 2}, 1000)
      .repeat(Infinity)
      .onUpdate(function() {
        var idx = (this.index > 1) ? 0 : Math.round(this.index);
        buildingSprite.texture = sheet_textures[idx]
      })
      .start()
  }

  if (buildingType === BUILDING_HEAT_GENERATOR) {
    var sheet_textures = []
    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["heat_generator_spritesheet"].texture,
      new PIXI.Rectangle(0, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["heat_generator_spritesheet"].texture,
      new PIXI.Rectangle(64, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["heat_generator_spritesheet"].texture,
      new PIXI.Rectangle(64 * 2, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["heat_generator_spritesheet"].texture,
      new PIXI.Rectangle(64 * 3, 0, 64, 64)))

    new TweenLib.Tween({ index: 0 })
      .to({index: 15}, 4000)
      .repeat(Infinity)
      .onUpdate(function() {
        var idx = (this.index > 3) ? 0 : Math.round(this.index);
        buildingSprite.texture = sheet_textures[idx]
      })
      .start()
  }

  if (buildingType === BUILDING_HQ) {
    var sheet_textures = []
    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["hq_spritesheet"].texture,
      new PIXI.Rectangle(0, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["hq_spritesheet"].texture,
      new PIXI.Rectangle(64, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["hq_spritesheet"].texture,
      new PIXI.Rectangle(64 * 2, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["hq_spritesheet"].texture,
      new PIXI.Rectangle(64 * 3, 0, 64, 64)))

    new TweenLib.Tween({ index: 0 })
      .to({index: 40}, 10000)
      .repeat(Infinity)
      .onUpdate(function() {
        var idx = (this.index > 3) ? 0 : Math.round(this.index);
        buildingSprite.texture = sheet_textures[idx]
      })
      .start()
  }

  if (buildingType === BUILDING_LIVING_QUARTERS) {
    var sheet_textures = []
    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["living_quarters_spritesheet"].texture,
      new PIXI.Rectangle(0, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["living_quarters_spritesheet"].texture,
      new PIXI.Rectangle(64, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["living_quarters_spritesheet"].texture,
      new PIXI.Rectangle(64 * 2, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["living_quarters_spritesheet"].texture,
      new PIXI.Rectangle(64 * 3, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["living_quarters_spritesheet"].texture,
      new PIXI.Rectangle(64 * 2, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["living_quarters_spritesheet"].texture,
      new PIXI.Rectangle(64, 0, 64, 64)))

    new TweenLib.Tween({ index: 0 })
      .to({index: 6}, 3000)
      .repeat(Infinity)
      .onUpdate(function() {
        var idx = (this.index > 5) ? 0 : Math.ceil(this.index);
        buildingSprite.texture = sheet_textures[idx]
      })
      .start()
  }

  if (buildingType === BUILDING_SAND_TO_GLASS) {
    var sheet_textures = []
    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["sand_to_glass-sheet"].texture,
      new PIXI.Rectangle(0, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["sand_to_glass-sheet"].texture,
      new PIXI.Rectangle(64, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["sand_to_glass-sheet"].texture,
      new PIXI.Rectangle(64 * 2, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["sand_to_glass-sheet"].texture,
      new PIXI.Rectangle(64 * 3, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["sand_to_glass-sheet"].texture,
      new PIXI.Rectangle(64 * 4, 0, 64, 64)))

    sheet_textures.push(new PIXI.Texture(PIXI.loader.resources["sand_to_glass-sheet"].texture,
      new PIXI.Rectangle(64 * 5, 0, 64, 64)))

    new TweenLib.Tween({ index: 0 })
      .to({index: 70}, 8000)
      .repeat(Infinity)
      .onUpdate(function() {
        var idx = (this.index > 5) ? 0 : Math.round(this.index);
        buildingSprite.texture = sheet_textures[idx]
      })
      .start()
  }

  this.buildingType = buildingType

  this.buildingContainer.removeChildren()
  this.buildingContainer.addChild(buildingSprite)

  if (buildingType === BUILDING_DOME) {
    buildingSprite.x = -271
    buildingSprite.y = 43
  }
}

Tile.prototype.update = function () {
  this.iconsContainer.removeChildren()

  if (!this.buildingType) {
    return
  }

  var neededResources = buildingNeeds[this.buildingType]
  var neededResourcesCount = 0
  for (var i = 0; i < neededResources.length; i++) {
    var neededResource = neededResources[i]
    if (!baseProducedResources.includes(neededResource)) {
      var haha = neededResource.toLowerCase()
      var iconContainer = new PIXI.Container()

      var iconSprite = new PIXI.Sprite(PIXI.loader.resources[haha].texture)
      var resource_missing_overlay = new PIXI.Sprite(PIXI.loader.resources['resource_missing_overlay'].texture)
      resource_missing_overlay.x = -2
      resource_missing_overlay.y = -2
      iconContainer.addChild(iconSprite)
      iconContainer.addChild(resource_missing_overlay)

      iconContainer.x = (64 - 15) - neededResourcesCount * 15
      neededResourcesCount++

      this.iconsContainer.addChild(iconContainer)
    } else {
      baseUsedResources.push(neededResource)
    }
  }
}

var BuildingButton = function (buildingType, index) {
  this.buildingType = buildingType

  var buildingResourceName = resourceNames[buildingType]

  if (buildingType === BUILDING_DOME) {
    buildingResourceName = resourceNames.DOME_ICON
  }

  this.container = new PIXI.Container()

  var button = new PIXI.Sprite(PIXI.loader.resources['building_button'].texture)
  button.interactive = true
  button.on('click', function () {
    if (this.isActive === true) {
      selectedBuildingButton = this.buildingType

      if (selectedBuildingButton === BUILDING_DOME) {
        var domeTile = tiles.find(function (tile) {
          return tile.terrainType === TERRAIN_DOME
        })
        domeTile.terrainSprite.interactive = true
      }

      updateTileMarkers()
      setInformationBoxText(infoTexts[this.buildingType])
      updateBuildingButtons()
    } else {
      var buildingNeed = buildingNeeds[this.buildingType].filter(function (resource) {
        return resource !== RESOURCE_PEOPLE
      })
      var str = buildingNamesCapitalized[this.buildingType] + ' (LOCKED)\nTo unlock this building, make sure your base produces:\n'
      for (var i = 0; i < buildingNeed.length; i++) {
        if (i > 0) {
          str += ', '
        }
        str += buttonHumanTexts[buildingNeed[i]]
      }
      setInformationBoxText(str)
    }
  }.bind(this))
  this.container.addChild(button)

  this.buildingSelectedFrame = new PIXI.Sprite(PIXI.loader.resources['button_hover'].texture)
  this.buildingSelectedFrame.x = -2
  this.buildingSelectedFrame.y = -2
  this.buildingSelectedFrame.visible = false
  this.container.addChild(this.buildingSelectedFrame)

  var buildingSprite = new PIXI.Sprite(PIXI.loader.resources[buildingResourceName].texture)
  buildingSprite.width = 32
  buildingSprite.height = 32
  buildingSprite.x = 6
  buildingSprite.y = 6
  this.container.addChild(buildingSprite)

  this.buildingName = new PIXI.Text(buttonHumanTexts[buildingType], { fontSize: 12, fill: '#9e9e9e'})
  this.buildingName.x = 42
  this.buildingName.y = 7
  this.container.addChild(this.buildingName)

  if (this.buildingType === BUILDING_DOME) {
    this.producesName = new PIXI.Text('Terraforming', { fontSize: 10, fill: '#9e9e9e'})
    this.producesName.x = 42
    this.producesName.y = 26
    this.container.addChild(this.producesName)
  } else {
    var producingIconResourceName = resourceNames[buildingProvides[buildingType]];

    var buildingProvidesSprite = new PIXI.Sprite(PIXI.loader.resources[producingIconResourceName].texture)
    buildingProvidesSprite.width = 16
    buildingProvidesSprite.height = 16
    buildingProvidesSprite.x = 42
    buildingProvidesSprite.y = 24
    this.container.addChild(buildingProvidesSprite)

    this.producesName = new PIXI.Text(buttonHumanTexts[buildingProvides[buildingType]], { fontSize: 10, fill: '#9e9e9e'})
    this.producesName.x = 62
    this.producesName.y = 26
    this.container.addChild(this.producesName)
  }

  this.container.y = index * 47
}

BuildingButton.prototype.setSelected = function(mode) {
  this.buildingSelectedFrame.visible = !!mode
}

BuildingButton.prototype.setActive = function (activeness) {
  if (activeness === false) {
    this.container.alpha = 0.6
    this.buildingName.style.fill = '#383838'
    this.producesName.style.fill = '#383838'
  } else {
    this.container.alpha = 1
    this.buildingName.style.fill = '#9e9e9e'
    this.producesName.style.fill = '#9e9e9e'
  }

  this.isActive = !!activeness
  //this.isActive = true
}

var gameScene = {
  name: 'gameScene',
  create: function (sceneParams) {
    this.tweens = []
    this.totalTime = 0;

    score = {}

    this.container = new PIXI.Container()

    var skipInto = false

    this.welcometextContainer = new PIXI.Container()
    var region = (Math.random() < 0.5) ? 'PO' : 'KG';
    var welcomeText = new PIXI.Text('Welcome to asteroid\n' + region + '-56-AX-' + Math.round(Math.random() * 10032), {
      fontSize: 48,
      fill: '#ffffff',
      align: 'center',
    })
    welcomeText.x = 190
    welcomeText.y = 230

    new TweenLib.Tween({ alpha: 1 })
      .to({alpha: 0}, (skipInto) ? 1 : 600)
      .delay((skipInto) ? 1 : 1600)
      .easing(TweenLib.Easing.Quartic.Out)
      .onUpdate(function() {
        welcomeText.alpha = this.alpha;
      })
      .start()
    this.welcometextContainer.addChild(welcomeText)

    var backgroundImage = new PIXI.Sprite(PIXI.loader.resources['background'].texture)
    backgroundImage.interactive = true
    backgroundImage.on('click', function () {
      selectedBuildingButton = null
      updateTileMarkers()
      setInformationBoxText('')
      updateBuildingButtons()
    })
    this.container.addChild(backgroundImage)

    var gameContainer = new PIXI.Container()
    this.gameContainer = gameContainer;
    this.gameContainer.x = 182
    this.gameContainer.y = -500

    new TweenLib.Tween({ y: -500 })
      .to({y: 132}, (skipInto) ? 1 : 3300)
      .delay((skipInto) ? 1 : 1200)
      .easing(TweenLib.Easing.Quartic.Out)
      .onUpdate(function(y) {
        gameContainer.y = this.y;
      })
      .onComplete(function () {
        terraformButton.visible = true
      })
      .start()

    this.tileContainer = new PIXI.Container()

    this.asteroidSprite = new PIXI.Sprite(PIXI.loader.resources['astroid'].texture)
    this.asteroidSprite.x = 128 - 182
    this.asteroidSprite.y = 104 - 132

    this.gameContainer.addChild(this.asteroidSprite)
    this.gameContainer.addChild(this.tileContainer)

    var buildingPanelContainer = new PIXI.Container()
    this.buildingPanelContainer = buildingPanelContainer;
    this.buildingPanelContainer.x = 656
    this.buildingPanelContainer.y = 38 - 700

    new TweenLib.Tween({ y: 38 - 700 })
      .to({y: 38}, (skipInto) ? 1 : 300)
      .delay((skipInto) ? 1 : 3000)
      .easing(TweenLib.Easing.Quartic.Out)
      .onUpdate(function() {
        buildingPanelContainer.y = this.y;
      })
      .start()

    var resourcePanelContainer = new PIXI.Container()
    this.resourcePanelContainer = resourcePanelContainer;
    var baseResourcesPanelBackground = new PIXI.Sprite(PIXI.loader.resources['base_resources_panel'].texture)
    this.resourcePanelContainer.x = 10
    this.resourcePanelContainer.y = 60 - 700

    var resourcePanelTitle = new PIXI.Text('Resources', {
      fontSize: 12,
    })

    resourcePanelTitle.x = 10
    resourcePanelTitle.y = 4

    var tween_resource_panel = new TweenLib.Tween({ y: 60 - 700 })
      .to({y: 60}, (skipInto) ? 1 : 300)
      .delay((skipInto) ? 1 : 3000)
      .easing(TweenLib.Easing.Quartic.Out)
      .onUpdate(function() {
        resourcePanelContainer.y = this.y;
      })
      .start()

    this.resourcePanelContainer.addChild(baseResourcesPanelBackground)
    this.resourcePanelContainer.addChild(resourcePanelTitle)

    this.informationBoxContainer = new PIXI.Container()
    this.informationBoxText = new PIXI.Text('', {
      fontSize: 16,
      fill: '#ffffff',
      wordWrap: true,
      wordWrapWidth: 474,
    })
    this.informationBoxText.y = 4
    this.informationBoxText.x = 4
    this.informationBoxContainer.addChild(this.informationBoxText)
    this.informationBoxContainer.x = 128
    this.informationBoxContainer.y = 104 + 364

    var terraformButton = new PIXI.Sprite(PIXI.loader.resources['colonize_button'].texture)
    terraformButton.x = 5
    terraformButton.y = 5
    terraformButton.interactive = true
    terraformButton.visible = false
    terraformButton.on('click', function () {
      terraformButton.visible = false
      this.transitionToResultScreen()
    }.bind(this))

    global.baseStage.addChild(this.container)
    this.container.addChild(this.welcometextContainer)
    this.container.addChild(this.gameContainer)
    this.container.addChild(this.buildingPanelContainer)
    this.container.addChild(this.resourcePanelContainer)
    this.container.addChild(this.informationBoxContainer)
    this.container.addChild(terraformButton)

    var map = [
      TERRAIN_PLAIN, TERRAIN_SAND, TERRAIN_PLAIN, TERRAIN_PLAIN, TERRAIN_PLAIN, TERRAIN_SAND,
      TERRAIN_PLAIN, TERRAIN_PLAIN,TERRAIN_PLAIN, TERRAIN_PLAIN, TERRAIN_PLAIN, TERRAIN_PLAIN,
      TERRAIN_PLAIN, BUILDING_HQ  ,TERRAIN_PLAIN, TERRAIN_ORE,   TERRAIN_PLAIN, TERRAIN_ORE,
      TERRAIN_PLAIN, TERRAIN_PLAIN,TERRAIN_ICE,   TERRAIN_PLAIN, TERRAIN_ICE,   TERRAIN_PLAIN,
    ]

    tiles = []
    for (var r = 0; r < rowCount; r++) {
      for (var c = 0; c < colCount; c++) {
        var terrainType = map.shift()
        var tile = new Tile(c, r, terrainType)
        tiles.push(tile)
        this.tileContainer.addChild(tile.container)
      }
    }

    var tile = new Tile(-10, -10, TERRAIN_DOME)
    tile.changeTileScreenPosition(200, -100)
    tiles.push(tile)
    this.tileContainer.addChild(tile.container)

    var yOffset = 20
    for (var resourceTextName in resourceTexts) {
      var textObject = new PIXI.Text('', { fontSize: 16, })
      var iconSprite = new PIXI.Sprite(PIXI.loader.resources[resourceTextName.toLowerCase()].texture)
      var container = new PIXI.Container()
      container.addChild(iconSprite)
      container.addChild(textObject)

      iconSprite.x = 4
      iconSprite.y = 2
      textObject.x = 20

      container.y = yOffset
      yOffset += 20

      container.interactive = true
      var closure = function (key) { // </3
        container.on('click', function (event) {
          var str = buttonHumanTexts[key] +
              '\n\nProducing: ' + getResourceProduced(key) +
              '\nConsuming: ' + getResourceConsumed(key)

          setInformationBoxText(str)
        })
      }
      closure(resourceTextName)

      this.resourcePanelContainer.addChild(container)

      resourceTexts[resourceTextName] = textObject
    }

    buildingButtons = {}

    for (var i = 0; i < buildingButtonTypes.length; i++) {
      var buildingType = buildingButtonTypes[i]
      var buildingButton = new BuildingButton(buildingType, i)
      buildingButtons[buildingType] = buildingButton
      this.buildingPanelContainer.addChild(buildingButton.container)
    }

    updateGame()

    selectedBuildingButton = null
    setInformationBoxText('')
    updateBuildingButtons()
  },
  transitionToResultScreen: function() {
    var _gameContainer = this.gameContainer
    new TweenLib.Tween({ y: 132 })
      .to({y: 0}, 700)
      .easing(TweenLib.Easing.Quartic.InOut)
      .onUpdate(function() {
        _gameContainer.y = this.y;
      })
      .onComplete(function () {
        deselectBuildingButton()
        countScore()
      })
      .start()

    var _buildingPanelContainer = this.buildingPanelContainer
    new TweenLib.Tween({ x: 656 })
      .to({x: 900}, 400)
      .easing(TweenLib.Easing.Quartic.In)
      .onUpdate(function() {
        _buildingPanelContainer.x = this.x;
      })
      .start()

    var _resourcePanelContainer = this.resourcePanelContainer
    new TweenLib.Tween({ x: 20 })
      .to({x: -300}, 400)
      .easing(TweenLib.Easing.Quartic.In)
      .onUpdate(function() {
        _resourcePanelContainer.x = this.x;
      })
      .start()
  },
  showResultScreen: function(result) {

    if (findBuildingByType(BUILDING_DOME)) {
      terraform()
    }

    this.resultContainer = new PIXI.Container()
    this.resultContainer.x = 9
    this.resultContainer.y = 291
    this.container.addChild(this.resultContainer)

    var end_panel = new PIXI.Sprite(PIXI.loader.resources['end_screen_panel'].texture)
    end_panel.on('click', function () {
      this.changeScene('gameScene') // start over
    }.bind(this))
    end_panel.interactive = true
    this.resultContainer.addChild(end_panel)

    var resourcesColumn1 = [
      RESOURCE_PEOPLE,
      RESOURCE_HEAT,
      RESOURCE_WATER,
      RESOURCE_DOME,
    ]
    var resourcesColumn2 = [
      RESOURCE_METAL,
      RESOURCE_GLASS,
      RESOURCE_SAND,
    ]

    var generateColumn = function (columnData, x) {
      var yOffset = -6

      for (var i = 0; i < columnData.length; i++) {
        var resource = columnData[i]
        var resourceText = resourceScoreFactors[resource] + ' x ' + getResourceProduced(resource)
        var textObject = new PIXI.Text(resourceText, { fontSize: 16 })
        var iconSprite = new PIXI.Sprite(PIXI.loader.resources[resource.toLowerCase()].texture)
        var container = new PIXI.Container()
        container.addChild(iconSprite)
        container.addChild(textObject)

        iconSprite.x = 0
        iconSprite.y = 2
        textObject.x = 20

        container.x = x
        container.y = 100 + yOffset
        yOffset += 20

        this.resultContainer.addChild(container)
      }
    }.bind(this)

    generateColumn(resourcesColumn1, 110)
    generateColumn(resourcesColumn2, 210)

    var resourcePointsSum = new PIXI.Text('total: ' + score.baseTotal, { fontSize: 16 })
    resourcePointsSum.x = 210
    resourcePointsSum.y = 158
    this.resultContainer.addChild(resourcePointsSum)

    var flare_x = 340
    var flare_y = 83

    var flareFontSize = 12
    var flareOffsetYSingleLine = 20
    var flareOffsetYDoubleLine = 34

    var foundPositive = false
    var foundNegative = false

    //Positive flares
    result.flares.forEach(function(flare) {
      if (flare === FLARE_DOME_BUILT) {
        foundPositive = true
        var container = new PIXI.Container()
        var flare_super = new PIXI.Sprite(PIXI.loader.resources["flare_super"].texture)
        flare_super.y = 2
        var textObject = new PIXI.Text("The Dome is built and is sustaining an ecosystem", { fontSize: flareFontSize })
        textObject.x = 44
        container.addChild(flare_super)
        container.addChild(textObject)

        container.x = flare_x
        container.y = flare_y

        this.resultContainer.addChild(container)

        flare_y += flareOffsetYSingleLine
      }

      if (flare === FLARE_TREES_NEXT_TO_LQ) {
        foundPositive = true
        var container = new PIXI.Container()
        var flare_super = new PIXI.Sprite(PIXI.loader.resources["flare_super"].texture)
        flare_super.y = 2
        var textObject = new PIXI.Text("Living Quarters have immediate access to a lush forest", { fontSize: flareFontSize })
        textObject.x = 44
        container.addChild(flare_super)
        container.addChild(textObject)

        container.x = flare_x
        container.y = flare_y

        this.resultContainer.addChild(container)

        flare_y += flareOffsetYSingleLine
      }

      if (flare === FLARE_ALL_WATER_IN_WATER_CHAIN) {
        foundPositive = true
        var container = new PIXI.Container()
        var flare_super = new PIXI.Sprite(PIXI.loader.resources["flare_super"].texture)
        flare_super.y = 2
        var textObject = new PIXI.Text("Water system is perfectly tuned", { fontSize: flareFontSize })
        textObject.x = 44
        container.addChild(flare_super)
        container.addChild(textObject)

        container.x = flare_x
        container.y = flare_y

        this.resultContainer.addChild(container)

        flare_y += flareOffsetYSingleLine
      }
    }.bind(this))

    //Negative flares
    result.flares.forEach(function(flare) {
      if (flare === FLARE_TOO_BIG_LQ_CLUSTER) {
        foundNegative = true
        var container = new PIXI.Container()
        var flare_disaster = new PIXI.Sprite(PIXI.loader.resources["flare_disaster"].texture)
        flare_disaster.y = 2
        var textObject = new PIXI.Text("More than two adjacent Living Quarters causes diseases\nto spread like the plague", { fontSize: flareFontSize })
        textObject.x = 44
        container.addChild(flare_disaster)
        container.addChild(textObject)

        container.x = flare_x
        container.y = flare_y

        this.resultContainer.addChild(container)

        flare_y += flareOffsetYDoubleLine
      }
      if (flare === FLARE_ICE_AND_DOME) {
        foundNegative = true
        var container = new PIXI.Container()
        var flare_disaster = new PIXI.Sprite(PIXI.loader.resources["flare_disaster"].texture)
        flare_disaster.y = 2
        var textObject = new PIXI.Text("Unharvested ice inside dome, it melts and make the water levels\nin the dome uncontrollable", { fontSize: flareFontSize })
        textObject.x = 44
        container.addChild(flare_disaster)
        container.addChild(textObject)

        container.x = flare_x
        container.y = flare_y

        this.resultContainer.addChild(container)

        flare_y += flareOffsetYDoubleLine
      }
      if (flare === FLARE_METAL_WORKS_NEXT_TO_TREES) {
        foundNegative = true
        var container = new PIXI.Container()
        var flare_disaster = new PIXI.Sprite(PIXI.loader.resources["flare_disaster"].texture)
        flare_disaster.y = 2
        var textObject = new PIXI.Text("Metal Works next to forests is a huge fire hazard", { fontSize: flareFontSize })
        textObject.x = 44
        container.addChild(flare_disaster)
        container.addChild(textObject)

        container.x = flare_x
        container.y = flare_y

        this.resultContainer.addChild(container)

        flare_y += flareOffsetYSingleLine
      }
      if (flare === FLARE_OVERWORKED_POPULATION) {
        foundNegative = true
        var container = new PIXI.Container()
        var flare_disaster = new PIXI.Sprite(PIXI.loader.resources["flare_disaster"].texture)
        flare_disaster.y = 2
        var textObject = new PIXI.Text("The Space Worker Union shuts you down because\nyour population is overworked", { fontSize: flareFontSize })
        textObject.x = 44
        container.addChild(flare_disaster)
        container.addChild(textObject)

        container.x = flare_x
        container.y = flare_y

        this.resultContainer.addChild(container)

        flare_y += flareOffsetYDoubleLine
      }

      if (flare === FLARE_DOME_NOT_MAINTAINED) {
        foundNegative = true
        var container = new PIXI.Container()
        var flare_disaster = new PIXI.Sprite(PIXI.loader.resources["flare_disaster"].texture)
        flare_disaster.y = 2
        var textObject = new PIXI.Text("The resource chain for maintaining the dome is broken,\ncracks and rust weakens the dome until the inevitable collapse", { fontSize: flareFontSize })
        textObject.x = 44
        container.addChild(flare_disaster)
        container.addChild(textObject)

        container.x = flare_x
        container.y = flare_y

        this.resultContainer.addChild(container)

        flare_y += flareOffsetYDoubleLine
      }
    }.bind(this))

    if (!foundPositive) {
      var textObject = new PIXI.Text("No bonuses - try to combine the placement\nof buildings and make sure to construct the dome", { fontSize: flareFontSize })
      textObject.x = flare_x
      textObject.y = flare_y
      this.resultContainer.addChild(textObject)
    }

    if (!foundNegative) {
      var textObject = new PIXI.Text("No penalties - good job!", { fontSize: 12 })
      textObject.x = flare_x
      textObject.y = flare_y + flareOffsetYDoubleLine
      this.resultContainer.addChild(textObject)
    }


    var titleText = new PIXI.Text('Colony results', { fontSize: 40, fill: '#000000'})
    titleText.x = 252
    titleText.y = 5
    this.resultContainer.addChild(titleText)

    var resourceTitle = new PIXI.Text('Resource tally', { fontSize: 20, fill: '#000000'})
    resourceTitle.x = 118
    resourceTitle.y = 57
    this.resultContainer.addChild(resourceTitle)

    var bonusTitle = new PIXI.Text('Bonuses and Penalties', { fontSize: 20, fill: '#000000'})
    bonusTitle.x = flare_x
    bonusTitle.y = 57
    this.resultContainer.addChild(bonusTitle)

    var colonyLifetimeShadowTitle = new PIXI.Text('Colony lifetime', { fontSize: 20, fill: '#000000'})
    colonyLifetimeShadowTitle.x = 130
    colonyLifetimeShadowTitle.y = 195
    this.resultContainer.addChild(colonyLifetimeShadowTitle)

    var colonyLifetimeTitle = new PIXI.Text('Colony lifetime', { fontSize: 20, fill: '#ffffff'})
    colonyLifetimeTitle.x = 128
    colonyLifetimeTitle.y = 193
    this.resultContainer.addChild(colonyLifetimeTitle)

    var lifetime = new PIXI.Text('', { fontSize: 50, fill: '#ffffff',
      dropShadow: true,
      dropShadowBlur: 0,
      dropShadowColor: '#000000',
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 3,
    })
    lifetime.x = 92
    lifetime.y = 216
    this.resultContainer.addChild(lifetime)

    new TweenLib.Tween({ total: 0 })
      .to({ total: result.total }, 1500)
      .easing(TweenLib.Easing.Quartic.Out)
      .onUpdate(function() {
        lifetime.text = Math.round(this.total) + ' years'
      })
      .start()

  },
  destroy: function () {
    this.container.destroy()
  },
  update: function (delta) {
    TweenLib.update()
  },
  draw: function () {
    global.renderer.render(this.container)
  },
}

module.exports = gameScene
