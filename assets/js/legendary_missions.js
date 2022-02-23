class LegendaryMission {

  static init() {
    this.missions = [];
    this.layer = L.layerGroup();
    this.layer.addTo(MapBase.map);
    this.context = $('.menu-hidden[data-type=legendary_animal_missions]');
    const pane = MapBase.map.createPane('locationPoints');
    pane.style.zIndex = 450; // markers on top of circle, but behind “normal” markers/shadows
    pane.style.pointerEvents = 'none';

    this.onSettingsChanged();
    $('.menu-hidden[data-type="legendary_animal_missions"] > *:first-child a').click(e => {
      e.preventDefault();
      const showAll = $(e.target).attr('data-text') === 'menu.show_all';
      LegendaryMission.missions.forEach(mission => mission.onMap = showAll);
    });
    return Loader.promises['animal_legendary_missions'].consumeJson(data => {
      data.forEach(item => {
        this.missions.push(new LegendaryMission(item));
      });
      this.onLanguageChanged();
      console.info('%c[Legendary animal missions] Loaded!', 'color: #bada55; background: #242424');
    });
  }
  static onLanguageChanged() {
    Menu.reorderMenu(this.context);
    this.onSettingsChanged();
  }
  static onSettingsChanged() {
    this.missions.forEach(mission => mission.reinitMarker());
  }

  // not idempotent (on the environment)
  constructor(preliminary) {
    Object.assign(this, preliminary);
    this._shownKey = `shown.${this.title}`;
    this.element = $('<div class="collectible-wrapper" data-help="item">')
      .on('click', () => this.onMap = !this.onMap)
      .append($('<p class="collectible">').attr('data-text', this.title))
      .translate();
    this.species = this.title.replace(/^mp_animal_|_legendary_mission_\d+$/g, '');
    this.reinitMarker();
    this.element.appendTo(LegendaryMission.context);
  }
  // auto remove marker? from map, recreate marker, auto add? marker
  reinitMarker() {
    if (this.marker) LegendaryMission.layer.removeLayer(this.marker);
    this.marker = L.layerGroup();

    const animalIconSize = Settings.legendaryMissionAnimalIconSize;
    const animalIconUrl = `./assets/images/icons/legendary_animals.png?nocache=${nocache}`;

    const clueIconSize = Settings.legendaryMissionClueIconSize;
    const clueIconUrl = `./assets/images/icons/cross.png?nocache=${nocache}`;

    this.zones.forEach((zone, index) => {
      if (zone.type === 'area') {
        this.marker.addLayer(L.circle([zone.x, zone.y], {
          color: '#f4e98a',
          fillColor: '#f4e98a',
          fillOpacity: linear(Settings.overlayOpacity, 0, 1, 0.1, 0.5),
          radius: zone.radius
        }));
      }

      const isClue = index < this.zones.length - 1;
      const iconSize = isClue ? clueIconSize : animalIconSize;
      const iconUrl = isClue ? clueIconUrl : animalIconUrl;
      const iconTitle = isClue
        ? Language.get('map.legendary_mission.clue')
        : Language.get('map.legendary_mission.animal');

      const icon = new L.Icon.DataMarkup({
        iconUrl,
        iconSize: [16 * iconSize, 16 * iconSize],
        iconAnchor: [8 * iconSize, 8 * iconSize],
        popupAnchor: [0, -8],
        tippy: zone.location.description ? `${iconTitle}: ${zone.location.description}` : iconTitle
      });

      this.marker.addLayer(L.marker([zone.location.x, zone.location.y], {
        icon,
        pane: 'locationPoints',
        opacity: 1
      }));
    })

    const points = this.zones.map(zone => new L.LatLng(zone.location.x, zone.location.y))
    this.marker.addLayer(L.polyline(points, {
      color: 'white',
      dashArray: '5, 5',
      dashOffset: '0'
    }));

    this.onMap = this.onMap;
  }
 
  set onMap(state) {
    if (!this.marker) return;
    if (state) {
      LegendaryMission.layer.addLayer(this.marker);
      this.element.removeClass('disabled');
      if (!MapBase.isPreviewMode)
        localStorage.setItem(`rdo.${this._shownKey}`, 'true');
    } else {
      LegendaryMission.layer.removeLayer(this.marker);
      this.element.addClass('disabled');
      if (!MapBase.isPreviewMode)
        localStorage.removeItem(`rdo.${this._shownKey}`);
    }
    MapBase.updateTippy('legendary_missions');
  }

  get onMap() {
    return !!localStorage.getItem(`rdo.${this._shownKey}`);
  }
}
