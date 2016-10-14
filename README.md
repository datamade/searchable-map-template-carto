# CartoLib
A JavaScript library for building interactive Carto maps.

**[VIEW DEMO](https://datamade.github.io/CartoLib/)**

## Dependencies

This library depends on other JS libraries and resources:

* [jQuery](https://jquery.com/)
* [Carto.JS](https://github.com/CartoDB/cartodb.js/)
* [leaflet-google](http://www.matchingnotes.com/javascripts/leaflet-google.js)
* [Google Maps JavaScrip API](https://developers.google.com/maps/documentation/javascript/tutorial) or [JS - Google Maps](http://maps.google.com/maps/api/js)

We recommend that, at minimum, you download the source file for Carto.JS and leaflet-google, since you may wish to hack leaflet-google to customize the map style (see below).

## Get started
**Find data. Make a table.**

To populate your interactive map, you need a Carto data table. You can create a free account and learn about setting up your data on the official [Carto website](https://carto.com/). If you need resources or ideas, consider using the [Chicago Data Portal](https://data.cityofchicago.org/).

**Step-by-step instructions**

1. Add the CartoLib.js file to your project, and in a file of your choosing, instantiate a CartoLib object.

  ```
  var exMap = new CartoLib
  ```

2. Update the mapSettings. You can directly adjust the settings in CartoLib.js, or you can do so by updating the variables individually. At the very least, you need to set the cartoTableName, cartoUserName, and fields to match those of your unique Carto account. (Note: the fields refer to columns in the Carto table.)

  ```
  exMap.cartoTableName = 'chicago_libraries_2016';
  ```

3. Initiate a new map. This function creates a map, centered on the given latitude and longitude coordinates. You can use [LatLong.net](http://www.latlong.net/) to identify the coordinates that work for your map.

  ```
  exMap.initiateMap()
  ```

4. Add an info window, which can contain a generic message or information about the location markers. (For strategies to get location information, see the custom makeInfoText function in cartoLibExample.js.)

  ```
  exMap.addInfoBox('bottomright', 'infoBox')
  ```

5. Now, you are ready to define a sublayer! You need two parameters to do so: a SQL query and the ID name that styles your location markers, e.g. '#carto-result-style' (see below for customizing your location markers).

  ```
  var layer1 = exMap.defineSublayer("select * from large_lots_citywide_expansion_data", '#carto-result-style');
  ```

6. Finally, create the layer by querying Carto, and add it to the map.

  ```
  exMap.createCartoLayer(layer1).addTo(exMap._mapSettings.map)
  ```

  You can add feature events, for example, a hover feature that adds data to the info window.

## Add custom code

To render a custom map you need to add additional code, depending on the data that comes from Carto.

**updateInfoBox**

This function adds content to the info window on the map. Add your custom HTML by parsing the data object, for example:

```
infoText += "<p>Organzation name: " + data.prop_name + "</p>";
```

You can find one strategy for creating HTML in the makeInfoText in cartoLibExample.js. (Note: "prop_name" refers to the columns defined in "fields" in this._mapSettings.)

**createCartoLayer**

This function adds sublayers with location markers, taken from your Carto query. After adding a sublayer to your map, you can also create feature events, such as hover and click events. It is here that you can call your unique updateInfoBox functions.

## Add custom styles

You can customize the map itself and the data points that populate it.

#### The map

Open leaflet-google.js, and find the "options" object. Add a property called "mapOptions," and give it any number of elements, for example:

```CSS
mapOptions: {
      backgroundColor: '#dddddd'
    }
```

Locate _iniMapObject, and add a styles property within the "map" variable, as such:

```
styles: this.options.mapOptions.styles
```

#### The locations

In the body of he HTML file, add a style tag with a unique id. Inside this, put a CSS selector with styles that customize the appearance of the location markers, for example:

```CSS
<style id="carto-result-style">
    #carto-result {
      marker-fill-opacity: 0.9;
      marker-line-color: #FFF;
      marker-line-width: 1;
      marker-line-opacity: 1;
      marker-placement: point;
      marker-type: ellipse;
      marker-width: 8;
      marker-fill: #3E7BB6;
      marker-allow-overlap: true;
    }
</style>
```

## Errors and Bugs

If something is not behaving intuitively, it is a bug, and should be reported.
Report it here: https://github.com/datamade/CartoLib/issues






