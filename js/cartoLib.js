function CartoLib() {
  this._mapSettings = {
    cartoTableName: '',
    cartoUserName: '',
    locationScope: 'chicago',
    mapDivName: '',
    map: null,
    mapCentroid: new L.LatLng(41.901557, -87.630360),
    defaultZoom: 11,
    lastClickedLayer: null,
    geojson: null,
    fields: '',
    currentPinpoint: '',
  };

  this._geocoder = new google.maps.Geocoder();
  this._centerMark = '';
  this._radiusCircle = '';

  // Functions to update settings.
  this.setTableName = function(name) {
    this._mapSettings.cartoTableName = name;
  };

  this.setUserName = function(name) {
    this._mapSettings.cartoUserName = name;
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
    // var geocoder = new google.maps.Geocoder();
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
    user_name: this._mapSettings.cartoUserName,
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

CartoLib.prototype.setZoom = function(radius) {
  var zoom = '';
  if (radius >= 8050) zoom = 12; // 5 miles
  else if (radius >= 3220) zoom = 13; // 2 miles
  else if (radius >= 1610) zoom = 14; // 1 mile
  else if (radius >= 805) zoom = 15; // 1/2 mile
  else if (radius >= 400) zoom = 16; // 1/4 mile
  else zoom = 16;

  this._mapSettings.map.setView(new L.LatLng( this._mapSettings.currentPinpoint[0], this._mapSettings.currentPinpoint[1] ), zoom)
}

CartoLib.prototype.doSearch = function() {
  this.clearSearch();

  var cartoLib = this;
  // #search-address refers to a div id in map-example.html. You can rename this div.
  var address = $("#search-address").val();
  var radius = $("#search-radius").val();
  var location = this._mapSettings.locationScope;

  if (radius == null && address != "") {
    radius = 8050;
  }

  if (address != "") {
    this._geocoder.geocode( { 'address': address }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
       cartoLib._mapSettings.currentPinpoint = [results[0].geometry.location.lat(), results[0].geometry.location.lng()];
        var geoSearch = "ST_DWithin(ST_SetSRID(ST_POINT(" + cartoLib._mapSettings.currentPinpoint[1] + ", " + cartoLib._mapSettings.currentPinpoint[0] + "), 4326)::geography, the_geom::geography, " + radius + ")";
        var whereClause = " WHERE the_geom is not null AND " + geoSearch;

        cartoLib.setZoom(radius);
        cartoLib.addIcon();
        cartoLib.addCircle(radius);
      }
      else {
        alert("We could not find your address: " + status);
      }
    });
  }
}

CartoLib.prototype.addIcon = function() {
  this._centerMark = new L.Marker(this._mapSettings.currentPinpoint, {
    icon: (new L.Icon({
      iconUrl: 'push_pin.png',
      iconSize: [30, 30],
      iconAnchor: [10, 32]
      })
    )
  });

  this._centerMark.addTo(this._mapSettings.map);
}

CartoLib.prototype.addCircle = function(radius) {
  this._radiusCircle = new L.circle(this._mapSettings.currentPinpoint, radius, {
      fillColor:'#1d5492',
      fillOpacity:'0.2',
      stroke: false,
      clickable: false
  });

  this._radiusCircle.addTo(this._mapSettings.map);
}

CartoLib.prototype.clearSearch = function() {
  if (this._centerMark)
    this._mapSettings.map.removeLayer( this._centerMark );
  if (this._radiusCircle)
    this._mapSettings.map.removeLayer( this._radiusCircle );
}
