var gameVars = require('./gameVars')

var loadingScene = {
  name: 'loadingScene',
  create: function (sceneParams) {

    // fetch assets
    PIXI.loader

    // buttons
    .add('tile_placement_available', 'assets/images/tile_placement_available.png')
    .add('tile_placement_yellow', 'assets/images/tile_placement_yellow.png')

    .add('tile_plain', 'assets/images/tile_plain.png')
    .add('tile_ice', 'assets/images/tile_ice.png')
    .add('tile_ore', 'assets/images/tile_ore.png')
    .add('tile_sand', 'assets/images/tile_sand.png')

    .add('alloy_and_glass_to_dome', 'assets/images/alloy_and_glass_to_dome.png')
    .add('asteroid_resources_panel', 'assets/images/asteroid_resources_panel.png')
    .add('background', 'assets/images/background.png')
    .add('astroid', 'assets/images/astroid.png')
    .add('base_resources_panel', 'assets/images/base_resources_panel.png')
    .add('building_button', 'assets/images/building_button.png')
    .add('terraform_button', 'assets/images/terraform_button.png')
    .add('building_panel', 'assets/images/building_panel.png')
    .add('heat_generator', 'assets/images/heat_generator.png')
    .add('hq', 'assets/images/hq.png')
    .add('ice_and_heat_to_water', 'assets/images/ice_and_heat_to_water.png')
    .add('ice_collector', 'assets/images/ice_collector.png')
    .add('living_quarters', 'assets/images/living_quarters.png')
    .add('ore_to_metal', 'assets/images/ore_to_metal.png')
    .add('mining', 'assets/images/mining.png')
    .add('quarry', 'assets/images/quarry.png')
    .add('sand_to_glass', 'assets/images/sand_to_glass.png')
    
    .add('resource_dome', 'assets/images/resource_dome.png')
    .add('resource_glass', 'assets/images/resource_glass.png')
    .add('resource_heat', 'assets/images/resource_heat.png')
    .add('resource_ice', 'assets/images/resource_ice.png')
    .add('resource_metal', 'assets/images/resource_metal.png')
    .add('resource_ore', 'assets/images/resource_ore.png')
    .add('resource_people', 'assets/images/resource_people.png')
    .add('resource_sand', 'assets/images/resource_sand.png')
    .add('resource_water', 'assets/images/resource_water.png')
    
    .add('resource_missing_overlay', 'assets/images/resource_missing_overlay.png')
    
    .add('helpicon_cross', 'assets/images/helpicon_cross.png')
    .add('helpicon_check', 'assets/images/helpicon_check.png')

    .add('arrow', 'assets/images/arrow.png')
    
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
