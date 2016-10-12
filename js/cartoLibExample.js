$(function() {
  // Autocomplete when user searches for an address.
  var autocomplete = new google.maps.places.Autocomplete(document.getElementById('search-address'));
  // Create example object.
  var exMap = new CartoLib
  // Update map settings.
  exMap.cartoTableName  = 'chicago_libraries_2016';
  exMap.cartoUserName   = 'datamade';
  exMap.fields          = 'full_address, name, hours_of_operation, phone';
  exMap.mapDivName      = 'mapCanvas';
  // Create a map!
  exMap.initiateMap()
  exMap.addInfoBox('bottomright', 'infoBox');
  var layer1 = exMap.defineSublayer("select * from chicago_libraries_2016", '#carto-result-style');
  // Custom code.
  exMap.createCartoLayer(layer1).addTo(exMap.map)
      .done(function(layer) {
        var mapName = "#" + exMap.mapDivName + " div"

        layerZero = layer.getSubLayer(0);
        layerZero.setInteraction(true);
        layerZero.on('featureOver', function(e, latlng, pos, data, subLayerIndex) {
          $(mapName).css('cursor','pointer');
          // Add custom text to the info window.
          var text = makeInfoText(data);
          CartoLib.prototype.updateInfoBox(text, "infoBox");
        });
        layerZero.on('featureOut', function() {
          $(mapName).css('cursor','inherit');
          CartoLib.prototype.clearInfoBox("infoBox");
        });
        layerZero.on('featureClick', function(e, latlng, pos, data, subLayerIndex){
          // You can add something here, too, e.g., a modal window.
          getOneParcel(data.full_address, exMap.map)
        });
      }).error(function(e) {
        console.log(e)
      });

      $("#btnSearch").on("click", function() {
        exMap.doSearch();
      });
});

// Build this custom function yourself. It should format data from your Carto map into HTML.
function makeInfoText(data) {
  var name = "<h4>" + data.name + "</h4>"
  var address = "<p><i class='fa fa-map-marker' aria-hidden='true'></i> " + data.full_address + "</p>"
  var hours = "<p><i class='fa fa-calendar' aria-hidden='true'></i> " + data.hours_of_operation + "</p>"
  var phone = "<p><i class='fa fa-phone' aria-hidden='true'></i> " + data.phone + "</p>"
  var html = name + address + hours + phone

  return html
};

// Build this custom funciton yourself. It will outline a parcel on the map, when clicked.
function getOneParcel(full_address, map) {
      // if (LargeLots.lastClickedLayer){
      //   LargeLots.map.removeLayer(LargeLots.lastClickedLayer);
      // }
      var address = String(full_address)
      var sql = new cartodb.SQL({user: 'datamade', format: 'geojson'});
      console.log(sql)
      console.log(full_address)
      sql.execute("select * from chicago_libraries_2016 where full_address='" + address + "'")
        .done(function(data){
            var shape = data.features[0];
            console.log(shape)
            // CartoLib.lastClickedLayer = L.geoJson(shape);
            L.geoJson(shape).addTo(map);
            // CartoLib.lastClickedLayer.addTo(map);
            // CartoLib.lastClickedLayer.setStyle({fillColor:'#f7fcb9', weight: 2, fillOpacity: 1, color: '#000'});
            // LargeLots.map.setView(LargeLots.lastClickedLayer.getBounds().getCenter(), 17);
      //       LargeLots.selectParcel(shape.properties);
        }).error(function(e){console.log(e)});
      // window.location.hash = 'browse';

  }


