
var splashScene = {
  name: 'splashScene',
  create: function () {
    this.container = new PIXI.Container()

    global.baseStage.addChild(this.container)

    var background = new PIXI.Sprite(PIXI.loader.resources['background'].texture)

    this.container.addChild(background)

    var logo = new PIXI.Sprite(PIXI.loader.resources['ASTEROIDARCHITECT'].texture)
    logo.x = (800 - logo.width) / 2
    logo.y = 60

    this.container.addChild(logo)

    var someContainer = new PIXI.Container()
    someContainer.x = 208
    someContainer.y = 145

    var str = '\n\n' +
        '\n\n' +
        '\n\n\n\n\n' +
        '        Click to continue'

    var text = new PIXI.Text(str, {
      fontSize: 36,
      fill: global.menuColor,
    })

    someContainer.addChild(text)

    this.container.addChild(someContainer)

    this.container.interactive = true
    this.container.on('click', function () {
      this.changeScene('howtoScene')
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

module.exports = splashScene
