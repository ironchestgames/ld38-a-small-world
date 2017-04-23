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

infoTexts[TERRAIN_PLAIN] = '(No resource)'
infoTexts[TERRAIN_SAND] = 'Sand'
infoTexts[TERRAIN_ICE] = 'Ice'
infoTexts[TERRAIN_ORE] = 'Ore'


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
resourceNames[BUILDING_METAL_AND_GLASS_TO_DOME] = 'alloy_and_glass_to_dome'
resourceNames[BUILDING_ICE_AND_HEAT_TO_WATER] = 'ice_and_heat_to_water'
resourceNames[BUILDING_ORE_TO_METAL] = 'ore_to_metal'
resourceNames[BUILDING_SAND_TO_GLASS] = 'sand_to_glass'

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
  BUILDING_HEAT_GENERATOR,
  BUILDING_MINING,
  BUILDING_QUARRY,
  // BUILDING_HQ,
  BUILDING_ICE_COLLECTOR,
  BUILDING_LIVING_QUARTERS,

  //Resource converters
  BUILDING_METAL_AND_GLASS_TO_DOME,
  BUILDING_ICE_AND_HEAT_TO_WATER,
  BUILDING_ORE_TO_METAL,
  BUILDING_SAND_TO_GLASS,
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

var isInsideGrid = function (x, y) {
  return y >= 0 && y < rowCount && x >= 0 && x < colCount
}

var produceResource = function (resource) {
  for (var r = 0; r < rowCount; r++) {
    for (var c = 0; c < colCount; c++) {
      var tile = tiles[r][c]

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

  for (var r = 0; r < rowCount; r++) {
    for (var c = 0; c < colCount; c++) {
      tiles[r][c].update()
    }
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
  for (var r = 0; r < rowCount; r++) {
    for (var c = 0; c < colCount; c++) {
      var tile = tiles[r][c]
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
  for (var r = 0; r < rowCount; r++) {
    for (var c = 0; c < colCount; c++) {
      var tile = tiles[r][c]
      if (tile.buildingType === buildingType) {
        return tile
      }
    }
  }
  return null
}

var terraform = function () {
  var unbuiltTerrainCount = 0
  for (var r = 0; r < rowCount; r++) {
    for (var c = 0; c < colCount; c++) {
      var tile = tiles[r][c]
      if (!tile.buildingType) {
        unbuiltTerrainCount++
      }
    }
  }
  var total = (getResourceProduced(RESOURCE_PEOPLE) - getResourceConsumed(RESOURCE_PEOPLE)) +
      (getResourceProduced(RESOURCE_METAL) - getResourceConsumed(RESOURCE_METAL)) +
      unbuiltTerrainCount


  var tile = findBuildingByType(BUILDING_METAL_AND_GLASS_TO_DOME)
  if (!(tile && isTileProducingResource(tile, RESOURCE_DOME))) {
    setGameOverText('NO DOME\nLIVING QUARTERS SUPPLIES HELD FOR 3 MONTHS')
    return
  }

  var tile = findBuildingByType(BUILDING_ICE_AND_HEAT_TO_WATER)
  if (!(tile && isTileProducingResource(tile, RESOURCE_WATER))) {
    setGameOverText('NO WATER PLANT\nLIVING QUARTERS SUPPLIES HELD FOR 3 MONTHS')
    return
  }

  var unbuiltIceTerrainCount = 0
  for (var r = 0; r < rowCount; r++) {
    for (var c = 0; c < colCount; c++) {
      var tile = tiles[r][c]
      if (tile.terrainType === TERRAIN_ICE && tile.buildingType !== BUILDING_ICE_COLLECTOR) {
        unbuiltIceTerrainCount++
      }
    }
  }
  if (unbuiltIceTerrainCount > 0) {
    setGameOverText('TOO MUCH ICE LEFT\nIT MELTED AND NOW EVERYTHING HAS ALGAE AND MOLD, NO TREES')
    return
  }

  var peopleSaldo = getResourceProduced(RESOURCE_PEOPLE) - getResourceConsumed(RESOURCE_PEOPLE)
  if (peopleSaldo < 0) {
    total = Math.ceil(total * 0.5)
    setGameOverText('SPACE UNION SHUTS YOU DOWN\n' + total + ' YEARS')
    return
  }

  total += 1
  setGameOverText('THE COLONY LASTED ' + total + ' YEARS') // TODO: A MERE/THANKS TO YOU
}

var setInformationBoxText = function (text) {
  gameScene.informationBoxText.text = text
}

var setGameOverText = function (text) {
  gameScene.gameOverContainer.visible = true
  gameScene.gameOverContainer.interactive = true
  gameScene.gameOverText.text = text
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

  if (terrainType === BUILDING_HQ) {
    resourceName = resourceNames[TERRAIN_PLAIN]
    this.terrainSprite = new PIXI.Sprite(PIXI.loader.resources[resourceName].texture)
    this.changeBuilding(BUILDING_HQ)
  } else {
    this.terrainSprite = new PIXI.Sprite(PIXI.loader.resources[resourceName].texture)
  }

  this.terrainSprite.interactive = true
  this.terrainSprite.on('click', function () {
    if (selectedBuildingButton) {
      if (this.isAvailableForSelectedBuilding) {
        this.changeBuilding(selectedBuildingButton)
        updateGame()

        deselectBuildingButton()
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

  setInformationBoxText('built: ' + this.buildingType) // unsure about this mofo
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

  var producingIconResourceName = resourceNames[buildingProvides[buildingType]];

  var buildingProvidesSprite = new PIXI.Sprite(PIXI.loader.resources[producingIconResourceName].texture)
  buildingProvidesSprite.width = 16
  buildingProvidesSprite.height = 16
  buildingProvidesSprite.x = 100
  buildingProvidesSprite.y = 26
  this.container.addChild(buildingProvidesSprite)

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

    this.container = new PIXI.Container()

    this.welcometextContainer = new PIXI.Container()
    var region = (Math.random() < 0.5) ? 'PO' : 'KG';
    var welcomeText = new PIXI.Text('Welcome, to asteroid ' + region + '-56-AX-' + Math.round(Math.random() * 10032), { fontSize: 16, fill: '#ffffff'})
    welcomeText.x = 270
    welcomeText.y = 270
    var tween_welcometext = new TweenLib.Tween({ alpha: 1 })
      .to({alpha: 0}, 600)
      .delay(400)
      .easing(TweenLib.Easing.Quartic.Out)
      .onUpdate(function(y) {
        welcomeText.alpha = this.alpha;
      })
      .start();
    this.tweens.push(tween_welcometext)
    this.welcometextContainer.addChild(welcomeText)

    var backgroundImage = new PIXI.Sprite(PIXI.loader.resources['background'].texture)
    backgroundImage.interactive = true
    backgroundImage.on('click', function () {
      selectedBuildingButton = null
      updateTileMarkers()
      setInformationBoxText('')
    })
    this.container.addChild(backgroundImage)

    var asteroidImage = new PIXI.Sprite(PIXI.loader.resources['astroid'].texture)
    asteroidImage.x = 128
    asteroidImage.y = -500

    var tween_asteriod = new TweenLib.Tween({ y: -500 })
      .to({y: 104}, 3300)
      .easing(TweenLib.Easing.Quartic.Out)
      .onUpdate(function(y) {
        asteroidImage.y = this.y;
      })
      .start();
    this.tweens.push(tween_asteriod)
    this.container.addChild(asteroidImage)

    var gameContainer = new PIXI.Container()
    this.gameContainer = gameContainer;
    this.gameContainer.x = 182
    this.gameContainer.y = -500
    var tween_gamecontainer = new TweenLib.Tween({ y: -500 })
      .to({y: 132}, 3300)
      .easing(TweenLib.Easing.Quartic.Out)
      .onUpdate(function(y) {
        gameContainer.y = this.y;
      })
      .start();

    this.tweens.push(tween_gamecontainer)

    this.tileContainer = new PIXI.Container()

    this.gameContainer.addChild(this.tileContainer)

    var buildingPanelContainer = new PIXI.Container()
    this.buildingPanelContainer = buildingPanelContainer;
    this.buildingPanelContainer.x = 656
    this.buildingPanelContainer.y = 38 - 700

    var tween_buildingPanel = new TweenLib.Tween({ y: 38 - 700 })
      .to({y: 38}, 300)
      .delay(3000)
      .easing(TweenLib.Easing.Quartic.Out)
      .onUpdate(function() {
        buildingPanelContainer.y = this.y;
      })
      .start();
    this.tweens.push(tween_buildingPanel)


    var resourcePanelContainer = new PIXI.Container()
    this.resourcePanelContainer = resourcePanelContainer;
    var baseResourcesPanelBackground = new PIXI.Sprite(PIXI.loader.resources['base_resources_panel'].texture)
    this.resourcePanelContainer.x = 20
    this.resourcePanelContainer.y = 60 - 700

    var tween_resource_panel = new TweenLib.Tween({ y: 60 - 700 })
      .to({y: 60}, 300)
      .delay(3000)
      .easing(TweenLib.Easing.Quartic.Out)
      .onUpdate(function() {
        resourcePanelContainer.y = this.y;
      })
      .start();
    this.tweens.push(tween_resource_panel)
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
      terraform()
    })

    this.gameOverContainer = new PIXI.Container()
    var gameOverBackground = new PIXI.Sprite(PIXI.loader.resources['background'].texture)
    this.gameOverContainer.addChild(gameOverBackground)
    this.gameOverText = new PIXI.Text('', {
      fontSize: 20,
      fill: '#ffff00',
      wordWrap: true,
      wordWrapWidth: 600,
    })
    this.gameOverText.x = 100
    this.gameOverText.y = 100
    this.gameOverContainer.addChild(this.gameOverText)
    this.gameOverContainer.on('click', function () {
      this.changeScene('gameScene') // start over
    }.bind(this))
    this.gameOverContainer.visible = false

    global.baseStage.addChild(this.container)
    this.container.addChild(this.welcometextContainer)
    this.container.addChild(this.gameContainer)
    this.container.addChild(this.buildingPanelContainer)
    this.container.addChild(this.resourcePanelContainer)
    this.container.addChild(this.informationBoxContainer)
    this.container.addChild(terraformButton)
    this.container.addChild(this.gameOverContainer)

    var map = [
      TERRAIN_PLAIN, TERRAIN_SAND, TERRAIN_PLAIN, TERRAIN_PLAIN, TERRAIN_PLAIN, TERRAIN_SAND,
      TERRAIN_PLAIN, TERRAIN_PLAIN,TERRAIN_PLAIN, TERRAIN_PLAIN, TERRAIN_PLAIN, TERRAIN_PLAIN,
      TERRAIN_PLAIN, BUILDING_HQ  ,TERRAIN_PLAIN, TERRAIN_ORE,   TERRAIN_PLAIN, TERRAIN_ORE,
      TERRAIN_PLAIN, TERRAIN_PLAIN,TERRAIN_ICE,   TERRAIN_PLAIN, TERRAIN_ICE,   TERRAIN_PLAIN,
    ]

    tiles = []
    for (var r = 0; r < rowCount; r++) {
      tiles[r] = []
      for (var c = 0; c < colCount; c++) {
        var terrainType = map.shift()
        var tile = new Tile(c, r, terrainType)
        tiles[r][c] = tile
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

  },
  destroy: function () {
    this.container.destroy()
  },
  update: function (delta) {
    this.totalTime = this.totalTime + delta;
    this.tweens.forEach(function(hmm) {
      hmm.update(this.totalTime);
    }.bind(this))
  },
  draw: function () {
    global.renderer.render(this.container)
  },
}

module.exports = gameScene
