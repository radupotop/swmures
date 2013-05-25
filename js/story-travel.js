var StoryTravel = StoryTravel || function(){
	var storyMap = null;
	var mapApiKey = 'AIzaSyCo3leQTmmq4_AnjkvCi13ryx1JGkscQ-s';
	var currentLocation = null;
	var locationMarker = false;
	var locUpdateHandler = null;
	var currentBounds = null;
	var currentTagFilters = [];
	var currentPOIs = [];
	
	function getCurLocation(){
		if(navigator.geolocation) {
		    navigator.geolocation.getCurrentPosition(function(position) {
		    	currentLocation = new google.maps.LatLng(position.coords.latitude,
		                                       position.coords.longitude);


		      storyMap.setCenter(currentLocation);
		      currentBounds = storyMap.getBounds();
		      if(!locationMarker){
		    	  locationMarker = new google.maps.Marker({
		    		  position: currentLocation,
		    		  map: storyMap,
		    		  title: 'I am here'
		    	  });
		      }else{
		    	  locationMarker.setPosition(currentLocation);
		      }
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
	
	function getCurrentPois(){
		$.ajax(
				{
					url : 'js/test-data.json',
					dataType : 'json',
					success : function(resdata){
						if(resdata['data'].length){
							var tempdata = resdata['data'];
							for (var i = 0; i<tempdata.length; i++){
								var curitem = tempdata[i];
								var curtagfound = false;
								
								//test the tag existance
								if(currentTagFilters.length){
									//go over the itemtags
									if(typeof(curitem['tags']) != 'object'){
										for(var j in curitem['tags']){
											if(jQuery.inArray(curitem['tags'][j], currentTagFilters)){
												curtagfound = true;
												break;
											}
										}
									}
								}else{
									curtagfound = true;
								}
								
								//item does not have any of the tags
								if(!curtagfound) continue;
								
								//test if item is within the visible area of the map window
								
								
							}
						}
					},
				}
		);
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
			getCurrentPois();
			//if we do not have a current location here then geolocation is not awailable
			//so no automatic update is necessary
			//if (currentLocation){
			//locUpdateHandler = setInterval(StoryTravel.updateCurLocation, 10000);
			//}
		},
		updateCurLocation : function(){
			getCurLocation();
		},
		updateTagFilters : function(){
			
		}
	};
}();


google.maps.event.addDomListener(window, 'load', StoryTravel.Init);

