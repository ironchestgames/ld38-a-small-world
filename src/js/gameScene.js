var gameVars = require('./gameVars')

var tiles

var TERRAIN_SAND = 'TERRAIN_SAND'
var TERRAIN_ICE = 'TERRAIN_ICE'
var TERRAIN_ORE = 'TERRAIN_ORE'

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
var BUILDING_MALM_TO_METAL = 'BUILDING_MALM_TO_METAL'
var BUILDING_MINERAL_AND_METAL_TO_ALLOY = 'BUILDING_MINERAL_AND_METAL_TO_ALLOY'
var BUILDING_SAND_TO_GLASS = 'BUILDING_SAND_TO_GLASS'
var BUILDING_SAND_TO_MINERALS = 'BUILDING_SAND_TO_MINERALS'

var resourceNames = {}
resourceNames[TERRAIN_SAND] = 'tile_plain'
resourceNames[TERRAIN_ICE] = 'tile_ice'
resourceNames[TERRAIN_ORE] = 'tile_ore'

resourceNames[BUILDING_HEAT_GENERATOR] = 'heat_generator'
resourceNames[BUILDING_MINING] = 'mining'
resourceNames[BUILDING_QUARRY] = 'quarry'
resourceNames[BUILDING_HQ] = 'BUILDING_HQ'
resourceNames[BUILDING_ICE_COLLECTOR] = 'BUILDING_ICE_COLLECTOR'
resourceNames[BUILDING_LIVING_QUARTERS] = 'BUILDING_LIVING_QUARTERS'
resourceNames[BUILDING_ALLOY_AND_GLASS_TO_DOME] = 'BUILDING_ALLOY_AND_GLASS_TO_DOME'
resourceNames[BUILDING_ICE_AND_HEAT_TO_WATER] = 'BUILDING_ICE_AND_HEAT_TO_WATER'
resourceNames[BUILDING_MALM_TO_METAL] = 'BUILDING_MALM_TO_METAL'
resourceNames[BUILDING_MINERAL_AND_METAL_TO_ALLOY] = 'BUILDING_MINERAL_AND_METAL_TO_ALLOY'
resourceNames[BUILDING_SAND_TO_GLASS] = 'BUILDING_SAND_TO_GLASS'
resourceNames[BUILDING_SAND_TO_MINERALS] = 'BUILDING_SAND_TO_MINERALS'

var Tile = function (x, y, terrainType) {
  this.x = x
  this.y = y
  this.terrain = terrainType
  this.building = null

  var resourceName = resourceNames[terrainType]

  this.terrainSprite = new PIXI.Sprite(PIXI.loader.resources[resourceName].texture)
  this.terrainSprite.x = x * 64
  this.terrainSprite.y = y * 64
}

Tile.prototype.addBuilding = function (buildingType) {
  // this.buildingSprite = 
}

var BuildingButton = function (buildingType) {
  this.buildingType = buildingType
}

var gameScene = {
  name: 'gameScene',
  create: function (sceneParams) {
    this.container = new PIXI.Container()

    this.tileContainer = new PIXI.Container()
    this.tileContainer.x = 100
    this.tileContainer.y = 100

    this.buildingPanelContainer = new PIXI.Container()
    this.buildingPanelContainer.x = 0
    this.buildingPanelContainer.y = 0

    global.baseStage.addChild(this.container)
    this.container.addChild(this.buildingPanelContainer)
    this.container.addChild(this.tileContainer)

    var rowCount = 4
    var colCount = 6

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
      TERRAIN_SAND,
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
        this.tileContainer.addChild(tile.terrainSprite)
      }
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
