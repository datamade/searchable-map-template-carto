# CartoLib
A JavaScript library for building interactive Carto maps.

## Dependencies

This library depends on other JS libraries and resources:

* [jQuery](https://jquery.com/)
* [Carto.JS](https://github.com/CartoDB/cartodb.js/)
* [leaflet-google](http://www.matchingnotes.com/javascripts/leaflet-google.js)
* [Google Maps JavaScrip APi](https://developers.google.com/maps/documentation/javascript/tutorial) or [JS - Google Maps](http://maps.google.com/maps/api/js)

We reccomend that, at minimum, you download the source file for Carto.JS and leaflet-google, since you may wish to hack leaflet-google to customize the map style (see below).

## Get started

## Add custom code

Some functions require customization, depending on the data that comes from Carto.

**updateInfoBox**
This function adds content to the info window on the map. Add your custom HTML by parsing the data object, for example:

```
infoText += "<p>Subheader: " + data.prop_name + "</p>";
```

**createCartoLayer**
This function adds sublayers with location markers, taken from your Carto query. After adding a sublayer to your map, you can also create feature events, such as hover and click events. It is here that you can call your unique updateInfoBox functions.

## Add custom styles

You can customize the map itself and the data points that populate it.

#### The map

Open leaflet-google.js, and find the "options" object. Add a property called "mapOtions," and give it any number of elements, for example:

```
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

```
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








