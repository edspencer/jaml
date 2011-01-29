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
     * @param {Object} thisObj Optional data object
     * @param {Object} data Optional data object
     */
    render: function(name, thisObj, data) {
      var template = this.templates[name],
          renderer = new Jaml.Template(template);
      return renderer.render.apply(renderer, Array.prototype.slice.call(arguments, 1));
    }
  };
}();