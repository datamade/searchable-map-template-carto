function CartoLib() {
  this._mapSettings = {
    cartodbTableName: '',
    cartodbUserName: '',
    locationScope: 'chicago',
    mapDivName: '',
    map: null,
    mapCentroid: new L.LatLng(41.901557, -87.630360),
    defaultZoom: 11,
    lastClickedLayer: null,
    geojson: null,
    fields: ''
  };

  // Functions to update settings.
  this.setTableName = function(name) {
    this._mapSettings.cartodbTableName = name;
  };

  this.setUserName = function(name) {
    this._mapSettings.cartodbUserName = name;
  };

  this.setFields = function(fields) {
    this._mapSettings.fields = fields;
  };

  this.setMapDivName = function(name) {
    this._mapSettings.mapDivName = name;
  };

  this.setCentroid = function(latitude, longitude) {
    this._mapSettings.mapCentroid = new L.LatLng(latitude, longitude);
  };

  this.setDefaultZoom = function(zoom) {
    this._mapSettings.defaultZoom = zoom;
  };

}

CartoLib.prototype.initiateMap = function() {
    // Initiate leaflet map
    var div = this._mapSettings.mapDivName;
    var geocoder = new google.maps.Geocoder();
    var layer = new L.Google('ROADMAP');

    this._mapSettings.map = new L.Map('mapCanvas', {
      center: this._mapSettings.mapCentroid,
      zoom: this._mapSettings.defaultZoom,
      scrollWheelZoom: false,
      tapTolerance: 30
    });

    this._mapSettings.map.addLayer(layer);
}

CartoLib.prototype.addInfoBox = function(mapPosition, divName, text) {
    var text = text || ''
    var info = L.control({position: mapPosition});

    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', divName);
      this._div.innerHTML = text;
      return this._div;
    };

    info.addTo(this._mapSettings.map);
}

CartoLib.prototype.updateInfoBox = function(infoText, divName) {
  $('html').find("div." + divName).html(infoText);
}

CartoLib.prototype.clearInfoBox = function(divName) {
  $('html').find("div." + divName).html('');
}

CartoLib.prototype.createCartoLayer = function() {
  // Input the results from defineSublayer as arguments.
  sublayerArr = []
  for (i = 0; i < arguments.length; i++) {
    sublayerArr.push(arguments[i]);
  }

  var layerOpts = {
    user_name: this._mapSettings.cartodbUserName,
    type: 'cartodb',
    cartodb_logo: false,
    sublayers: sublayerArr
  }

  var createdLayer = cartodb.createLayer(this._mapSettings.map, layerOpts, { https: true });
  return createdLayer;
}

CartoLib.prototype.defineSublayer = function(sqlQuery, cartoCSSId) {

  var layer = {
    sql: sqlQuery,
    cartocss: $(cartoCSSId).html().trim(),
    interactivity: this._mapSettings.fields
  }

  return layer
}

