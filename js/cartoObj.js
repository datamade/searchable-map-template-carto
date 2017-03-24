$(function() {

  function CartoObj() {
    this.cartoTableName   = 'parks_public_art';
    this.cartoUserName    = 'datamade';
    this.mapDivName       = 'mapCanvas';
    this.fields           = 'art, artist, park_name';
    this.mapCentroid      = new L.LatLng(41.901557, -87.630360);
    this.defaultZoom      = 11;
    this.map              = null;
    this.lastClickedLayer = null;
    this.geojson          = null;
    this.currentPinpoint  = '';
    this.centerMark       = '';
    this.radiusCircle     = '';
    // Create geocoder object to access Google Maps API. Add underscore to insure variable safety.
    this._geocoder      = new google.maps.Geocoder();
    // Turn on autocomplete to predict address when user begins to type.
    this._autocomplete  = new google.maps.places.Autocomplete(document.getElementById('search-address'));
  }

  CartoObj.prototype = {
    constructor: CartoObj,
    initiateMap: function() {
      // Initiate leaflet map
      var div = this.mapDivName;
      var layer = new L.Google('ROADMAP');

      this.map = new L.Map('mapCanvas', {
        center: this.mapCentroid,
        zoom: this.defaultZoom,
        scrollWheelZoom: false,
        tapTolerance: 30
      });

      this.map.addLayer(layer);
    },

    addInfoBox: function(mapPosition, divName, text) {
      var text = text || ''
      var info = L.control({position: mapPosition});

      info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', divName);
        this._div.innerHTML = text;
        return this._div;
      };

      info.addTo(this.map);
    },

    updateInfoBox: function(infoText, divName) {
      $('html').find("div." + divName).html(infoText);
    },

    clearInfoBox: function(divName) {
      $('html').find("div." + divName).html('');
    },

    createCartoLayer: function() {
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
    },

    setZoom: function(radius) {
      var zoom = '';
      if (radius >= 8050) zoom = 12; // 5 miles
      else if (radius >= 3220) zoom = 13; // 2 miles
      else if (radius >= 1610) zoom = 14; // 1 mile
      else if (radius >= 805) zoom = 15; // 1/2 mile
      else if (radius >= 400) zoom = 16; // 1/4 mile
      else zoom = 16;

      this.map.setView(new L.LatLng( this.currentPinpoint[0], this.currentPinpoint[1] ), zoom)
    },

    doSearch: function() {
      this.clearSearch();
      var cartoLib = this;
      // #search-address refers to a div id in map-example.html. You can rename this div.
      var address = $("#search-address").val();
      var radius = $("#search-radius").val();

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
    },

    addIcon: function() {
      this.centerMark = new L.Marker(this.currentPinpoint, {
        icon: (new L.Icon({
          iconUrl: 'push_pin.png',
          iconSize: [30, 30],
          iconAnchor: [10, 32]
          })
        )
      });

      this.centerMark.addTo(this.map);
    },

    addCircle: function(radius) {
      this.radiusCircle = new L.circle(this.currentPinpoint, radius, {
          fillColor:'#1d5492',
          fillOpacity:'0.2',
          stroke: false,
          clickable: false
      });

      this.radiusCircle.addTo(this.map);
    },

    clearSearch: function() {
      if (this.centerMark)
        this.map.removeLayer(this.centerMark);
      if (this.radiusCircle)
        this.map.removeLayer(this.radiusCircle);
    },

    // Customize this!
    makeInfoText: function(data) {
      var artist = ''
      var work = "<h3> " + data.art + "</h3>"
      var park = "<p><i class='fa fa-map-marker' aria-hidden='true'></i> " + data.park_name + "</p>"

      if (data.artist.trim() != '') {
        artist = "<p><i class='fa fa-user' aria-hidden='true'></i> " + data.artist + "</p>"
      }

      var html = work + artist + park

      return html
    },

  }

  // Create a new instance of the CartoObj, and then call functions.
  var myCarto = new CartoObj

  myCarto.initiateMap()
  myCarto.addInfoBox('bottomright', 'infoBox');

  // Create layers.
  var layer1 = {
      sql: 'select * from ' + myCarto.cartoTableName,
      cartocss: $('#carto-result-style').html().trim(),
      interactivity: myCarto.fields,
    }

  // Then, add these layers to your map, and enable interactivity.
  myCarto.createCartoLayer(layer1).addTo(myCarto.map)
    .done(function(layer) {
        var mapName = "#" + myCarto.mapDivName + " div"
        layerZero = layer.getSubLayer(0);
        layerZero.setInteraction(true);
        layerZero.on('featureOver', function(e, latlng, pos, data, subLayerIndex) {
          $(mapName).css('cursor','pointer');
          // Remember: add custom text to the info window.
          var text = myCarto.makeInfoText(data);
          myCarto.updateInfoBox(text, "infoBox");
        });
        layerZero.on('featureOut', function() {
          $(mapName).css('cursor','inherit');
          myCarto.clearInfoBox("infoBox");
        });
        layerZero.on('featureClick', function(e, latlng, pos, data, subLayerIndex){
          // You can add something here, too, e.g., a modal window.
        });
    }).error(function(e) {
      console.log(e)
    });

    $("#btnSearch").on("click", function() {
      myCarto.doSearch();
    });
});

