/**
 * @class Jaml
 * @author Ed Spencer (http://edspencer.net)
 * Jaml is a simple JavaScript library which makes HTML generation easy and pleasurable.
 * Examples: http://edspencer.github.com/jaml
 * Introduction: http://edspencer.net/2009/11/jaml-beautiful-html-generation-for-javascript.html
 */
Jaml = function() {
	var merge = function() {
		var obj = {};
		for(var x=0;x<arguments.length;x++) {
			for(var name in arguments[x])
				obj[name] = arguments[x][name];
		}
		return obj;
	}

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
    render: function(templates, name, thisObj, data) {
    	var tmpls, args;
    	if(typeof templates === 'object') {
    		tmpls = merge(this.templates, templates);
    		args = Array.prototype.slice.call(arguments, 1);
    	}
    	else {
    		args = arguments;
    		tmpls = this.templates;
    	}

    	var template = typeof args[0] === 'function' ? args[0] : tmpls[args[0]],
          renderer = new Jaml.Template(template, tmpls);
      return renderer._render.apply(renderer, Array.prototype.slice.call(args, 1));
    }
  };
}();