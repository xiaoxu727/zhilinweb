function main(){
		map = L.map('map', {
				zoomControl: false,
				center: [0, 0],
				zoom: 3
		});
		L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
						attribution:'whatever'
						}).addTo(map);
		cartodb.createLayer(map,'http://shaofei.cartodb.com/api/v2/viz/1d8be4d0-7af0-11e4-9666-0e4fddd5de28/viz.json')
		        .addTo(map);
		$("#topSearchButton").click(function(map){
				var address = $("#topSearchTextBox").val();
				var URL = "https://maps.googleapis.com/maps/api/geocode/json?address="+address;
				var MapQuestURL = "http://open.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluurn10tnh%2C2x%3Do5-9wywgy&location=" + address;
				$.getJSON(MapQuestURL,function(response){
					jokerResponse = response;
					jokerResolveResponse();
					jokerSetMapWithCenterZoom();
					jokerShowSearchResults();
				});
		});
		$("#panelControl").click(function(){
				if (panelToggle == jokerSHOWN){
						$("#informationPanel").animate({height:"32px"},1000);
						$("#panelControlContainer").animate({left:"2px"},300);
						$("#firstLineInPanel").animate({width:"24px"},400);
						$("#informationPanel").animate({width:"34px"},500);
						$("#informationTabList,#informationContent").fadeOut();
						jokerTogglePanel();
				}else{
						$("#informationPanel").animate({width:"355px"},300)
						$("#firstLineInPanel").animate({width:"345px"},600);
						$("#panelControlContainer").animate({left:"163.5px"},800);
						$("#informationPanel").animate({height:"465px"},1800);
						$("#informationTabList,#informationContent").fadeIn();
						jokerTogglePanel();
				}
		});
		$("#informationTabSearchBtn").click(function(){
				jokerShowSearchResults();
		});
		$("#informationTabEchartsBtn").click(function(){
			jokerShowEcharts();
		});
}



function jokerShowSearchResults(){
		$("#informationContent").empty();
		if(jokerResponse == null)
				return;
		if (jokerResponse.results[0].locations.length > JOKERSCROLLBARLIMIT){
		//		jokerShowScrollBar();
		}
		jokerResponse.results[0].locations.forEach(function(everyResult,index,array){
				var divContent = null;
				var divContentTemp = null;
				var count = 5;
				do{
						eval("var divContentTemp = everyResult.adminArea" + count.toString());
						if (divContentTemp != null){
								if(divContent == null){
										divContent = divContentTemp;
								}else{
										divContent += divContentTemp;
								}
								divContent += "<br/>";
								divContentTemp = null;
						}
						count --;
				}while (count >0);

				if (everyResult.street != null){
						divContent += everyResult.street;
						divContent += "<br/>";
				}
				if (everyResult.postalCode != null){
						divContent += everyResult.postalCode;
						divContent += "<br/>";
				}
				divContent += everyResult.geocodeQualityCode;
				var divId = "informationSearchListContent" + index.toString()  ;
				var $resultDiv = $("<div id = 'informationSearchListContent" + index.toString() + "' >" + divContent + "</div>");
				$("#informationContent").append($resultDiv);
				$( "#" + divId ).attr("class","informationPanelSearchResult");
				$( "#" + divId ).addClass("overFlowHidden");
				$( "#" + divId ).click (function (everyResult){
					jokerResolveLocation(everyResult);
					jokerSetMapWithCenterZoom();
				});
		});
}
function jokerResolveGeocodeQC(geocodeQC){
	try {
			var zoom = 3;
			switch(geocodeQC){
				case "P1"://POINT A specific point location
						zoom = 18;
						break;
				case "L1"://ADDRESS A specific street address location
						zoom = 18;
						break;
				case "I1"://INTERSECTION A intersection of two or more streets.
						zoom = 18;
						break;
				case "B1"://STREET The center of a single street block. House number ranges are returned if available
						zoom = 15; 
						break;
				case "B2"://STREET The center of a single street block, which is located closest to the geographic center of all matching street blocks. No house number range is returned.
						zoom = 15;
						break;
				case "B3"://STREET The center of a single street block whose numbered range is neareset to the input number. House number range is returned.
						zoom = 15;
						break;
				case "A1"://COUNTRY Admin area, largest.For USA, a country.
						zoom = 4;
						break;
				case "A3"://STATE Admin area. For USA, a state
						zoom = 9;
						break;
				case "A4"://COUNTY Admin area. For USA, a county
						zoom = 9;
						break;
				case "A5"://CITY Admin area. For USA, a city
						zoom = 12;
						break;
				case "A6"://NEIGHBORHOOD Admin area. For USA, a neighborhood
						zoom = 15;
						break;
				case "Z1"://ZIP Postal code, largest For USA, a ZIP
						zoom = 6;
						break;
				case "Z2"://ZIP_EXTENDED Postal code. For USA, a ZIP+2
						zoom = 6;
						break;
				case "Z3"://ZIP_EXTENDED Postal code. For USA, a ZIP+4
						zoom = 6;
						break;
				case "Z4"://ZIP Postal code, smallest Unused in USA.
						zoom = 6;
						break;
			}	
	} catch (e) {
		alert (e.message);
	} finally {
		return zoom;
	}
}
function jokerSetMapWithCenterZoom(){
		map.setView(Center,Zoom);
		L.marker(Center).addTo(map);
}
function jokerTogglePanel(){
		if (panelToggle == jokerSHOWN){
				panelToggle = jokerHIDDEN;
		}else{
				panelToggle = jokerSHOWN;
		}
}
function jokerInfoMessageFetch (info){
		var messageTemp = "<br/>";
		var i = 0;
		while ( i < info.messages.length ){
				messageTemp += (i+1) + "";
				messageTemp += info.message [i];
				messageTemp += "<br/>";
				i++ ;
		}
		return messageTemp;
}
function jokerResolveResponse(){
		try {
				var info =jokerResponse.info;
				switch (info.statuscode){
						case 0:
								break;
						case 400:
								var message = jokerInfoMessageFetch (info );
								throw new Error ( "Error with input - "  + message );
								break;
						case 403:
								var message = jokerInfoMessageFetch (info);
								throw new Error ( "Key related error - " + message );
								break;
						case 500:
								var message = jokerInfoMessageFetch (info);
								throw new Error ( "Unknown error - " + message );
								break;
				}
				if ( jokerResponse.results[0].locations.length == 0 ) {
						throw new Error ( "please provide an address in more detial...");
				}
				jokerResolveLocation(jokerResponse.results[0].locations[0]);
		} catch ( error ) {
				alert( error.message );
		}

}
function jokerResolveLocation(location) {
	try {
		var latLng = location.latLng;
		var zoom;
		var center = L.latLng(latLng.lat, latLng.lng);
		var geocodeQualityCode = location.geocodeQualityCode;
		var geocodeQC = geocodeQualityCode.substr(0, 2);
		Zoom = jokerResolveGeocodeQC(geocodeQC);
		Center = center;
	} catch (error) {
		alert(error.message);
	}
}
function nothing(){
	return;
};
function jokerHandleMapMouseMove(e) {
//	setTimeout("nothing",250);

	var nowPoint = e.latlng;
	var tableName = "data";
	var SQLSTATEMENT = "SELECT * FROM "+ 
							 tableName +
			  " WHERE ST_Intersects (" + 
			  				 tableName +
  ".the_geom, ST_GeomFromText('POINT(" + 
  	 nowPoint.lng + " " + nowPoint.lat + 
  	 						")',4326))";
//	var SQLSTATEMENT = "SELECT * FROM data LIMIT 1";
	$.getJSON('http://shaofei.cartodb.com/api/v2/sql/?q=' + SQLSTATEMENT , function (data) {
		try {
			if ( data.rows != null) {
				if (jokerLastData == null){
					jokerLastData = data;
				}
				$.each(data.rows,function (key, val) {
//					alert(key);
//					alert(val);
					if(jokerLastData.rows[0].key == val.key){
						return;
					}

				    // 使用
					jokerEcharts.addData(
		                       0,//系列索引
		                       {//新增数据
		                    	   name:'所在地块数据',
		                    	   value:[
		                    	          val.q001001,
		                    	          val.q010025,
		                    	          val.q054001md,
		                    	          val.xq008006,
		                    	          val.houvalmedc
		                    	    ]
		                       },
		                       false,		//新增数据是否从队列头部插入
		                       false		//是否增加队列长度，false则删除原有数据
		              );

				})
			} else {
			}
		} catch (error) {
			alert(error);
		}
	});
}
function jokerCloseInformationTabSearchBtn(){

}
function jokerCloseInformationTabEchartsBtn(){
	try {
		map.off('mousemove',jokerHandleMapMouseMove);
	} catch (e){
		//do nothing
	}
}
function jokerCloseInformationTabAllBtn(){
	$("#informationContent").empty();
	jokerCloseInformationTabSearchBtn();
	jokerCloseInformationTabEchartsBtn();
}
function jokerShowEcharts(){
	$.ajaxSetup({
	async:false
});
	jokerCloseInformationTabAllBtn();
    require(
	        [
	            'echarts',
	            'echarts/chart/radar' // 使用柱状图就加载bar模块，按需加载
	        ],
	        function (ec) {
	            // 基于准备好的dom，初始化echarts图表
	            jokerEcharts = ec.init(document.getElementById('informationContent')); 
				 option = {
     	            	    title : {
     	            	        text: 'data',
     	            	        subtext: 'from cartodb',
     	            	        textStyle:{
     	            	        	color:'#fff'
     	            	        }
     	            	    },
     	            	    tooltip : {
     	            	        trigger: 'axis'
     	            	    },
     	            	    legend: {
     	            	        orient : 'vertical',
     	            	        x : 'right',
     	            	        y : 'bottom',
     	            	        data:['鼠标所在地块数据']
     	            	    },
     	            	    toolbox: {
     	            	        show : true,
     	            	        feature : {
     	            	            mark : {show: true},
     	            	            dataView : {show: true, readOnly: true},
     	            	            restore : {show: false},
     	            	            saveAsImage : {show: true}
     	            	        }
     	            	    },
     	            	    polar : [
     	            	       {
     	            	           indicator : [
     	            	               { text: 'q001001', max: 52098,axisLabel:{
     	            	            	   textStyle:{
     	            	            		   color:'#fff'
     	            	            	   }
     	            	               }},
     	            	               { text: 'q010025', max: 7682,axisLabel:{
     	            	            	   textStyle:{
     	            	            		   color:'#fff'
     	            	            	   }
     	            	               }},
     	            	               { text: 'q054001md', max: 401042,axisLabel:{
     	            	            	   textStyle:{
     	            	            		   color:'#fff'
     	            	            	   }
     	            	               }},
     	            	               { text: 'xq008006', max: 100,axisLabel:{
     	            	            	   textStyle:{
     	            	            		   color:'#fff'
     	            	            	   }
     	            	               }},
     	            	               { text: 'houvalmedc', max: 1000000,axisLabel:{
     	            	            	   textStyle:{
     	            	            		   color:'#fff'
     	            	            	   }
     	            	               }}
     	            	            ]
     	            	        }
     	            	    ],
     	            	    calculable : true,
		            	    series : [
				  	            	        {
				  	            	            name: '所在地块数据',
				  	            	            type: 'radar',
				  	            	            data : [
				  	            	                {
				  	            	                    value : [
				  	            	                            0, 
				  	            	                             0, 
				  	            	                             0, 
				  	            	                             0, 
				  	            	                             0
				  	            	                             ],
				  	            	                    name : '所在地块数据'
				  	            	                }
				  	            	            ]
				  	            	        }
				  	            	    ]
     	            	};
					jokerEcharts.setOption(option);                 
	    
	            // 为echarts对象加载数据 
	            //jokerEcharts.setOption(option); 
	        }
	        );
	map.on("mousemove",jokerHandleMapMouseMove);

}
var jokerSHOWN = 1;
var jokerHIDDEN = 0;
var map;
var Center;
var Zoom;
var panelToggle = jokerSHOWN;
var jokerResponse;
var JOKERSCROLLBARLIMIT = 4;
var jokerSearchResultTemp;
var jokerEcharts;
var jokerLastData;

require.config({
    paths: {
        echarts: 'http://echarts.baidu.com/build/dist'
    }
});

$(window).load(main);
