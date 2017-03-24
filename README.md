# Carto Template
A starter template for building interactive Carto maps.

This template provides an initial point

**[VIEW DEMO](https://datamade.github.io/CartoLib/)**

## Dependencies

This library depends on other JS libraries and resources:

* [jQuery](https://jquery.com/)
* [Carto.JS](https://github.com/CartoDB/cartodb.js/)
* [leaflet-google](http://www.matchingnotes.com/javascripts/leaflet-google.js)
* [Google Maps JavaScrip API](https://developers.google.com/maps/documentation/javascript/tutorial) or [JS - Google Maps](http://maps.google.com/maps/api/js)

We recommend that, at minimum, you download the source files for Carto.JS and leaflet-google, since you may wish to hack leaflet-google to customize the map style (see below). Hosting your files locally - rather than pointing to a CDN - also ensures simplicity and tearless nights, when Carto or Leaflet quietly releases an updated library. Alternatively, you can simply fork or clone this repo (learn more below) and use the included versions of Carto and Leaflet libraries.

## Get started
**Find data. Make a table.**

To populate your interactive map, you need a Carto dataset. You can create a free account and learn about setting up your data on the official [Carto website](https://carto.com/). If you need resources or ideas, consider using the [Chicago Data Portal](https://data.cityofchicago.org/).

**Overview of variables and prototype functions**

The Carto Template employs two JavaScript principles: (1) constructor functionality and (2) prototype patterning, in which an object acquires new properties (functions) through [Object.prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype).

Carto Template uses a constructor function - one of several JS strategies for making reusable objects (similar to a "class," for our OOP readers). We call our constructor function `CartoObj`. CartoObj stores all attributes essential for building a map, such as your Carto table name, username, and fields.

CartoObj can do a lot! It creates maps, adds layers, brokers precise location searches, and so forth. You can find its functions inside `CartoObj.prototype`, an object literal that overrides the original prototype property of CartoObj.

Let's look at some code. What follows describes the project-specific attributes of the constructor function. You need to adjust some of these, but you may also add more, depending on the needs of your project.

```
cartoTableName
```

The name of of your Carto table. Again, you can visit the [Carto website](https://carto.com/) to learn about opening an account and creating a dataset.

```
cartoUserName
```

The username associated with your Carto account.

```
mapDivName
```

The unique id of the div where the map renders. You can find this in index.html. Our template uses `mapCanvas`, but you can call it anything you like.

```
fields
```

An important one! This variable includes the column names from Carto that you want to display somewhere on the site (e.g., in a modal, a text box that displays on hover, etc). A single typo in the `fields` variable will cause your map to crash...silently.

```
mapCentroid
```

The latitude and longitude coordinates of the map's focal point. Here's [one site](http://www.latlong.net/) to help you find the right digits.

```
defaultZoom
```

The default distance away from the mapCentroid. Increase the zoom to get closer; decrease the zoom to move further out.

**Step-by-step instructions**

1. Make a copy of the Carto Template. You can fork this repo or clone it onto your local machine.

  ```bash
  git clone
  ```

2. Open `js/cartoObj.js`. Modify the attributes of CartoObj. You can change the values in the constructor function itself:

  ```
  function CartoObj() {
    ...
    this.cartoTableName = 'exciting_new_dataset',
    ...
  }
  ```

  Or you can change these attributes, after instantiating a new instance of CartoObj:

  ```
  var myCarto = new CartoObj;
  myCarto.cartoTableName = 'exciting_new_dataset';
  ```

  Regardless of the strategy, you need to customize the following: cartoTableName, cartoUserName, fields, and mapCentroid.

3. Add an info window with a generic message or information about the location markers. This info box appears when a user hovers over a marker.

  Create your unique html in the `makeInfoText` function. Add your custom HTML by parsing the data object, for example:

  ```
  var park = "<p><i class='fa fa-map-marker' aria-hidden='true'></i> " + data.park_name + "</p>"
  ```

  Then, adjust its position on the map by passing in parameters to `addInfoBox`. You might try: "bottomleft," "topright," or "topleft.""

4. Define a sublayer or two. You need to define a SQL query (select everything?), the ID name that styles your location markers, e.g. '#carto-result-style' (see below for customizing your location markers), and the interactivity (required to enable hover and click functionality).

  ```
  var layer1 = {
      sql: 'select * from ' + myCarto.cartoTableName,
      cartocss: $('#carto-result-style').html().trim(),
      interactivity: myCarto.fields,
    }
  ```

  You can create as many layers as you like - indeed, experiment with writing different SQL query, or create a new instance of CartoObj to query multiple datasets.


6. Finally, add your layer(s) to the map. Pass in each layer as a parameter to `createCartoLayer`.

  ```
  myCarto.createCartoLayer(layer1, layer2, layer3).addTo(myCarto.map)
  ```

## Add custom styles

You can customize the map itself and the data points that populate it.

#### The map

Open leaflet-google.js, and find the "options" object. Add a property called "mapOptions," and give it any number of elements, for example:

```CSS
mapOptions: {
      backgroundColor: '#dddddd'
    }
```

Locate _initMapObject, and add a styles property within the "map" variable, as such:

```
styles: this.options.mapOptions.styles
```

#### The locations

In the body of the HTML file, add a style tag with a unique id. Inside this, put a CSS selector with styles that customize the appearance of the location markers, for example:

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






