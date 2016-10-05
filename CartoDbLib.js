// 'use strict';

// Define the function that creates the library object.

function CartoDbLib() {

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
CartoDbLib.prototype.init = function() {

}

CartoDbLib.prototype.initiateMap = function() {
    // Unneeded style nonsense.
    var google_map_styles = [
        {
          stylers: [
            { saturation: -100 },
            { lightness: 40 }
          ]
        }
      ];


    // Initiate leaflet map
    var div = this.mapSettings.mapDivName;
    var geocoder = new google.maps.Geocoder();
    // var layer = new L.Google('ROADMAP');
    var layer = new L.Google('ROADMAP', {mapOptions: {styles: google_map_styles}
    });

    this.mapSettings.map = new L.Map('mapCanvas', {
      center: this.mapSettings.mapCentroid,
      zoom: this.mapSettings.defaultZoom,
      scrollWheelZoom: false,
      tapTolerance: 30
    });

    this.mapSettings.map.addLayer(layer);
}

CartoDbLib.prototype.addInfoBox = function(mapPosition, divName) {
    var info = L.control({position: mapPosition});

    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', divName);
      return this._div;
    };

    info.addTo(this.mapSettings.map);
}

CartoDbLib.prototype.updateInfoBox = function(divName, text) {
  divThis = $('html').find("div." + divName);
  $(divThis).html(text);
}

CartoDbLib.prototype.createCartoLayer = function() {
  sublayerArr = []

  for (i = 0; i < arguments.length; i++) {
    sublayerArr.push(arguments[i]);
  }

  // Yes, it queries large_lots!
  var sql = new cartodb.SQL({ user: 'datamade' });
  sql.execute("select * from large_lots_citywide_expansion_data")
  .done(function(listData) {
        var obj_array = listData.rows;
        console.log(listData.rows.length)
  });


  var layerOpts = {
    // user_name: this.mapSettings.cartodbUserName,
    user_name: 'datamade',
    type: 'cartodb',
    cartodb_logo: false,
    sublayers: [
      {
        sql: "select * from large_lots_citywide_expansion_data",
        cartocss: $('#applied-styles').html().trim(),
        interactivity: this.mapSettings.fields
      }
    ]
  }

  // cartodb.createLayer(this.mapSettings.map, layerOpts, { https: true }).on('done', function(){
  //   console.log('we dit it')
  // })

  // this.mapSettings.map.addLayer(lay);
  //   .done(function(layer){
  //     console.log("done!")
  //     sublayer = layer.getSubLayer(0)
  //     sublayer.setInteraction(true);

  //     sublayer.on('featureOver', function(e, latlng, pos, data, subLayerIndex){
  //       console.log("over")
  //     });

  //   })


  // Possible alternative: Try to break it up.
  // var lay = cartodb.createLayer(this.mapSettings.map, layerOpts);

  // var thingMap = this.mapSettings.map

  // $.when(lay).done(function(lay){
  //   lay.addTo(thingMap);
  //   console.log("done!!")
  // });


  cartodb.createLayer(this.mapSettings.map, layerOpts, { https: true })
    .addTo(this.mapSettings.map)
    .done(function() {

    })
}

CartoDbLib.prototype.defineSublayer = function(sqlQuery, cartoCSSId) {

  var layer = {
    sql: sqlQuery,
    cartocss: $(cartoCSSId).html().trim(),
    interactivity: this.mapSettings.fields
  }

  return layer
}

// Driver code
var map = new CartoDbLib
map.setTableName('large_lots_citywide_expansion_data');
map.setUserName('datamade');
map.setFields('pin');
map.setMapDivName('mapCanvas');
map.setDefaultZoom(12);
map.setCentroid(41.7872, -87.6345)
map.initiateMap()
map.addInfoBox('bottomleft', 'infoBox')
map.updateInfoBox('infoBox', '<p>This is some text</p>')
var layer1 = map.defineSublayer("select * from large_lots_citywide_expansion_data", '#applied-styles');
map.createCartoLayer(layer1)


