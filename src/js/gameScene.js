var gameVars = require('./gameVars')

var rowCount = 4
var colCount = 6

var tiles
var buildingButtons

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
var RESOURCE_MINERALS = 'RESOURCE_MINERALS'
var RESOURCE_ALLOY = 'RESOURCE_ALLOY'
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
var BUILDING_ALLOY_AND_GLASS_TO_DOME = 'BUILDING_ALLOY_AND_GLASS_TO_DOME'
var BUILDING_ICE_AND_HEAT_TO_WATER = 'BUILDING_ICE_AND_HEAT_TO_WATER'
var BUILDING_ORE_TO_METAL = 'BUILDING_ORE_TO_METAL'
var BUILDING_MINERAL_AND_METAL_TO_ALLOY = 'BUILDING_MINERAL_AND_METAL_TO_ALLOY'
var BUILDING_SAND_TO_GLASS = 'BUILDING_SAND_TO_GLASS'
var BUILDING_SAND_TO_MINERALS = 'BUILDING_SAND_TO_MINERALS'

var buildingNeeds = {}
//Base buildings
buildingNeeds[BUILDING_HEAT_GENERATOR] = []
buildingNeeds[BUILDING_MINING] = []
buildingNeeds[BUILDING_QUARRY] = []
buildingNeeds[BUILDING_HQ] = []
buildingNeeds[BUILDING_ICE_COLLECTOR] = []
buildingNeeds[BUILDING_LIVING_QUARTERS] = []

//Resource converters
buildingNeeds[BUILDING_ALLOY_AND_GLASS_TO_DOME] = [RESOURCE_ALLOY, RESOURCE_GLASS] // like this plz
buildingNeeds[BUILDING_ICE_AND_HEAT_TO_WATER] = 'BUILDING_ICE_AND_HEAT_TO_WATER'
buildingNeeds[BUILDING_ORE_TO_METAL] = 'BUILDING_ORE_TO_METAL'
buildingNeeds[BUILDING_MINERAL_AND_METAL_TO_ALLOY] = 'BUILDING_MINERAL_AND_METAL_TO_ALLOY'
buildingNeeds[BUILDING_SAND_TO_GLASS] = 'BUILDING_SAND_TO_GLASS'
buildingNeeds[BUILDING_SAND_TO_MINERALS] = 'BUILDING_SAND_TO_MINERALS'

var resourceNames = {}
resourceNames[TERRAIN_SAND] = 'tile_plain'
resourceNames[TERRAIN_ICE] = 'tile_ice'
resourceNames[TERRAIN_ORE] = 'tile_ore'

resourceNames[BUILDING_HEAT_GENERATOR] = 'heat_generator'
resourceNames[BUILDING_MINING] = 'mining'
resourceNames[BUILDING_QUARRY] = 'quarry'
resourceNames[BUILDING_HQ] = 'hq'
resourceNames[BUILDING_ICE_COLLECTOR] = 'ice_collector'
resourceNames[BUILDING_LIVING_QUARTERS] = 'living_quarters'
resourceNames[BUILDING_ALLOY_AND_GLASS_TO_DOME] = 'alloy_and_glass_to_dome'
resourceNames[BUILDING_ICE_AND_HEAT_TO_WATER] = 'ice_and_heat_to_water'
resourceNames[BUILDING_ORE_TO_METAL] = 'ore_to_metal'
resourceNames[BUILDING_MINERAL_AND_METAL_TO_ALLOY] = 'mineral_and_metal_to_alloy'
resourceNames[BUILDING_SAND_TO_GLASS] = 'sand_to_glass'
resourceNames[BUILDING_SAND_TO_MINERALS] = 'sand_to_minerals'

var selectedBuildingButton = null

var isTileProducingResource = function (tile, resource) {
  switch (resource) {

    // level 1
    case RESOURCE_SAND:
      return tile.buildingType == BUILDING_QUARRY

    case RESOURCE_ICE:
      return tile.buildingType == BUILDING_ICE_COLLECTOR

    case RESOURCE_METAL:
      return tile.buildingType == BUILDING_MINING

    case RESOURCE_PEOPLE:
      return tile.buildingType == BUILDING_LIVING_QUARTERS

    // level 2
    case RESOURCE_GLASS:
      return tile.buildingType == BUILDING_SAND_TO_GLASS &&
          tile.availableResources.includes(RESOURCE_SAND)

  }
}

var isInsideGrid = function (x, y) {
  return y >= 0 && y < rowCount && x >= 0 && x < colCount
}

var produceResource = function (resource) {
  for (var r = 0; r < rowCount; r++) {
    for (var c = 0; c < colCount; c++) {
      var tile = tiles[r][c]

      if (isTileProducingResource(resource)) {
        if (isInsideGrid(c + 1, r)) {
          tiles[r][c + 1].availableResources.push(resource)
        } else if (isInsideGrid(c, r + 1)) {
          tiles[r + 1][c].availableResources.push(resource)
        } else if (isInsideGrid(c - 1, r)) {
          tiles[r][c - 1].availableResources.push(resource)
        } else if (isInsideGrid(c, r - 1)) {
          tiles[r - 1][c].availableResources.push(resource)
        }
      }
    }
  }
}

var updateTiles = function () {
  for (var r = 0; r < rowCount; r++) {
    for (var c = 0; c < colCount; c++) {
      tiles[r][c].availableResources = []
    }
  }

  // level 1
  produceResource(RESOURCE_SAND)
  produceResource(RESOURCE_ICE)
  produceResource(RESOURCE_METAL)

  // level 2
  produceResource(RESOURCE_GLASS)

  for (var r = 0; r < rowCount; r++) {
    for (var c = 0; c < colCount; c++) {
      tiles[r][c].update()
    }
  }
}

var Tile = function (x, y, terrainType) {
  this.x = x
  this.y = y
  this.terrain = terrainType
  this.buildingType = null
  this.availableResources = []

  var resourceName = resourceNames[terrainType]

  this.container = new PIXI.Container()
  this.iconsContainer = new PIXI.Container()
  this.iconsContainer.y = 2
  this.buildingContainer = new PIXI.Container()

  if (terrainType === BUILDING_HQ) {
    resourceName = resourceNames[TERRAIN_SAND]
    this.terrainSprite = new PIXI.Sprite(PIXI.loader.resources[resourceName].texture)
    this.changeBuilding(BUILDING_HQ)
  } else {
    this.availableResources.push(terrainType)
    this.terrainSprite = new PIXI.Sprite(PIXI.loader.resources[resourceName].texture)
  }

  this.terrainSprite.interactive = true
  this.terrainSprite.on('click', function () {
    if (selectedBuildingButton) {
      this.changeBuilding(selectedBuildingButton)
      updateTiles()
    }
  }.bind(this))

  this.container.addChild(this.terrainSprite)
  this.container.addChild(this.buildingContainer)
  this.container.addChild(this.iconsContainer)

  this.container.x = x * 64
  this.container.y = y * 64
}

Tile.prototype.changeBuilding = function (buildingType) {
  var resourceName = resourceNames[buildingType]

  var buildingSprite = new PIXI.Sprite(PIXI.loader.resources[resourceName].texture)

  this.buildingType = buildingType

  this.buildingContainer.addChild(buildingSprite)
}

Tile.prototype.update = function () {
  this.iconsContainer.removeChildren()

  if (!this.buildingType) {
    return
  }

  var neededResources = buildingNeeds[this.buildingType]

  for (var i = 0; i < neededResources.length; i++) {
    var neededResource = neededResources[i]
    if (!this.availableResources.includes(neededResource)) {
      var haha = neededResource.toLowerCase()
      var iconSprite = new PIXI.Sprite(PIXI.loader.resources[haha].texture)
      iconSprite.x = (64 - 15) - i * 15
      this.iconsContainer.addChild(iconSprite)
    }
  }
}

var BuildingButton = function (buildingType, index) {
  this.buildingType = buildingType

  var resourceName = resourceNames[buildingType]

  this.container = new PIXI.Container()

  var button = new PIXI.Sprite(PIXI.loader.resources['building_button'].texture)
  button.interactive = true
  button.on('click', function () {
    selectedBuildingButton = buildingType
  })
  this.container.addChild(button)

  var buildingSprite = new PIXI.Sprite(PIXI.loader.resources[resourceName].texture)
  buildingSprite.width = 32
  buildingSprite.height = 32
  buildingSprite.x = 6
  buildingSprite.y = 6
  this.container.addChild(buildingSprite)

  this.container.y = index * 47
}

var gameScene = {
  name: 'gameScene',
  create: function (sceneParams) {
    this.container = new PIXI.Container()

    var backgroundImage = new PIXI.Sprite(PIXI.loader.resources['background'].texture)
    this.container.addChild(backgroundImage)

    this.gameContainer = new PIXI.Container()
    this.gameContainer.x = 182
    this.gameContainer.y = 132

    this.tileContainer = new PIXI.Container()

    this.gameContainer.addChild(this.tileContainer)

    this.buildingPanelContainer = new PIXI.Container()
    this.buildingPanelContainer.x = 656
    this.buildingPanelContainer.y = 38

    global.baseStage.addChild(this.container)
    this.container.addChild(this.gameContainer)
    this.container.addChild(this.buildingPanelContainer)

    var terrains = [
      TERRAIN_SAND,
      TERRAIN_SAND,
      TERRAIN_SAND,
      TERRAIN_SAND,
      TERRAIN_SAND,
      TERRAIN_SAND,
      TERRAIN_SAND,
      TERRAIN_SAND,
      TERRAIN_SAND,
      TERRAIN_SAND,
      TERRAIN_SAND,
      TERRAIN_SAND,
      TERRAIN_SAND,
      TERRAIN_SAND,
      BUILDING_HQ,
      TERRAIN_ORE,
      TERRAIN_ORE,
      TERRAIN_ORE,
      TERRAIN_ORE,
      TERRAIN_ORE,
      TERRAIN_ICE,
      TERRAIN_ICE,
      TERRAIN_ICE,
      TERRAIN_ICE,
    ]

    tiles = []
    for (var r = 0; r < rowCount; r++) {
      tiles[r] = []
      for (var c = 0; c < colCount; c++) {
        // var randomIndex = Math.floor(Math.random() * terrains.length)
        // var terrain = terrains.splice(randomIndex, 1)
        var terrain = terrains.shift()
        var tile = new Tile(c, r, terrain)
        tiles[r][c] = tile
        this.tileContainer.addChild(tile.container)
      }
    }

    var buildingButtonTypes = [
      BUILDING_HEAT_GENERATOR,
      BUILDING_MINING,
      BUILDING_QUARRY,
      // BUILDING_HQ,
      BUILDING_ICE_COLLECTOR,
      BUILDING_LIVING_QUARTERS,

      //Resource converters
      BUILDING_ALLOY_AND_GLASS_TO_DOME,
      BUILDING_ICE_AND_HEAT_TO_WATER,
      BUILDING_ORE_TO_METAL,
      BUILDING_MINERAL_AND_METAL_TO_ALLOY,
      BUILDING_SAND_TO_GLASS,
      BUILDING_SAND_TO_MINERALS,
    ]

    buildingButtons = []

    for (var i = 0; i < buildingButtonTypes.length; i++) {
      var buildingType = buildingButtonTypes[i]
      var buildingButton = new BuildingButton(buildingType, i)
      buildingButtons[buildingType] = buildingButton
      this.buildingPanelContainer.addChild(buildingButton.container)
    }

  },
  destroy: function () {
    this.container.destroy()
  },
  update: function () {

  },
  draw: function () {
    global.renderer.render(this.container)
  },
}

module.exports = gameScene
