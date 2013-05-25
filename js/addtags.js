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
