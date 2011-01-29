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
    return this;
  },
  
  /**
   * Adds a child string to this node. This can be called as often as needed to add children to a node
   * @param {String} childText The text of the child node
   */
  addChild: function(childText) {
    this.children.push(childText);
    return this;
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
    
    
    //add any left padding
    if (!textnode) node.push(this.getPadding(lpad));
    
    //open the tag
    node.push("<" + this.tagName);

    for (var key in this.attributes) {
      attrs.push(key + "=\"" + this.attributes[key] + "\"");
    }    
    attrs.sort()
    //add any tag attributes
    for (var i=0; i<attrs.length; i++) {
      node.push(" " + attrs[i]);
    }
    
    if (this.isSelfClosing() && this.children.length==0) {
      node.push("/>\n");
    } else {
      node.push(">");
      
      if (multiline) node.push("\n");
      
      this.renderChildren(node, this.children, lpad);
            
      if (multiline) node.push(this.getPadding(lpad));
      node.push("</", this.tagName, ">\n");
    }
    
    return node.join("");
  },

  /**
   * Renders an array of children
   * @node {Array} the current array of rendered lines
   * @children {Array} the child nodes to be rendered
   * @param {Number} lpad Amount of whitespace to add to the left of the string
   */
  renderChildren: function(node, children, lpad) {
    var childLpad = lpad + 2;
    
    for (var i=0; i < children.length; i++) {
      var child = children[i];
      if (child instanceof Array) {
        var nestedChildren = child;
        this.renderChildren(node, nestedChildren, lpad)
      } else {
        node.push(child.render(childLpad));
      }
    }    
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
    for (var i = this.notSelfClosingTags.length - 1; i >= 0; i--) {
      if (this.tagName == this.notSelfClosingTags[i]) return false;
    }

    return true;
  },
  
  /**
   * @property selfClosingTags
   * @type Array
   * An array of all tags that should be self closing
   */
  notSelfClosingTags: ['textarea', 'script', 'em', 'strong', 'option', 'select']
};

Jaml.TextNode = function(text) {
  this.text = text;
};

Jaml.TextNode.prototype = {
  render: function() {
    return this.text;
  }
};