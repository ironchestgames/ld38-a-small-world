var gameVars = require('./gameVars')

var loadingScene = {
  name: 'loadingScene',
  create: function (sceneParams) {

    // fetch assets
    PIXI.loader

    // buttons
    .add('tile_plain', 'assets/images/tile_plain.png')
    .add('tile_ice', 'assets/images/tile_ice.png')
    .add('tile_ore', 'assets/images/tile_ore.png')
    .add('alloy_and_glass_to_dome', 'assets/images/alloy_and_glass_to_dome.png')
    .add('asteroid_resources_panel', 'assets/images/asteroid_resources_panel.png')
    .add('background', 'assets/images/background.png')
    .add('base_resources_panel', 'assets/images/base_resources_panel.png')
    .add('building_button', 'assets/images/building_button.png')
    .add('building_panel', 'assets/images/building_panel.png')
    .add('heat_generator', 'assets/images/heat_generator.png')
    .add('hq', 'assets/images/hq.png')
    .add('ice_and_heat_to_water', 'assets/images/ice_and_heat_to_water.png')
    .add('ice_collector', 'assets/images/ice_collector.png')
    .add('living_quarters', 'assets/images/living_quarters.png')
    .add('malm_to_metal', 'assets/images/malm_to_metal.png')
    .add('mineral_and_metal_to_alloy', 'assets/images/mineral_and_metal_to_alloy.png')
    .add('mining', 'assets/images/mining.png')
    .add('quarry', 'assets/images/quarry.png')
    .add('sand_to_glass', 'assets/images/sand_to_glass.png')
    .add('sand_to_minerals', 'assets/images/sand_to_minerals.png')
    
    .load(function () {
      this.changeScene(localStorage.scene || 'gameScene', sceneParams)
    }.bind(this))
  },
  destroy: function () {

  },
  update: function () {

  },
  draw: function () {

  },
}

module.exports = loadingScene
