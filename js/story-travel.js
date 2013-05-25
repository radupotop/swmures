var StoryTravel = StoryTravel || function(){
	var storyMap = null;
	var mapApiKey = 'AIzaSyCo3leQTmmq4_AnjkvCi13ryx1JGkscQ-s';
	var currentLocation = null;
	var locationMarker = false;
	
	function getCurLocation(){
		if(navigator.geolocation) {
		    navigator.geolocation.getCurrentPosition(function(position) {
		    	currentLocation = new google.maps.LatLng(position.coords.latitude,
		                                       position.coords.longitude);


		      storyMap.setCenter(currentLocation);
		      if(!locationMarker){
		    	  locationMarker = new google.maps.Marker({
		    		  position: currentLocation,
		    		  map: storyMap,
		    		  title: 'I am here'
		    	  });
		      }else{
		    	  locationMarker.setPosition(currentLocation);
		      }
		      console.log(currentLocation);
		    }, function() {
		      handleNoGeolocation();
		    });
		  } else {
		    // Browser doesn't support Geolocation
		    handleNoGeolocation();
		  }
	}
	
	function handleNoGeolocation(errorFlag){
		alert('No Geolocation support')
	}
	
	return{
		Init : function(){
			var mapOptions = {
					zoom: 16,
					center: new google.maps.LatLng(0, 0),
					mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			storyMap = new google.maps.Map(document.getElementById('StoryMapContainer'),
					mapOptions);
			
			getCurLocation();
			
			setInterval(StoryTravel.updateCurLocation, 10000);
		},
		updateCurLocation : function(){
			getCurLocation();
		}
	};
}();


google.maps.event.addDomListener(window, 'load', StoryTravel.Init);

