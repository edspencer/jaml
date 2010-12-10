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
      var template = this.templates[name];
      
      if (template==undefined) {
        var registeredTemplates = [];
        for (key in this.templates) {
          registeredTemplates.push("'" + key + "'");
        };
        registeredTemplates.sort();
        
        
        throw new Error("Jaml doesn't know about a template named '" + name + "'." +
                        "  Currently registered templates: " + registeredTemplates.join(", ") + ".");
      }
      
      var renderer = new Jaml.Template(template);
          
      return renderer.render(data);
    }    
  };
}();