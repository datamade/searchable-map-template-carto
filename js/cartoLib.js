// Wrap library inside IFFE for safe variable scoping.
CartoLib = (function() {
// Declaration of CartoLib function.
  function CartoLib() {
    // Quick variable reference to map settings.
    this.cartoTableName   = '';
    this.cartoUserName    = '';
    this.locationScope    = 'chicago';
    this.mapDivName       = '';
    this.map              = null;
    this.mapCentroid      = new L.LatLng(41.901557, -87.630360),
    this.defaultZoom      = 11;
    this.lastClickedLayer = null;
    this.geojson          = null;
    this.fields           = '';
    this.currentPinpoint  = '';
    this.centerMark       = '';
    this.radiusCircle     = '';
    // Create geocoder object to access Google Maps API. Add underscore to insure variable safety.
    this._geocoder      = new google.maps.Geocoder();
    // Turn on autocomplete to predict address when user begins to type.
    this._autocomplete  = new google.maps.places.Autocomplete(document.getElementById('search-address'));
  }

  // Give CartoLib its behaviors.
  CartoLib.prototype.initiateMap = function() {
      // Initiate leaflet map
      var div = this.mapDivName;
      // var geocoder = new google.maps.Geocoder();
      var layer = new L.Google('ROADMAP');

      this.map = new L.Map('mapCanvas', {
        center: this.mapCentroid,
        zoom: this.defaultZoom,
        scrollWheelZoom: false,
        tapTolerance: 30
      });

      this.map.addLayer(layer);
  }

  CartoLib.prototype.addInfoBox = function(mapPosition, divName, text) {
      var text = text || ''
      var info = L.control({position: mapPosition});

      info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', divName);
        this._div.innerHTML = text;
        return this._div;
      };

      info.addTo(this.map);
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
      user_name: this.cartoUserName,
      type: 'cartodb',
      cartodb_logo: false,
      sublayers: sublayerArr
    }

    var createdLayer = cartodb.createLayer(this.map, layerOpts, { https: true });
    return createdLayer;
  }

  CartoLib.prototype.defineSublayer = function(sqlQuery, cartoCSSId) {

    var layer = {
      sql: sqlQuery,
      cartocss: $(cartoCSSId).html().trim(),
      interactivity: this.fields
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

    this.map.setView(new L.LatLng( this.currentPinpoint[0], this.currentPinpoint[1] ), zoom)
  }

  CartoLib.prototype.doSearch = function() {
    this.clearSearch();

    var cartoLib = this;
    // #search-address refers to a div id in map-example.html. You can rename this div.
    var address = $("#search-address").val();
    var radius = $("#search-radius").val();
    var location = this.locationScope;

    if (radius == null && address != "") {
      radius = 8050;
    }

    if (address != "") {
      this._geocoder.geocode( { 'address': address }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
         cartoLib.currentPinpoint = [results[0].geometry.location.lat(), results[0].geometry.location.lng()];
          var geoSearch = "ST_DWithin(ST_SetSRID(ST_POINT(" + cartoLib.currentPinpoint[1] + ", " + cartoLib.currentPinpoint[0] + "), 4326)::geography, the_geom::geography, " + radius + ")";
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
    this.centerMark = new L.Marker(this.currentPinpoint, {
      icon: (new L.Icon({
        iconUrl: 'push_pin.png',
        iconSize: [30, 30],
        iconAnchor: [10, 32]
        })
      )
    });

    this.centerMark.addTo(this.map);
  }

  CartoLib.prototype.addCircle = function(radius) {
    this.radiusCircle = new L.circle(this.currentPinpoint, radius, {
        fillColor:'#1d5492',
        fillOpacity:'0.2',
        stroke: false,
        clickable: false
    });

    this.radiusCircle.addTo(this.map);
  }

  CartoLib.prototype.clearSearch = function() {
    if (this.centerMark)
      this.map.removeLayer(this.centerMark);
    if (this.radiusCircle)
      this.map.removeLayer(this.radiusCircle);
  }

  return CartoLib;
})();
