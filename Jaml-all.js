/**
 * @class Jaml
 * @author Ed Spencer (http://edspencer.net)
 * Jaml is a simple JavaScript library which makes HTML generation easy and pleasurable.
 * Examples: http://edspencer.github.com/jaml
 * Introduction: http://edspencer.net/2009/11/jaml-beautiful-html-generation-for-javascript.html
 */
Jaml = function() {
  return {
    templates: {},
    helpers  : {},
    
    /**
     * Registers a template by name
     * @param {String} name The name of the template
     * @param {Function} template The template function
     */
    register: function(name, template) {
      this.templates[name] = template;
    },
    
    /**
     * Renders the given template name with an optional data object
     * @param {String} name The name of the template to render
     * @param {Object} data Optional data object
     */
    render: function(name, data) {
      var template = this.templates[name],
          renderer = new Jaml.Renderer(template);
          
      return renderer.render(data);
    },
    
    /**
     * Registers a helper function
     * @param {String} name The name of the helper
     * @param {Function} helperFn The helper function
     */
    registerHelper: function(name, helperFn) {
      this.helpers[name] = helperFn;
    }
  };
}();


/**
 * @constructor
 * @param {String} tagName The tag name this node represents (e.g. 'p', 'div', etc)
 */
Jaml.Node = function(tagName) {
  /**
   * @property tagName
   * @type String
   * This node's current tag
   */
  this.tagName = tagName;
  
  /**
   * @property attributes
   * @type Object
   * Sets of attributes on this node (e.g. 'cls', 'id', etc)
   */
  this.attributes = {};
  
  /**
   * @property children
   * @type Array
   * Array of rendered child nodes that will be included as this node's innerHTML
   */
  this.children = [];
};

Jaml.Node.prototype = {
  /**
   * Adds attributes to this node
   * @param {Object} attrs Object containing key: value pairs of node attributes
   */
  setAttributes: function(attrs) {
    for (var key in attrs) {
      //convert cls to class
      var mappedKey = key == 'cls' ? 'class' : key;
      
      this.attributes[mappedKey] = attrs[key];
    }
  },
  
  /**
   * Adds a child string to this node. This can be called as often as needed to add children to a node
   * @param {String} childText The text of the child node
   */
  addChild: function(childText) {
    this.children.push(childText);
  },
  
  /**
   * Renders this node with its attributes and children
   * @param {Number} lpad Amount of whitespace to add to the left of the string (defaults to 0)
   * @return {String} The rendered node
   */
  render: function(lpad) {
    lpad = lpad || 0;
    
    var node      = [],
        attrs     = [],
        textnode  = (this instanceof Jaml.TextNode),
        multiline = this.multiLineTag();
    
    for (key in this.attributes) {
      attrs.push(key + '=' + this.attributes[key]);
    }
    
    //add any left padding
    if (!textnode) node.push(this.getPadding(lpad));
    
    //open the tag
    node.push("<" + this.tagName);
    
    //add any tag attributes
    for (key in this.attributes) {
      node.push(" " + key + "=\"" + this.attributes[key] + "\"");
    }
    
    if (this.isSelfClosing()) {
      node.push(" />\n");
    } else {
      node.push(">");
      
      if (multiline) node.push("\n");
      
      for (var i=0; i < this.children.length; i++) {
        node.push(this.children[i].render(lpad + 2));
      }
      
      if (multiline) node.push(this.getPadding(lpad));
      node.push("</", this.tagName, ">\n");
    }
    
    return node.join("");
  },
  
  /**
   * Returns true if this tag should be rendered with multiple newlines (e.g. if it contains child nodes)
   * @return {Boolean} True to render this tag as multi-line
   */
  multiLineTag: function() {
    var childLength = this.children.length,
        multiLine   = childLength > 0;
    
    if (childLength == 1 && this.children[0] instanceof Jaml.TextNode) multiLine = false;
    
    return multiLine;
  },
  
  /**
   * Returns a string with the given number of whitespace characters, suitable for padding
   * @param {Number} amount The number of whitespace characters to add
   * @return {String} A padding string
   */
  getPadding: function(amount) {
    return new Array(amount + 1).join(" ");
  },
  
  /**
   * Returns true if this tag should close itself (e.g. no </tag> element)
   * @return {Boolean} True if this tag should close itself
   */
  isSelfClosing: function() {
    var selfClosing = false;
    
    for (var i = this.selfClosingTags.length - 1; i >= 0; i--){
      if (this.tagName == this.selfClosingTags[i]) selfClosing = true;
    }
    
    return selfClosing;
  },
  
  /**
   * @property selfClosingTags
   * @type Array
   * An array of all tags that should be self closing
   */
  selfClosingTags: ['img', 'meta', 'br', 'hr']
};

Jaml.TextNode = function(text) {
  this.text = text;
};

Jaml.TextNode.prototype = {
  render: function() {
    return this.text;
  }
};

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