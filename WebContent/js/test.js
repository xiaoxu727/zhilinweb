function main(){
		//var map = L.map('map', {
		//        zoomControl: false,
		//        center: [ 0, 0 ],
		//        zoom: 3
		//});
		////add a nice baselayer from Stamen
		//L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
		//                attribution: 'Stamen'
		//                }).addTo(map);
		//cartodb.createLayer(map,'http://documentation.cartodb.com/api/v2/viz/2b13c956-e7c1-11e2-806b-5404a6a683d5/viz.json')
		//        .addTo(map)
		//        .on('done',function(layer){
		//                //get sublayer 0 and set the infowindow template
		//        //        var sublayer = layer.getSublayer(0);
		//        //        sublayer.infowindow.set('template',$('#infowindow_template').html());
		//    }).on('error',function(){
		//                console.log("some error occurred");
		//        });
	 	vis =	cartodb.createVis('map', 'http://shaofei.cartodb.com/api/v2/viz/1d8be4d0-7af0-11e4-9666-0e4fddd5de28/viz.json', {
            shareable: false,
            description: true,
            search: false,
            tiles_loader: true,
            center_lat: 0,
            center_lon: 0,
            zoom: 2
        })
        .done(function(vis, layers) {
          // layer 0 is the base layer, layer 1 is cartodb layer
          // setInteraction is disabled by default
          layers[1].setInteraction(true);
          layers[1].on('featureOver', function(e, pos, latlng, data) {
            cartodb.log.log(e, pos, latlng, data);
          });
          // you can get the native map to work with it
          //var map = vis.getNativeMap();
          // now, perform any operations you need
          // map.setZoom(3);
          // map.panTo([50.5, 30.5]);
        })
        .error(function(err) {
          console.log(err);
        });
		document.getElementById("topSearchButton").onclick = codeAddress;
}
var xmlhttp;
function codeAddress(){
		var address = document.getElementById("topSearchTextBox").value;
		xmlhttp=null;
		xmlhttp=new XMLHttpRequest();
		if(xmlhttp!=null){
				xmlhttp.onreadystatechange=state_Change;
				xmlhttp.open("GET","https://maps.googleapis.com/maps/api/geocode/json?address="+address,true);
				xmlhttp.send(null);
		}else{
				alert("your browser does not support ajax");
		}

}
function state_Change()
{
		map = vis.getNativeMap();
if (xmlhttp.readyState==4)
  {// 4 = "loaded"
  if (xmlhttp.status==200)
    {// 200 = "OK"

		//temp=xmlhttp.responseText;
		//geometry=JSON.parse(xmlhttp.repsonseText).results[0].geometry;
		//geometry=JSON.parse(temp).results[0].geometry;

		//var latLng = L.latLng(geometry.location.lat,geometry.location.lng);
		//switch(geometry.location_type)
		//{
		//        case "ROOFTOP":
		//                map.setView(latLng,13);
		//                break;
		//        case "RANGE_INTERPOLATED":
		//                map.setView(latLng,13);
		//                break;
		//        case "GEOMETRIC_CENTER":
		//                map.setView(latLng,13);
		//                break;
		//        case "APPROXIMATE":
		//                map.setView(latLng,13);
		//                break;
		//        default:
		//                break;
		//}

		//var jokerCenter;
		//var jokerZoomLevel;
		//1. convert the JSON text to JSON
		geocodingReturnJson = JSON.parse(xmlhttp.responseText);
		//2. resolve the JSON and confirm the returned status of the geocoding.
		jokerResolveJson(geocodingReturnJson);
		map.setView(jokerCenter,jokerZoomLevel);
		L.marker(jokerCenter).addTo(map);
    }
  else
    {
    alert("Problem retrieving data:" + xmlhttp.statusText);
    }
  }
}
function jokerResolveJson(e){
		var jokerStatus = e.status;
		var jokerGeometry = e.results[0].geometry;
		switch(jokerStatus){
				case "OK":
						switch(jokerGeometry.location_type){
								case "ROOFTOP":
										jokerCenter =  L.latLng(jokerGeometry.location.lat,jokerGeometry.location.lng);
										jokerZoomLevel = 13;
										break;
								case "RANGE_INTERPOLATED":
										jokerCenter =  L.latLng(jokerGeometry.location.lat,jokerGeometry.location.lng);
										jokerZoomLevel = 13;
										break;
								case "GEOMETRIC_CENTER":
										jokerCenter =  L.latLng(jokerGeometry.location.lat,jokerGeometry.location.lng);
										jokerZoomLevel = 13;
										break;
								case "APROXIMATE":
										jokerCenter =  L.latLng(jokerGeometry.location.lat,jokerGeometry.location.lng);
										jokerZoomLevel = 13;
										break;
								default:
										jokerCenter =  L.latLng(jokerGeometry.location.lat,jokerGeometry.location.lng);
										jokerZoomLevel = 13;
										break;
						}
						break;
				case "ZERO_NORESULTS":
						break;
				case "OVER_QUERY_LIMIT":
						break;
				case "REQUEST_DENIED":
						break;
				case "INVALID_REQUEST":
						break;
				default:
						break;
		}
}


var vis;
var map;
var jokerCenter;
var jokerZoomLevel;
window.onload = main;
