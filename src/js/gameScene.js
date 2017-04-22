var gameVars = require('./gameVars')

var tiles

var TERRAIN_SAND = 'TERRAIN_SAND'
var TERRAIN_ICE = 'TERRAIN_ICE'
var TERRAIN_ORE = 'TERRAIN_ORE'

var BUILDING_ICE_COLLECTOR = 'BUILDING_ICE_COLLECTOR'
var BUILDING_QUARRY = 'BUILDING_QUARRY'
var BUILDING_MINING = 'BUILDING_MINING'

var Tile = function (x, y, terrainType) {
  this.x = x
  this.y = y
  this.terrain = terrainType
  this.building = null

  this.sprite = new PIXI.Sprite(PIXI.loader.resources['tile_plain'].texture)
  this.sprite.x = x * 64
  this.sprite.y = y * 64
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
      TERRAIN_SAND,
      TERRAIN_SAND,
      TERRAIN_SAND,
      TERRAIN_SAND,
      TERRAIN_SAND,
      TERRAIN_SAND,
      TERRAIN_SAND,
      TERRAIN_SAND,
      TERRAIN_SAND,
    ]

    tiles = []
    for (var r = 0; r < rowCount; r++) {
      tiles[r] = []
      for (var c = 0; c < colCount; c++) {
        var randomIndex = Math.floor(Math.random() * (rowCount * colCount))
        var terrain = terrains.splice(randomIndex, 1)
        var tile = new Tile(c, r, terrain)
        tiles[r][c] = tile
        this.tileContainer.addChild(tile.sprite)
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
