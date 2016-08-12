var commutermap = L.map('mapwindow').setView([39.0997, -94.5786], 11);

//Create the base map layer (info from trial MapBox account)

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'j0315chuman.13gnc83h',
    accessToken: 'pk.eyJ1IjoiajAzMTVjaHVtYW4iLCJhIjoiY2lycXNoYzE3MGdxenQybmtqcWRzdGNpeSJ9.Ah6sO3hIVTZuJjh2PSr04w'
}).addTo(commutermap);

var km2 = "/km<sup>2</sup>";
var legendTypes = [{ID:1, property:"pop-commute-drive_alone", text:"Solo Drivers", byarea:false},
					{ID:2, property:"pop-commute-drive_alone", text:"Solo Drivers" + km2, byarea:true},
				    {ID:3, property:"pop-commute-drive_carpool", text:"Carpool Commuters", byarea:false},
					{ID:4, property:"pop-commute-drive_carpool", text:"Carpool Commuters" + km2, byarea:true},
				    {ID:5, property:"pop-commute-public_transit", text:"Public Transit Riders", byarea:false},
					{ID:6, property:"pop-commute-public_transit", text:"Public Transit Riders" + km2, byarea:true},
				    {ID:7, property:"pop-commute-walk", text:"Walkers", byarea:false},
				    {ID:8, property:"pop-commute-walk", text:"Walkers" + km2, byarea:true}
				    ];
var levels = getGrades(1000);


function getGrades(max){ //get an array of seven levels (to adjust the area highlighting for data with different ranges of interest)
	return [0, max*0.01, max*0.02, max*0.05, max*0.1, max*0.2, max*0.5, max]
}
 
// colors and comparisons for highlighting tracts based on commuter stats
function getColor(d) {
	
    return d > levels[7] ? '#4d0f1f' :
		   d > levels[6] ? '#800026' :
           d > levels[5] ? '#BD0026' :
           d > levels[4] ? '#E31A1C' :
           d > levels[3] ? '#FC4E2A' :
           d > levels[2] ? '#FD8D3C' :
           d > levels[1] ? '#FEB24C' :
            '#FED976' ;
}

// for highlighting tracts based on commuter stats
function style(feature) {
	
	var f_c;
	
	if (legendTypes[0].byarea){
		f_c = getColor((feature.properties[legendTypes[0].property] / feature.properties["area"] )* 1000000);
	} else{
		f_c = getColor(feature.properties[legendTypes[0].property]);
	}
	
    return {
        fillColor: f_c,
        weight: 1,
        opacity: 1,
        color: 'black',
        fillOpacity: 0.7
    };
}
// for highlighting tracts based on commuter stats
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: 'white',
        fillOpacity: 0.8
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
	
	info.update(layer.feature.properties);
}

// for highlighting tracts based on commuter stats
function resetHighlight(e) {
    geojson_t.resetStyle(e.target);
	geojson_n.resetStyle(e.target);
	info.update();
}

// This might end up doing nothing
function  panToFeature(e) {
    var props = e.target.feature.properties;
	var html = "<div class='detail_head'>" + getAreaName(props.shid) + " <em><h5> Area: " + props["area"] + ' m<sup>2</sup> </h5></em></div> ';
	
	html += '<div class="stat_container"><h5>Drive Alone: </h5><h6>' + props["pop-commute-drive_alone"] +
		stat_bar(props["pop-commute-drive_alone"]) + '%"></div></div>' +
			'<div class="stat_container"><h5>Carpool: </h5><h6>'+ props["pop-commute-drive_carpool"] +
		stat_bar(props["pop-commute-drive_carpool"]) + '%"></div></div>' +
			'<div class="stat_container"><h5>Public Transit: </h5><h6>' + props["pop-commute-public_transit"] + 	
		stat_bar(props["pop-commute-public_transit"]) + '%"></div></div>' +
			'<div class="stat_container"><h5>Walk: </h5><h6>' + props["pop-commute-walk"] + 
		stat_bar(props["pop-commute-walk"]) + '%"></div></div>';
	html += '<div class="stat_container"><h5>Drive Alone (per square km): </h5><h6>' + Math.round((props["pop-commute-drive_alone"] / props["area"]) * 1000000) +
		stat_bar((props["pop-commute-drive_alone"] / props["area"]) * 1000000) + '%"></div></div>' +
			'<div class="stat_container"><h5>Carpool (per square km): </h5><h6>'+ Math.round((props["pop-commute-drive_carpool"] / props["area"]) * 1000000) +
		stat_bar((props["pop-commute-drive_carpool"] / props["area"]) * 1000000) + '%"></div></div>' +
			'<div class="stat_container"><h5>Public Transit (per square km): </h5><h6>' + Math.round((props["pop-commute-public_transit"] / props["area"]) * 1000000) + 	
		stat_bar((props["pop-commute-public_transit"] / props["area"]) * 1000000) + '%"></div></div>' +
			'<div class="stat_container"><h5>Walk (per square km): </h5><h6>' + Math.round((props["pop-commute-walk"] / props["area"] )*1000000) + 
		stat_bar((props["pop-commute-walk"] / props["area"] )*1000000) + '%"></div></div>';
	html += 
   $('#detail').html(html);
}

//this is really last-minute and messy. (for use with above function)
function stat_bar(amt){
	html = '</h6><br/>';
 	barwidth = 1500;
	while (amt > barwidth){
		amt -= barwidth;
		html += '<div class="stat_bar" style="width:100%"></div><br/> '
	}
	statwidth = (amt/barwidth) * 100;
	html += '<div class="stat_bar" style="width: ' + statwidth ;
	return html;
}

//bind data, style, and event handlers to features (the two geoJson layers are for the two data sets)
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: panToFeature
    });
}

var geojson_t = L.geoJson(tracts_data, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(commutermap);

var geojson_n = L.geoJson(neighborhoods_data, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(commutermap);


//this creates a custom display of info about the clicked area
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

function getAreaName(uglyGeojsonString){
	areaName = uglyGeojsonString.replace(/\_/g, ' ')   			// get rid of ugly geojson parts
		.replace("country:us/tract:", 'Census Tract #')
		.replace("country:us/state:mo/place:kansas city/neighborhood:", '');
	return areaName;
}

// method to update the info display based on feature properties passed
info.update = function (props) {
	if (props){
		areaName = getAreaName(props.shid);
	}
	if (legendTypes[0].byarea){
		this._div.innerHTML = '<h4>Commuter Statistics (per square km)</h4>' +  (props ?
			'<b>' + areaName + '</b><br/ >' +
			'<em>Area: '+ props["area"] + ' m<sup>2</sup>' + '</em><br/ ><br/ >' +
			'<b>Drive Alone: </b>' + Math.round((props["pop-commute-drive_alone"] / props["area"]) * 1000000000)/1000 + '<br/ >' +
			'<b>Carpool: </b>'+ Math.round((props["pop-commute-drive_carpool"] / props["area"]) * 1000000000)/1000 + '<br/ >' +
			'<b>Public Transit: </b>' + Math.round((props["pop-commute-public_transit"] / props["area"])*1000000000)/1000 + 	'<br/ >' +										 
			'<b>Walk: </b>' + Math.round((props["pop-commute-walk"] / props["area"] )*1000000000)/1000											 
			: 'Hover over an area');
	} else{
		this._div.innerHTML = '<h4>Commuter Statistics</h4>' +  (props ?
			'<b>' + areaName + '</b><br/ >' +
			'<em>Area: '+ props["area"] + ' m<sup>2</sup>' + '</em><br/ ><br/ >' +
			'<b>Drive Alone: </b>' + Math.round(props["pop-commute-drive_alone"]*1000)/1000 + '<br/ >' +
			'<b>Carpool: </b>'+ Math.round(props["pop-commute-drive_carpool"]*1000)/1000 + '<br/ >' +
			'<b>Public Transit: </b>' + Math.round(props["pop-commute-public_transit"]*1000)/1000 + 	'<br/ >' +										 
			'<b>Walk: </b>' + Math.round(props["pop-commute-walk"]*1000)/1000
			: 'Hover over an area');
	}
};

//add info box
info.addTo(commutermap);



// this creates the bottom-right hand legend, for highlighting data based on values.
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = levels,
        labels = [];
	
	div.innerHTML += '<b>' + legendTypes[0].text + '</b><br/><br/>';
	
    // loop through commuter density levels and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style=" display: block; background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<div style="overflow:auto; margin-top:-10px;"></div><br/>' : '+');
    }
	
	//set the click event to toggle different highlighting values
	$(div).on("click", function (){
		var temp = legendTypes.shift();
		legendTypes.push(temp);
		legend.removeFrom(commutermap);
		legend.addTo(commutermap);
		geojson_n.setStyle(style);
		geojson_t.setStyle(style);
		info.update();
	});
	
    return div;
};

legend.addTo(commutermap);


var overlay_maps = {       //  object for use with toggling datasets maps
	"Neighborhoods" : geojson_n,
	"Census Tracts" : geojson_t
}

L.control.layers(null, overlay_maps, {collapsed: false, position: 'bottomleft'}).addTo(commutermap); // creates the dataset toggling (layers) control


$(document).ready(function () { 

	// trigger a click to limit to one dataset (for some reason the layers control starts with both displayed)
	$('#mapwindow > div.leaflet-control-container > div.leaflet-bottom.leaflet-left > div > form > div.leaflet-control-layers-overlays > label:nth-child(2)').trigger('click');
	
});

function createDetail() {}