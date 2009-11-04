Jaml.Renderer = function(template) {
  /**
   * @property template
   * @type Jaml.Template
   * The template bound to this renderer
   */
  this.template = template;
  
  this.createTagMethods();
};

Jaml.Renderer.prototype = {
  /**
   * Renders this template into HTML with the given data
   * @param {Object} data Optional data object to give to the template
   * @return {String} Rendered HTML
   */
  render: function(data) {
    data = data || {};
    
    //the 'data' argument can come in two flavours - array or non-array. Normalise it
    //here so that it always looks like an array.
    if (data.constructor.toString().indexOf("Array") == -1) {
      data = [data];
    }
    
    /**
     * Here is a lovely hack.
     * Take the string version of a template and add a 'return' statement to make sure that
     * the outermost tag actually returns what gets evaluated into it.
     */
    var fn = this.template.toString().replace(/^(function \(.*\) \{)\n/, '$1\n return');
    
    var result = "";
    
    with (this) {
      for (var i=0; i < data.length; i++) {
        eval("result += ((" + fn + ")(data[i])).render()");
      }
    };
    
    return result;
  },
  
  yield: function() {
    return "";
  },
  
  /**
   * Creates a method for each tag name
   * @param {Array} tags Array of tag names (defaults to this.tags)
   */
  createTagMethods: function(tags) {
    tags = tags || this.tags;
    
    for (var i = this.tags.length - 1; i >= 0; i--){
      var tagName = this.tags[i];
      
      this[tagName] = (function(tagName) {
        return function(attrs) {
          // console.log(tagName);
          // console.log(arguments);
          
          var node = new Jaml.Node(tagName);
          
          var firstArgIsAttributes =  (typeof attrs == 'object')
                                   && !(attrs instanceof Jaml.Node)
                                   && !(attrs instanceof Jaml.TextNode);
          
          if (firstArgIsAttributes) node.setAttributes(attrs);
          
          var startIndex = firstArgIsAttributes ? 1 : 0;
            
          for (var i=startIndex; i < arguments.length; i++) {
            var arg = arguments[i];
            
            if (typeof arg == "string" || arg == undefined) {
              arg = new Jaml.TextNode(arg || "");
            }
            
            node.addChild(arg);
          };
          
          return node;
        };
      })(tagName);
    };
  },
  
  tags: [
    "html", "head", "body", "script", "meta", "title", "link", "script",
    "div", "p", "span", "a", "img", "br", "hr",
    "table", "tr", "th", "td", "thead", "tbody",
    "ul", "ol", "li", 
    "dl", "dt", "dd",
    "h1", "h2", "h3", "h4", "h5", "h6", "h7",
    "form", "input", "label"
  ]
};