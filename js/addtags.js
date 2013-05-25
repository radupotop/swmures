/**
 * Tag manipulation: get current tags, push them to selected, pop from selected.
 */
function GetTags(StoryTravel) {
    
    var ret = {};
    var availableTags = [];
    
    ret.selectedTags = [];
    
    /**
     * Get data & tags from JSON
     */
    function getTags() {
        
        $.getJSON('js/test-data.json').success(function(data) {
            
            data.data.filter(function(v,k) {
                availableTags = availableTags.concat(v.tags);
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
        StoryTravel.setTagFilters(ret.selectedTags);
        console.log(ret.selectedTags);
    };
    
    /**
     * Remove a tag
     */
    ret.rmTag = function(tag) {
        ret.selectedTags = ret.selectedTags.filter(function(t){
            return t != tag;
        });
        StoryTravel.setTagFilters(ret.selectedTags);
        console.log(ret.selectedTags);
    };
    
    return ret;
    
};

var Tags = GetTags(StoryTravel);
