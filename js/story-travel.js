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
			
			StoryTravel.updateCurLocation;
		},
		updateCurLocation : function(){
			getCurLocation();
		}
	};
}();


google.maps.event.addDomListener(window, 'load', StoryTravel.Init);


/**
 * Tag manipulation: get current tags, push them to selected, pop from selected.
 */
function GetTags() {
    
    var ret = {};
    var availableTags = [];
    
    ret.selectedTags = [];
    
    /**
     * Get data & tags from JSON
     */
    function getTags() {
	
	$.getJSON('/swmures/js/test-data.json').success(function(data) {
	    
	    $.each(data.data, function(k,v) {
		$.each(v.tags, function(k,v) {
		    availableTags.push(v);
		});
	    });
	    
	    $.unique(availableTags);
	    
	    appendTags();
	    
	});
    }
    
    getTags();


    /**
     * Append tags to DOM
     */
    function appendTags() {
	
	$.each(availableTags, function(k, tag) {
	    $('#DataTags').append('<strong class="label">'+tag+'</strong> <a href="#" class="btn btn-small" onclick="Tags.addTag(\''+tag+'\')">+</a> <a href="#" class="btn btn-small" onclick="Tags.rmTag(\''+tag+'\')">-</a><br>');
	});
	
    }


    /**
     * Add a tag
     */
    ret.addTag = function(tag) {
	ret.selectedTags.push(tag);
	$.unique(ret.selectedTags);
	console.log(ret.selectedTags);
    };
    
    /**
     * Remove a tag
     */
    ret.rmTag = function(tag) {
	ret.selectedTags = ret.selectedTags.filter(function(t){
	    return t != tag;
	});
	console.log(ret.selectedTags);
    };
    
    return ret;
    
};


var Tags = GetTags();
