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


// /**
//  * @class Jaml
//  * 
//  */
// Jaml = function() {
//   //Add methods for each tag
//   for (var i=0; i < this.tags.length; i++) {
//     this.createTagMethod(this.tags[i]);
//   };
// };
// 
// Jaml.prototype = {
//   
//   /**
//    * @property templates
//    * @type Object
//    * The collection of all registered named templates
//    */
//   templates: {},
//   
//   template: function(name, fn) {
//     // this.templates[name] = this.compile(fn);
//     
//     this.templates[name] = fn;
//   },
//   
//   compile: function(fn) {
//     with (this) {
//       eval("(" + fn.toString() + ")()");
//     }
//     
//     var nodes = this.nodes;
//     
//     this.nodes = [];
//     
//     return nodes;
//   },
//   
//   /**
//    * Creates a function for the tag name provided
//    * @param {String} tagName the name of the tag to make a method for
//    * @return {Function} The created function
//    */
//   createTagMethod: function(tagName) {
//     var f = function(tagName) {
//       return function() {
//         var config     = {tag: tagName},
//             childCount = 0;
// 
//         for (var i=0; i < arguments.length; i++) {
//           var arg = arguments[i];
// 
//           if (arg instanceof Jaml.Node) {
//             childCount ++;
//           } else {
//             if (typeof arg == 'string') {
//               config.text = arg;
//             } else if (typeof arg == 'object') {
//               for (var key in arg) {
//                 if (config[key] == undefined) config[key] = arg[key];
//               }
//             }
//           }
//         };
// 
//         var node = new Jaml.Node(config);
// 
//         if (childCount > 0) node.children = this.claim(childCount);
// 
//         this.push(node);
//         
//         return node;
//       };
//     }(tagName);
//     
//     this[tagName] = f;
//     
//     return f;
//   },
//   
//   /**
//    * @property prettify
//    * @type Boolean
//    * True to add whitespace indentation as appropriate to nested elements (defaults to true)
//    */
//   prettify: true,
//   
//   tags: [
//     "html", "head", "body", "script", "meta", "title", "link", "script",
//     "div", "p", "span", "a", "img",
//     "table", "tr", "th", "td", "thead", "tbody",
//     "ul", "ol", "li", 
//     "dl", "dt", "dd",
//     "h1", "h2", "h3", "h4", "h5", "h6", "h7",
//     "form", "input"
//   ],
//       
//   nodes: [],
//   
//   /**
//    * Pushes a Jaml.Node onto the current rendering stack
//    * @param {Jaml.Node} node The node to push
//    */
//   push: function(node) {
//     this.nodes.push(node);
//   },
//   
//   /**
//    * Pops the specified number of nodes off the top of the rendering stack and returns them
//    * @param {Number} num The number of nodes to claim
//    */
//   claim: function(num) {
//     var claimed = this.nodes.slice(this.nodes.length - num);
//     
//     for (var i=0; i < num; i++) {
//       this.nodes.pop();
//     };
//     
//     return claimed;
//   },
//   
//   render: function(name, data) {
//     data = data || {};
//     
//     var t = this.compile(this.templates[name]) || this.compile(name);
//     
//     console.log('rendering');
//     console.log(t);
//     console.log(data);
//     
//     with (data) {
//       var res = this.renderNode(t[0]);
//     }
//     
//     console.log(res);
//     console.log(res.join(""));
//     
//     return res.join("");
//   },
//   
//   renderNode: function(node, depth) {
//     var elements = [],
//         depth    = depth || 0;
//     
//     var add = function(str) {
//       // str = String.leftPad(str, str.length + (depth * 2), " ");
//       elements.push(str);
//     };
//     
//     if (node.children && node.children.length > 0) {
//       add(this.open(node));
//       
//       for (var i=0; i < node.children.length; i++) {
//         elements = elements.concat(this.renderNode(node.children[i], depth + 1));
//       };
//       
//       add(this.close(node));
//     } else if (typeof node.text == 'string') {
//       add(this.open(node));
//       
//       add(node.text);
//       
//       add(this.close(node));
//     } else {
//       add(this.open(node));
//       add(this.close(node));
//     }
//     
//     return elements;
//   },
//   
//   open: function(node) {
//     attrs = "";
//     
//     for (var name in node) {
//       if (name == 'children' || name == 'tag') continue;
//       
//       attrs += name + "=\"" + node[name] + "\" ";
//     }
//     
//     return "<" + node.tag + " " + attrs + ">";
//   },
//   
//   close: function(node) {
//     return "</" + node.tag + ">";
//   },
//   
//   shortTag: function(node) {
//     attrs = "";
//     
//     for (var name in node) {
//       if (name == 'children' || name == 'tag') continue;
//       
//       attrs += name + "=\"" + node[name] + "\" ";
//     }
//     
//     return "<" + node.tag + " " + attrs + " />";
//   }
// };
// 
// Jaml = new Jaml();