var info = {
	weatherLoaded: false,
	lat: '',
	lng: '',
	map: '',
	mark: '',
	currentElevation: '',
	prior: [],
}

window.addEventListener("deviceorientation", function(e) {
      $('#direction').html(degreeToDirection(360 - e.alpha));
}, true);


function setGeo(){
	if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(showPosition);
   }
   else{
      alert("Sorry, browser does not support geolocation!");
   }
}

function roundIt(num, pos){
	var exp = Math.pow(10, pos);
	return Math.round(num*exp)/exp;
}

function metersToFeet(num){
	return roundIt(num*3.28084, 2);
}

function showPosition(pos){
	$('#lat').html( roundIt(pos.coords.latitude, 2));
	$('#lng').html(roundIt(pos.coords.longitude, 2));
	info.lat = pos.coords.latitude;
	info.lng = pos.coords.longitude;
	if(!info.weatherLoaded){
		setWeather();
	}
	else{
		setMap();
	}
	
}

function setMap(){
	info.mark = new google.maps.LatLng(info.lat, info.lng);
	var mapOptions = {
		zoom: 32,
		center: info.mark,
		mapTypeId: google.maps.MapTypeId.TERRAIN
	}
	info.map = new google.maps.Map(document.getElementById("g_map"), mapOptions);
	var positionalRequest = {
    	'locations': [info.mark],
  	}
	var elevation = new google.maps.ElevationService();
	elevation.getElevationForLocations(positionalRequest, function(results, status) {
		if (status == google.maps.ElevationStatus.OK) {
			if(results[0]){
				info.currentElevation = metersToFeet(results[0].elevation);
				$('#elevation').html(info.currentElevation+' Feet');
			}
		}
	});
	setMarker();
}

function setMarker(){
	var prior = {
		'mark': info.mark,
		'elevation': info.currentElevation,
	}
	info.prior.push(prior);
	var curCount = info.prior.length - 1;
	for(var i= curCount; i >= 0; i--){
		marker = new google.maps.Marker({
		   	position: info.prior[i].mark,
		    map: info.map,
		});
	}
}

function setWeather(){
	$.get('http://phad.phluant.net/web_services/geolocation/export?type=weather&subtype=geo&value='+info.lat+','+info.lng, function(data){
		//console.log(data);
		var dataJson = jQuery.parseJSON(data);
		var weatherInfo = dataJson.results.data.hourly_temp[0].value+', Winds '+dataJson.results.data.wind_dir[0].value+' at '+dataJson.results.data.wind_speed[0].value;
		$('#weather').html(weatherInfo);
		$('#weather_img').html('<img src="'+dataJson.results.data.icon[0].value+'" />');
		var bHeight = $('#base_info').height();
		var mapHeight = $(window).height() - bHeight;
		console.log(mapHeight);
		$('#g_map').height(mapHeight);
		info.weatherLoaded = true;
		setMap();
	});
}

function degreeToDirection(degree){
	if(degree > 348.75 || degree <= 11.25){
		return 'N';
	}
	if(degree > 11.25 && degree <= 33.75){
		return 'NNE';
	}
	if(degree > 33.75 && degree <= 56.25){
		return 'NE';
	}
	if(degree > 56.25 && degree <= 78.75){
		return 'ENE';
	}
	if(degree > 78.75 && degree <= 101.25){
		return 'E';
	}
	if(degree > 101.25 && degree <= 123.75){
		return 'ESE';
	}
	if(degree > 123.75 && degree <= 146.25){
		return 'SE';
	}
	if(degree > 146.25 && degree <= 168.75){
		return 'SSE';
	}
	if(degree > 168.75 && degree <= 191.25){
		return 'S';
	}
	if(degree > 191.25 && degree <= 213.75){
		return 'SSW';
	}
	if(degree > 213.75 && degree <= 236.25){
		return 'SW';
	}
	if(degree > 236.25 && degree <= 258.75){
		return 'WSW';
	}
	if(degree > 258.75 && degree <= 281.25){
		return 'W';
	}
	if(degree > 281.25 && degree <= 303.75){
		return 'WNW';
	}
	if(degree > 303.75 && degree <= 326.25){
		return 'NW';
	}
	if(degree > 326.25 && degree <= 348.75){
		return 'NNW';
	}
}

setGeo();

setInterval(function(){
	setGeo();
},60000);

setInterval(function(){
	setWeather();
},600000);