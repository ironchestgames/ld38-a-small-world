var gameVars = require('./gameVars')

var tiles

var TERRAIN_SAND = 'TERRAIN_SAND'
var TERRAIN_ICE = 'TERRAIN_ICE'
var TERRAIN_ORE = 'TERRAIN_ORE'

var Tile = function (x, y, terrainType) {
  this.x = x
  this.y = y
  this.terrain = terrainType
  this.building = null

  this.sprite = new PIXI.Sprite(PIXI.loader.resources['tile_plain'].texture)
  this.sprite.x = x * 64
  this.sprite.y = y * 64
}

Tile.prototype.draw = function () {

}

var gameScene = {
  name: 'gameScene',
  create: function (sceneParams) {
    this.container = new PIXI.Container()
    global.baseStage.addChild(this.container)

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
        this.container.addChild(tile.sprite)
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
