# Carto Template - by DataMade
You want to put your data on a searchable, filterable map. This is a free, open source template using CARTO to help you do it.

**[See the working demo &raquo;](https://carto-template.netlify.com/)**

![Carto Template](https://raw.githubusercontent.com/datamade/CartoTemplate/master/images/carto-template-2.gif)

## Features

* address search (with variable radius and geocomplete)
* results count
* powered by the CARTO mapping platform
* map and list view modes
* large info windows when clicking on a point
* easy customization of hover, popup and table views
* RESTful URLs for sharing searches
* ability to easily add additional search filters (checkboxes, sliders, etc)
* mobile and tablet friendly using responsive design (Bootstrap 4)
* built with HTML, CSS and Javascript - no server side code required

## Dependencies

This template depends on other JS libraries and resources:

* [CartoDB](https://carto.com)
* [Leaflet](https://leafletjs.com)
* [jQuery 3.3.1](https://jquery.com/)
* [jQuery Address](https://github.com/asual/jquery-address)
* [Bootstrap 4](https://getbootstrap.com/)
* [Moment.js](https://momentjs.com/)


## Setup

Follow the steps below and you'll be in business with your own map. Instructions coming soon.

## MapsLib options

You can configure your map by passing in a dictionary of options when you call the `CartoDbLib.initialize` function in `/js/map.js`. Here's an example:

```javascript
CartoDbLib.initialize({
    map_centroid: [41.85754, -87.66231],
    defaultZoom:  11,
    layerUrl:     'https://datamade.carto.com/api/v2/viz/3d861410-d645-4c10-a19d-ef01c1135441/viz.json',
    tableName:    'flu_shot_locations_2014_present_2019_2020_season',
    userName:     'datamade',
    fields :      'cartodb_id, the_geom, cost, facility_name, hours phone, street1, street2, city, state, url',
    listOrderBy: 'facility_name',
    googleApiKey: 'AIzaSyBhlf7Ayk_8nYYW5siUMTXXwvI-A6va_m0',
    recordName: 'flu shot location',
    recordNamePlural: 'flu shot locations',
    radius: 1610,
  });
```

| Option           | Default value           | Notes                                                                                                                                               |
|------------------|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| map_centroid     | [41.881832, -87.623177] | Center [latitude, longitude] that your map shows when it loads. Defaults to Chicago.                                                                |
| defaultZoom      | 11                      | Default zoom level when map is loaded (bigger is more zoomed in).                                                                                   |
| searchRadius     | 805                     | Default search radius. Defined in meters. Default is 1/2 mile.                                                                                      |
| layerUrl         |                         | The visualization layer from CARTO. It should look like this: `https://datamade.carto.com/api/v2/viz/3d861410-d645-4c10-a19d-ef01c1135441/viz.json` |
| tableName        |                         | The table in CARTO containing your map data                                                                                                         |
| userName         |                         | Your CARTO user name.                                                                                                                               |
| fields           |                         | A comma separated list of fields in your CARTO table that you want available for the map. You must include at minimum `cartodb_id` and `the_geom`   |
| recordName       | record                  | Used for showing the count of results.                                                                                                              |
| recordNamePlural | records                 |                                                                                                                                                     |
| listOrderBy      |                         | Optional. The field in which you want the list results to be sorted. Supports appending DESC for descending order.                                  |                                                       |


## Resources

Coming soon.

## Common issues/troubleshooting

If your map isn't displaying any data, try the following:

1. Use the [Chrome developer console](https://developers.google.com/chrome-developer-tools/docs/console) or install [Firebug](http://getfirebug.com/) for FireFox. This will  do
you to debug your javascript.
1. Load your map in the browser and open the javascript console 
   * Chrome developer console on a Mac: Option+Command+J
   * Chrome developer console on a PC: Control+Shift+J
   * Firebug in Firefox: Tools => Web Developer => Firebug => Open Firebug) 
1. If you do see javascript errors:
   * The error will tell you what line it is failing on. Best to start by going there!
   * Columns in CARTO are converted to lower case with underscores (`First Name` => `first_name`), so make sure they are correct.

## Errors and Bugs

If something is not behaving intuitively, it is a bug, and should be reported.
Report it here: https://github.com/datamade/CartoTemplate/issues
