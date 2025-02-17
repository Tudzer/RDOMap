class Menu {
  static init() {
    this.tippyInstances = [];
    Loader.mapModelLoaded.then(this.activateHandlers.bind(this));
  }

  static reorderMenu(menu) {
    $(menu).children().sort(function (a, b) {
      return a.textContent.toLowerCase().localeCompare(b.textContent.toLowerCase());
    }).appendTo(menu);

    if ($(menu).children('.new').length > 0)
      $(`[data-type=${$(menu).attr('data-type')}]`).toggleClass('new', true);

  }

  static activateHandlers() {

    const help = document.getElementById('help-container');
    const $helpParagraph = $(help).children('p');
    $('.side-menu, .top-widget, .lat-lng-container')
      .on('mouseover mouseout', event => {
        const target = event.type === 'mouseover' ? event.target : event.relatedTarget;

        // keep current help if pointer jumped to help container or it overgrew current pointer pos.
        if (help.contains(target)) return;
        const helpTransId = $(target).closest('[data-help]').attr('data-help') || 'default';
        $helpParagraph.html(Language.get(`help.${helpTransId}`));
      });

    $('.menu-hide-all').on('click', function () {
      Shop.locations.forEach(shop => {
        if (shop.onMap) shop.onMap = !shop.onMap;
      });
      GunForHire.locations.forEach(_gfh => {
        if (_gfh.onMap) _gfh.onMap = !_gfh.onMap;
      });
      Encounter.locations.forEach(_encounter => {
        if (_encounter.onMap) _encounter.onMap = !_encounter.onMap;
      });
      PlantsCollection.locations.forEach(_plants => {
        if (_plants.onMap) _plants.onMap = !_plants.onMap;
      });
      Camp.locations.forEach(camp => {
        if (camp.onMap) camp.onMap = !camp.onMap;
      });
      Location.locations.forEach(loc => {
        if (loc.onMap) loc.onMap = !loc.onMap;
      });
      Legendary.animals.forEach(animal => {
        if (animal.onMap) animal.onMap = !animal.onMap;
      });
      LegendaryMission.missions.forEach(mission => {
        if (mission.onMap) mission.onMap = !mission.onMap;
      });
      AnimalCollection.collection.forEach(collection => {
        collection.animals.forEach(animal => animal.isEnabled = false);
      });
      MadamNazar.onMap = false;
      Pins.onMap = false;
      Treasure.treasuresOnMap = false;
      Bounty.bountiesOnMap = false;
      CondorEgg.condorEggOnMap = false;
      Salvage.salvageOnMap = false;
    });

    $('.menu-show-all').on('click', function () {
      Shop.locations.forEach(shop => {
        if (!shop.onMap) shop.onMap = !shop.onMap;
      });
      GunForHire.locations.forEach(_gfh => {
        if (!_gfh.onMap) _gfh.onMap = !_gfh.onMap;
      });
      Encounter.locations.forEach(_encounter => {
        if (!_encounter.onMap) _encounter.onMap = !_encounter.onMap;
      });
      PlantsCollection.locations.forEach(_plants => {
        if (!_plants.onMap) _plants.onMap = !_plants.onMap;
      });
      setTimeout(() => PlantsCollection.layer.redraw(), 40);
      Camp.locations.forEach(camp => {
        if (!camp.onMap) camp.onMap = !camp.onMap;
      });
      Location.locations.forEach(loc => {
        if (!loc.onMap) loc.onMap = !loc.onMap;
      });
      Legendary.animals.forEach(animal => {
        if (!animal.onMap) animal.onMap = !animal.onMap;
      });
      LegendaryMission.mission.forEach(mission => {
        if (!mission.onMap) mission.onMap = !mission.onMap;
      });
      MadamNazar.onMap = true;
      Pins.onMap = true;
      Treasure.treasuresOnMap = true;
      Bounty.bountiesOnMap = true;
      CondorEgg.condorEggOnMap = true;
      Salvage.salvageOnMap = true;
    });

    $('.camps-small-btn').on('click', function () {
      $(this).toggleClass('disabled');
      Camp.isSmall = !Camp.isSmall;
      Camp.locations.forEach(camp => {
        if (camp.layer['_map'] != null) camp.reinitMarker();
      });
      MapBase.updateTippy('campsbtn');
    });
    $('.camps-large-btn').on('click', function () {
      $(this).toggleClass('disabled');
      Camp.isLarge = !Camp.isLarge;
      Camp.locations.forEach(camp => {
        if (camp.layer['_map'] != null) camp.reinitMarker();
      });
      MapBase.updateTippy('campsbtn');
    });
    $('.camps-wilderness-btn').on('click', function () {
      $(this).toggleClass('disabled');
      Camp.isWilderness = !Camp.isWilderness;
      Camp.locations.forEach(camp => {
        if (camp.layer['_map'] != null) camp.reinitMarker();
      });
      MapBase.updateTippy('campsbtn');
    });

    $('.shops-hide-btn').on('click', function () {
      Shop.locations.forEach(shop => {
        if (shop.onMap) shop.onMap = !shop.onMap;
      });
    });
    $('.shops-show-btn').on('click', function () {
      Shop.locations.forEach(shop => {
        if (!shop.onMap) shop.onMap = !shop.onMap;
      });
    });

    $('.gfh-hide-btn').on('click', function () {
      GunForHire.locations.forEach(_gfh => {
        if (_gfh.onMap) _gfh.onMap = !_gfh.onMap;
      });
    });
    $('.gfh-show-btn').on('click', function () {
      GunForHire.locations.forEach(_gfh => {
        if (!_gfh.onMap) _gfh.onMap = !_gfh.onMap;
      });
    });

    $('.plants-hide-btn').on('click', function () {
      PlantsCollection.locations.forEach(_plants => {
        if (_plants.onMap) _plants.onMap = !_plants.onMap;
      });
    });
    $('.plants-show-btn').on('click', function () {
      PlantsCollection.locations.forEach(_plants => {
        if (!_plants.onMap) _plants.onMap = !_plants.onMap;
      });
      setTimeout(() => PlantsCollection.layer.redraw(), 40);
    });

    $('.encounters-hide-btn').on('click', function () {
      Encounter.locations.forEach(_encounter => {
        if (_encounter.onMap) _encounter.onMap = !_encounter.onMap;
      });
    });
    $('.encounters-show-btn').on('click', function () {
      Encounter.locations.forEach(_encounter => {
        if (!_encounter.onMap) _encounter.onMap = !_encounter.onMap;
      });
    });
  }

  static updateTippy() {
    Menu.tippyInstances.forEach(instance => instance.destroy());
    Menu.tippyInstances = [];

    if (!Settings.showTooltips) return;

    Menu.tippyInstances = tippy('[data-tippy-content]', { theme: 'menu-theme' });
  }
}
