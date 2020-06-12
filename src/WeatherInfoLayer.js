import SelectedLayer from './SelectedLayer';
import { hokkaidoPrefCodes, izuOgasawara } from './code';


export default class WeatherInfoLayer {
  constructor(map, data, period, onSelected) {
    this.map = map;
    this.weatherInfo = data;
    this.period = period;

    this.map.addSource("pref-vt", {
      "type": "vector",
      "minzoom": 0,
      "maxzoom": 10,
      "tiles": ["https://weatherbox.github.io/warning-area-vt/pref/{z}/{x}/{y}.pbf"]
    });

    this.map.addLayer({
      "id": "pref-line",
      "type": "line",
      "source": "pref-vt",
      "source-layer": "prefallgeojson",
      "paint": {
        "line-color": "rgba(55, 55, 55, 0.4)"
      }
    });
    this.addTokyo();
    this.renderWeatherInfoPrefs();
 
    this.addRegion();
    this.selectedLayer =  new SelectedLayer(map, onSelected);
  }

  selectRegion(code) {
    this.selectedLayer.selectRegion(code);
  }

  addRegion() {
    this.map.addSource("region-vt", {
      "type": "vector",
      "minzoom": 0,
      "maxzoom": 8,
      "tiles": ["https://weatherbox.github.io/warning-area-vt/region/{z}/{x}/{y}.pbf"]
    });
  }

  addTokyo() {
    this.map.addSource("distlict-vt", {
      "type": "vector",
      "minzoom": 0,
      "maxzoom": 10,
      "tiles": ["https://weatherbox.github.io/warning-area-vt/distlict/{z}/{x}/{y}.pbf"]
    });

  }

  renderWeatherInfoPrefs() {
    const now = Date.now();
    var stops = [];
    let tokyo;

    for (let code in this.weatherInfo.prefs){
      const pref = this.weatherInfo.prefs[code];
      const time = new Date(pref[0].datetime);

      if ((now - time) <= this.period * 3600 * 1000){
        if (code in hokkaidoPrefCodes){
          for (let c of hokkaidoPrefCodes[code]){
            stops.push([c, this.getColor(pref.length)]);
          }

        } else if (code === '130100') {
          tokyo = this.getColor(pref.length);

        } else {
          stops.push([code, this.getColor(pref.length)]);
        }
      }
    }

    this.map.addLayer({
      "id": "weather-info-pref",
      "type": "fill",
      "source": "pref-vt",
      "source-layer": "prefallgeojson",
      "paint": {
        "fill-color": {
          "property": "prefCode",
          "type": "categorical",
          "stops": stops,
          "default": "rgba(0, 0, 0, 0)"
        },
      }
    });
    this.renderTokyo(tokyo);
  }

  renderTokyo(color = 'rgba(0, 0, 0, 0)') {
    this.map.addLayer({
      "id": "weather-info-tokyo",
      "type": "fill",
      "source": "distlict-vt",
      "source-layer": "distlictallgeojson",
      "paint": {
        "fill-color": color,
      },
      "filter": ["in", "distlictCode"].concat(izuOgasawara)
    });
  }

  getColor(count) {
    const opacity = Math.min(0.1 + 0.05 * count, 0.8);
    return `rgba(70, 171, 199, ${opacity})`;
  }   
}
