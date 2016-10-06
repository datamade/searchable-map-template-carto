// Define the function that creates the library object.
function CartoLib() {
  // A variable of default settings, accessible to public. Functions below can update these settings.
  this.mapSettings = {
    cartodbTableName: '',
    cartodbUserName: '',
    locationScope: 'chicago',
    mapDivName: '',
    map: null,
    mapCentroid: new L.LatLng(41.7872, -87.6345),
    defaultZoom: 14,
    lastClickedLayer: null,
    geojson: null,
    fields: ''
  };

  // Functions to update settings.
  this.setTableName = function(name) {
    this.mapSettings.cartodbTableName = name;
  };

  this.setUserName = function(name) {
    this.mapSettings.cartodbUserName = name;
  };

  this.setFields = function(fields) {
    this.mapSettings.fields = fields;
  };

  this.setMapDivName = function(name) {
    this.mapSettings.mapDivName = name;
  };

  this.setCentroid = function(latitude, longitude) {
    this.mapSettings.mapCentroid = new L.LatLng(latitude, longitude);
  };

  this.setDefaultZoom = function(zoom) {
    this.mapSettings.defaultZoom = zoom;
  };

}

// Define the behaviors that the library object has.
CartoLib.prototype.initiateMap = function() {
    // Initiate leaflet map
    var div = this.mapSettings.mapDivName;
    var geocoder = new google.maps.Geocoder();
    var layer = new L.Google('ROADMAP');

    this.mapSettings.map = new L.Map('mapCanvas', {
      center: this.mapSettings.mapCentroid,
      zoom: this.mapSettings.defaultZoom,
      scrollWheelZoom: false,
      tapTolerance: 30
    });

    this.mapSettings.map.addLayer(layer);
}

CartoLib.prototype.addInfoBox = function(mapPosition, divName, text) {
    var text = text || ''
    var info = L.control({position: mapPosition});

    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', divName);
      this._div.innerHTML = text;
      return this._div;
    };

    info.addTo(this.mapSettings.map);
}

CartoLib.prototype.updateInfoBox = function(data, divName) {
  if (data) {
    var infoText = 'Example text. Data goes here.'
    // Create custom HTML based on data given.

    // Update the particular div.
    $('html').find("div." + divName).html(infoText);
  }
}

CartoLib.prototype.clearInfoBox = function(divName) {
  $('html').find("div." + divName).html('');
}

CartoLib.prototype.createCartoLayer = function() {
  sublayerArr = []

  // Input the results from defineSublayer as arguments.
  for (i = 0; i < arguments.length; i++) {
    sublayerArr.push(arguments[i]);
  }

  var layerOpts = {
    user_name: this.mapSettings.cartodbUserName,
    type: 'cartodb',
    cartodb_logo: false,
    sublayers: sublayerArr
  }

  var mapName = "#" + this.mapSettings.mapDivName + " div"

  cartodb.createLayer(this.mapSettings.map, layerOpts, { https: true })
    .addTo(this.mapSettings.map)
    .done(function(layer) {
      // Add actions for each sublayer: featureOver, featureOut, featureClick.
      // EXAMPLE:
      // layerZero = layer.getSubLayer(0);
      // layerZero.setInteraction(true);

      // layerZero.on('featureOver', function(data) {
      //   $(mapName).css('cursor','pointer');
      //   CartoLib.prototype.updateInfoBox(data, "infoBox");
      // });
      // layerZero.on('featureOut', function() {
      //   $(mapName).css('cursor','inherit');
      //   CartoLib.prototype.clearInfoBox("infoBox");
      // });
      // layerZero.on('featureClick', function(data){
      //   // Add something here, e.g., a modal window.
      // });
    }).error(function(e) {
      console.log(e)
    });
}

CartoLib.prototype.defineSublayer = function(sqlQuery, cartoCSSId) {

  var layer = {
    sql: sqlQuery,
    cartocss: $(cartoCSSId).html().trim(),
    interactivity: this.mapSettings.fields
  }

  return layer
}

// Driver code
var map = new CartoLib
map.setTableName('large_lots_citywide_expansion_data');
map.setUserName('datamade');
map.setFields('pin');
map.setMapDivName('mapCanvas');
map.setDefaultZoom(12);
map.setCentroid(41.7872, -87.6345)
map.initiateMap()
map.addInfoBox('bottomright', 'infoBox')
var layer1 = map.defineSublayer("select * from large_lots_citywide_expansion_data", '#carto-result-style');
map.createCartoLayer(layer1)


