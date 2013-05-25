var StoryTravel = StoryTravel || function(){
	var storyMap = null;
	var mapApiKey = 'AIzaSyCo3leQTmmq4_AnjkvCi13ryx1JGkscQ-s';
	var currentLocation = null;
	var locationMarker = false;
	var locUpdateHandler = null;
	var currentBounds = null;
	var currentTagFilters = [];
	var currentPOIs = [];
	var currentPoiMarkers = [];
	
	function getCurLocation(callaback){
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
		    		  title: 'I am here',
		    		  //shadow: 'http://maps.google.com/mapfiles/ms/icons/msmarker.shadow.png'
		    		  //icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
		    		  icon: 'http://maps.google.com/mapfiles/ms/icons/golfer.png'
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
		if(!currentLocation) return false;
		if(!currentTagFilters.length){
			currentPOIs = [];
			currentPOIs.length = 0;
			updateCurrentPoiMarkers();
			return false;
		}
		$.ajax(
				{
					url : 'js/test-data.json',
					dataType : 'json',
					success : function(resdata){
						currentPOIs = [];
						currentBounds = storyMap.getBounds();
						//debugger;
						var boundne = currentBounds.getNorthEast();
						var boundsw = currentBounds.getSouthWest();
						if(resdata['data'].length){
							var tempdata = resdata['data'];
							for (var i = 0; i<tempdata.length; i++){
								var curitem = tempdata[i];
								var curtagfound = false;
								
								//test the tag existance
								if(currentTagFilters.length){
									//go over the itemtags
									if(typeof(curitem['tags']) == 'object'){
										for(var j in curitem['tags']){
											if(jQuery.inArray(curitem['tags'][j], currentTagFilters)> -1){
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
								/*console.log('ne '+curitem['lat'] + ' ' + boundne.lat());
								console.log('ne '+curitem['long']  + ' ' + boundne.lng());
								console.log('sw '+curitem['lat'] + ' ' + boundsw.lat());
								console.log('sw '+curitem['long']  + ' ' + boundsw.lng());
								console.log('------------------------------');*/
								//test if item is within the visible area of the map window
								if(parseFloat(curitem['lat'])  < boundne.lat() && 
								   parseFloat(curitem['long']) < boundne.lng() &&
								   parseFloat(curitem['lat']) > boundsw.lat() &&
								   parseFloat(curitem['long']) > boundsw.lng()){
									   currentPOIs.push(curitem);
								   }
								
								//currentPOIs.push(curitem);
							}
						}
						updateCurrentPoiMarkers();
						
					},
				}
		);
	}
	
	function displayPoiData(){
		var poidatacontainer = $('#PoiDataContainer');
		poidatacontainer.html('');
		poidatacontainer.append('<h4>'+currentPOIs[this.poi_index]['name']+'<\/h4>');
		if(typeof(currentPOIs[this.poi_index]['images']) == 'object' && currentPOIs[this.poi_index]['images'].length){
			poidatacontainer.append('<div class="img"><img src="'+currentPOIs[this.poi_index]['images'][0]+'"><\/div>');
		}
		if(typeof(currentPOIs[this.poi_index]['description']) == 'string' && currentPOIs[this.poi_index]['description'].length){
			poidatacontainer.append('<div class="poi-content">'+currentPOIs[this.poi_index]['description']+'<\/div>');
		}
		console.log(currentPOIs[this.poi_index]);
	}
	
	function updateCurrentPoiMarkers(){
		//clear current poi markers
		for(var i = 0; i< currentPoiMarkers.length; i++){
			currentPoiMarkers[i].setMap(null);
		}
		currentPoiMarkers = [];
		currentPoiMarkers.length = 0;
		for(var i = 0; i< currentPOIs.length; i++){
			var poimarker =  new google.maps.Marker({
	    		  position: new google.maps.LatLng(currentPOIs[i]['lat'], currentPOIs[i]['long']),
	    		  map: storyMap,
	    		  title: currentPOIs[i]['name'],
	    		  poi_index: i
	    	  });
			google.maps.event.addListener(poimarker, 'click', displayPoiData);
			currentPoiMarkers.push(poimarker);
		}
		
	}
	
	return{
		Init : function(){
			var mapOptions = {
					zoom: 16,
					center: new google.maps.LatLng(0, 0),
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					zoomControl : false,
					streetViewControl : false,
					panControl : false
			};
			storyMap = new google.maps.Map(document.getElementById('StoryMapContainer'),
					mapOptions);
			
			getCurLocation();
			
			//if we do not have a current location here then geolocation is not awailable
			//so no automatic update is necessary
			//if (currentLocation){
			//locUpdateHandler = setInterval(StoryTravel.updateCurLocation, 10000);
			//}
		},
		updateCurLocation : function(){
			getCurLocation();
		},
		setTagFilters : function(_currentTagFilters){
			currentTagFilters = _currentTagFilters;
			if(typeof (currentTagFilters) == 'undefined'){
				currentTagFilters = [];
			}
			getCurrentPois();
		},
		updateVisiblePois : function(){
			getCurrentPois();
		},
		getTagFilters : function(){
			return currentTagFilters;
		}
	};
}();


google.maps.event.addDomListener(window, 'load', StoryTravel.Init);
