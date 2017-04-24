
var howtoScene = {
  name: 'howtoScene',
  create: function () {
    this.container = new PIXI.Container()

    global.baseStage.addChild(this.container)

    var background = new PIXI.Sprite(PIXI.loader.resources['background'].texture)

    this.container.addChild(background)

    var howtoContainer = new PIXI.Container()
    howtoContainer.x = 220
    howtoContainer.y = 145

    var str = '1  Place your buildings\n\n' +
        '2  Press\n\n' +
        '3  Try again\n\n\n\n\n' +
        '        Click to begin'

    var text = new PIXI.Text(str, {
      fontSize: 36,
      fill: global.menuColor,
    })

    howtoContainer.addChild(text)

    var colonize_button = new PIXI.Sprite(PIXI.loader.resources['colonize_button'].texture)
    colonize_button.x = 170
    colonize_button.y = 78
    howtoContainer.addChild(colonize_button)

    this.container.addChild(howtoContainer)

    this.container.interactive = true
    this.container.on('click', function () {
      this.changeScene('gameScene')
    }.bind(this))

  },
  destroy: function () {
    this.container.destroy()
  },
  update: function (delta) {
    
  },
  draw: function () {
    global.renderer.render(this.container)
  },
}

module.exports = howtoScene
