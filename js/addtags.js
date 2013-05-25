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
        
        $.getJSON('js/test-data.json').success(function(data) {
            
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
            $('#DataTags').append(
                '<a href="#" class="label" onclick="Tags.toggleTag(this, \''+tag+'\')">'+tag+'</a> '
            );
        });
        
    }


    /**
     * Toggle a tag
     */
    ret.toggleTag = function(element, tag) {
        
        var isSelected = $.inArray(tag, ret.selectedTags) > -1;
        
        if(isSelected) {
            ret.selectedTags = ret.selectedTags.filter(function(t){
                return t != tag;
            });
            StoryTravel.setTagFilters(ret.selectedTags);
            $(element).removeClass('label-warning');
        }
        else {
            ret.selectedTags.push(tag);
            $.unique(ret.selectedTags);
            StoryTravel.setTagFilters(ret.selectedTags);
            $(element).addClass('label-warning');
        }
        
    };
    
    return ret;
    
}

var Tags = GetTags();
