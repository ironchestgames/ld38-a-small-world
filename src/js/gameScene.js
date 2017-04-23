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

var infoTexts = {}
infoTexts[BUILDING_HEAT_GENERATOR] = 'Heat Generator\nProvides heat'
infoTexts[BUILDING_MINING] = 'Ore Mine\nProvides ore from ore tiles'
infoTexts[BUILDING_QUARRY] = 'Quarry\nProvides sand from sand tiles'
infoTexts[BUILDING_HQ] = 'Base HQ\nProvides a starting population\nCan not be removed'
infoTexts[BUILDING_ICE_COLLECTOR] = 'Ice Collector\nProvides ice from ice tiles'
infoTexts[BUILDING_LIVING_QUARTERS] = 'Living Quarters\nProvides 4 people'

//Resource converters
infoTexts[BUILDING_METAL_AND_GLASS_TO_DOME] = 'Dome Maintenance Facility\nUses metal and glass to construct and maintain the dome'
infoTexts[BUILDING_ICE_AND_HEAT_TO_WATER] = 'Water Plant\nUses ice and heat to provide and control water levels on the asteroid'
infoTexts[BUILDING_ORE_TO_METAL] = 'Metal Works\nUses ore to provide metal'
infoTexts[BUILDING_SAND_TO_GLASS] = 'Glass Works\nUses sand to provide glass'
infoTexts[BUILDING_DOME] = 'Dome\nHolds atmosphere'

infoTexts[TERRAIN_PLAIN] = '(No resource)'
infoTexts[TERRAIN_SAND] = 'Sand'
infoTexts[TERRAIN_ICE] = 'Ice'
infoTexts[TERRAIN_ORE] = 'Ore'
infoTexts[TERRAIN_DOME] = '(Dome placement)'

var score = {}

var resourceScoreFactors = {}
resourceScoreFactors[RESOURCE_HEAT] = 4
resourceScoreFactors[RESOURCE_PEOPLE] = 5
resourceScoreFactors[RESOURCE_SAND] = 2
resourceScoreFactors[RESOURCE_GLASS] = 1
resourceScoreFactors[RESOURCE_METAL] = 3
resourceScoreFactors[RESOURCE_WATER] = 10

var SCORE_CONSTANT_DOME = 50
var SCORE_FACTOR_TOO_BIG_LQ_CLUSTER = 0.5
var SCORE_FACTOR_UNBUILT_TERRAIN = 12

var FLARE_DOME_BUILT = 'FLARE_DOME_BUILT'
var FLARE_TOO_BIG_LQ_CLUSTER = 'FLARE_TOO_BIG_LQ_CLUSTER'

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
resourceNames[BUILDING_DOME] = 'sand_to_glass'

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
      textObject.style.fill = '#00ff00'
    } else if (produced - consumed < 0) {
      textObject.style.fill = '#ff0000'
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
  
  var tile = getInsideGrid(tile.x + 1, tile.y)
  if (tile) {
    surroundingTiles.push(tile)
  }

  tile = getInsideGrid(tile.x, tile.y + 1)
  if (tile) {
    surroundingTiles.push(tile)
  }

  tile = getInsideGrid(tile.x - 1, tile.y)
  if (tile) {
    surroundingTiles.push(tile)
  }

  tile = getInsideGrid(tile.x, tile.y - 1)
  if (tile) {
    surroundingTiles.push(tile)
  }
  
  return surroundingTiles
}

var terraform = function () {

  score.extra = 0
  score.totalFactors = []
  score.flares = []

  score[RESOURCE_PEOPLE] = getResourceTallyHo(RESOURCE_PEOPLE)
  score[RESOURCE_HEAT] = getResourceTallyHo(RESOURCE_HEAT)
  score[RESOURCE_SAND] = getResourceTallyHo(RESOURCE_SAND)
  score[RESOURCE_WATER] = getResourceTallyHo(RESOURCE_WATER)
  score[RESOURCE_METAL] = getResourceTallyHo(RESOURCE_METAL)
  score[RESOURCE_GLASS] = getResourceTallyHo(RESOURCE_GLASS)

  if (findBuildingByType(BUILDING_DOME)) {
    score.extra += SCORE_CONSTANT_DOME
    score.flares.push(FLARE_DOME_BUILT)

    var unbuiltTerrainCount = 0
    for (var i = 0; i < tiles.length; i++) {
      var tile = tiles[i]
      if (!tile.buildingType) {
        unbuiltTerrainCount++
      }
    }

    score.extra += unbuiltTerrainCount * SCORE_FACTOR_UNBUILT_TERRAIN
  }

  breakhere: for (var i = 0; i < tiles.length; i++) {
    var tile = tiles[i]
    if (tile.buildingType === BUILDING_LIVING_QUARTERS) {
      var surroundingTiles = getSurroundingTiles(tile)
      var surroundingLivingQuarters = surroundingTiles.filter(function (_tile) {
        return _tile.buildingType === BUILDING_LIVING_QUARTERS
      })
      if (surroundingLivingQuarters.length > 1) {
        score.totalFactors.push(SCORE_FACTOR_TOO_BIG_LQ_CLUSTER)
        score.flares.push(FLARE_TOO_BIG_LQ_CLUSTER)
        break breakhere
      }
    }
  }

  score.total =
      score[RESOURCE_PEOPLE] +
      score[RESOURCE_GLASS] +
      score[RESOURCE_HEAT] +
      score[RESOURCE_WATER] +
      score[RESOURCE_SAND] +
      score[RESOURCE_METAL] +
      score.extra

  for (var i = 0; i < score.totalFactors.length; i++) {
    score.total *= score.totalFactors[i]
  }

  score.total = Math.ceil(score.total)

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

  this.terrainSprite.interactive = true
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
        str = infoTexts[this.buildingType] + ', ' + str
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

Tile.prototype.changeBuilding = function (buildingType) {
  var resourceName = resourceNames[buildingType]

  var buildingSprite = new PIXI.Sprite(PIXI.loader.resources[resourceName].texture)

  this.buildingType = buildingType

  this.buildingContainer.removeChildren()
  this.buildingContainer.addChild(buildingSprite)
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

  this.container = new PIXI.Container()

  var button = new PIXI.Sprite(PIXI.loader.resources['building_button'].texture)
  button.interactive = true
  button.on('click', function () {
    if (this.isActive === true) {
      selectedBuildingButton = this.buildingType

      updateTileMarkers()
      setInformationBoxText(infoTexts[this.buildingType])
    } else {
      setInformationBoxText('This building is locked')
    }
  }.bind(this))
  this.container.addChild(button)

  var buildingSprite = new PIXI.Sprite(PIXI.loader.resources[buildingResourceName].texture)
  buildingSprite.width = 32
  buildingSprite.height = 32
  buildingSprite.x = 6
  buildingSprite.y = 6
  this.container.addChild(buildingSprite)

  if (this.buildingType !== BUILDING_DOME) {
    var producingIconResourceName = resourceNames[buildingProvides[buildingType]];

    var buildingProvidesSprite = new PIXI.Sprite(PIXI.loader.resources[producingIconResourceName].texture)
    buildingProvidesSprite.width = 16
    buildingProvidesSprite.height = 16
    buildingProvidesSprite.x = 100
    buildingProvidesSprite.y = 26
    this.container.addChild(buildingProvidesSprite)
  }

  this.container.y = index * 47
}

BuildingButton.prototype.setActive = function (activeness) {
  if (activeness === false) {
    this.container.alpha = 0.5
  } else {
     this.container.alpha = 1
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

    this.welcometextContainer = new PIXI.Container()
    var region = (Math.random() < 0.5) ? 'PO' : 'KG';
    var welcomeText = new PIXI.Text('Welcome to asteroid ' + region + '-56-AX-' + Math.round(Math.random() * 10032), { fontSize: 16, fill: '#ffffff'})
    welcomeText.x = 270
    welcomeText.y = 270

    new TweenLib.Tween({ alpha: 1 })
      .to({alpha: 0}, 600) //600
      .delay(1) //400
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
    })
    this.container.addChild(backgroundImage)

    var gameContainer = new PIXI.Container()
    this.gameContainer = gameContainer;
    this.gameContainer.x = 182
    this.gameContainer.y = -500

    new TweenLib.Tween({ y: -500 })
      .to({y: 132}, 1) //3300
      .easing(TweenLib.Easing.Quartic.Out)
      .onUpdate(function(y) {
        gameContainer.y = this.y;
      })
      .start()

    this.tileContainer = new PIXI.Container()

    var asteroidSprite = new PIXI.Sprite(PIXI.loader.resources['astroid'].texture)
    asteroidSprite.x = 128 - 182
    asteroidSprite.y = 104 - 132

    this.gameContainer.addChild(asteroidSprite)
    this.gameContainer.addChild(this.tileContainer)

    var buildingPanelContainer = new PIXI.Container()
    this.buildingPanelContainer = buildingPanelContainer;
    this.buildingPanelContainer.x = 656
    this.buildingPanelContainer.y = 38 - 700

    new TweenLib.Tween({ y: 38 - 700 })
      .to({y: 38}, 1) //300
      .delay(1) //3000
      .easing(TweenLib.Easing.Quartic.Out)
      .onUpdate(function() {
        buildingPanelContainer.y = this.y;
      })
      .start()

    var resourcePanelContainer = new PIXI.Container()
    this.resourcePanelContainer = resourcePanelContainer;
    var baseResourcesPanelBackground = new PIXI.Sprite(PIXI.loader.resources['base_resources_panel'].texture)
    this.resourcePanelContainer.x = 20
    this.resourcePanelContainer.y = 60 - 700

    var tween_resource_panel = new TweenLib.Tween({ y: 60 - 700 })
      .to({y: 60}, 1) //300
      .delay(1) //3000
      .easing(TweenLib.Easing.Quartic.Out)
      .onUpdate(function() {
        resourcePanelContainer.y = this.y;
      })
      .start()
    this.resourcePanelContainer.addChild(baseResourcesPanelBackground)

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

    var terraformButton = new PIXI.Sprite(PIXI.loader.resources['terraform_button'].texture)
    terraformButton.interactive = true
    terraformButton.on('click', function () {
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
      TERRAIN_PLAIN, TERRAIN_PLAIN,TERRAIN_ICE,   TERRAIN_PLAIN, TERRAIN_ICE,   TERRAIN_DOME,
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

    var yOffset = 5
    for (var resourceTextName in resourceTexts) {
      var textObject = new PIXI.Text('', { fontSize: 16, })
      var iconSprite = new PIXI.Sprite(PIXI.loader.resources[resourceTextName.toLowerCase()].texture)
      var container = new PIXI.Container()
      container.addChild(iconSprite)
      container.addChild(textObject)

      iconSprite.x = 6
      iconSprite.y = 2
      textObject.x = 22

      container.y = yOffset
      yOffset += 20

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
  },
  transitionToResultScreen: function() {
    var _gameContainer = this.gameContainer
    new TweenLib.Tween({ y: 182 })
      .to({y: 0}, 700)
      .easing(TweenLib.Easing.Quartic.InOut)
      .onUpdate(function() {
        _gameContainer.y = this.y;
      })
      .onComplete(terraform)
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
      RESOURCE_WATER,
      RESOURCE_METAL
    ]
    var resourcesColumn2 = [
      RESOURCE_GLASS,
      RESOURCE_SAND,
      RESOURCE_HEAT
    ]

    var generateColumn = function (columnData, x) {
      var yOffset = 0

      for (var i = 0; i < columnData.length; i++) {
        var resource = columnData[i]
        var resourceText = (result[resource] === 0) ? "-" : result[resource];
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

    generateColumn(resourcesColumn1, 120)
    generateColumn(resourcesColumn2, 210)

    var flare_x = 340
    var flare_y = 90

    //Positive flares
    result.flares.forEach(function(flare) {
      if (flare === FLARE_DOME_BUILT) {
        var container = new PIXI.Container()
        var flare_super = new PIXI.Sprite(PIXI.loader.resources["flare_super"].texture)
        flare_super.y = 2
        var textObject = new PIXI.Text("Dome built, yay", { fontSize: 16 })
        textObject.x = 44
        container.addChild(flare_super)
        container.addChild(textObject)

        container.x = flare_x
        container.y = flare_y

        this.resultContainer.addChild(container)

        flare_y += 26
      }
    }.bind(this))

    flare_y = 205
    //Negative flares
    result.flares.forEach(function(flare) {
      if (flare === FLARE_TOO_BIG_LQ_CLUSTER) {
        var container = new PIXI.Container()
        var flare_disaster = new PIXI.Sprite(PIXI.loader.resources["flare_disaster"].texture)
        flare_disaster.y = 2
        var textObject = new PIXI.Text("LQ disaster", { fontSize: 16 })
        textObject.x = 44
        container.addChild(flare_disaster)
        container.addChild(textObject)

        container.x = flare_x
        container.y = flare_y

        this.resultContainer.addChild(container)

        flare_y += 26
      }
    }.bind(this))

    var titleText = new PIXI.Text('Colony results', { fontSize: 40, fill: '#000000'})
    titleText.x = 252
    titleText.y = 5
    this.resultContainer.addChild(titleText)

    var resourceTitle = new PIXI.Text('Resource tally', { fontSize: 20, fill: '#000000'})
    resourceTitle.x = 118
    resourceTitle.y = 57
    this.resultContainer.addChild(resourceTitle)

    var bonusTitle = new PIXI.Text('Bonuses', { fontSize: 20, fill: '#000000'})
    bonusTitle.x = 337
    bonusTitle.y = 66
    this.resultContainer.addChild(bonusTitle)

    var penaltyTitle = new PIXI.Text('Penalties', { fontSize: 20, fill: '#000000'})
    penaltyTitle.x = 337
    penaltyTitle.y = 179
    this.resultContainer.addChild(penaltyTitle)

    var colonyLifetimeShadowTitle = new PIXI.Text('Colony lifetime', { fontSize: 20, fill: '#000000'})
    colonyLifetimeShadowTitle.x = 130
    colonyLifetimeShadowTitle.y = 195
    this.resultContainer.addChild(colonyLifetimeShadowTitle)

    var colonyLifetimeTitle = new PIXI.Text('Colony lifetime', { fontSize: 20, fill: '#ffffff'})
    colonyLifetimeTitle.x = 128
    colonyLifetimeTitle.y = 193
    this.resultContainer.addChild(colonyLifetimeTitle)

    var lifetimeShadow = new PIXI.Text('456 years', { fontSize: 50, fill: '#000000'})
    lifetimeShadow.x = 94
    lifetimeShadow.y = 218
    this.resultContainer.addChild(lifetimeShadow)

    var lifetime = new PIXI.Text('456 years', { fontSize: 50, fill: '#ffffff'})
    lifetime.x = 92
    lifetime.y = 216
    this.resultContainer.addChild(lifetime)



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
