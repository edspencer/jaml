Node = function(config) {
  Ext.apply(this, config);
};

Jaml = (function() {
  return {
    tags: [
      "html", "head", "body", "script", "meta", "title", "link",
      "div", "p", "span", 
      "table", "tr", "th", "td", "thead", "tbody",
      "ul", "ol", "li", 
      "dl", "dt", "dd",
      "h1", "h2", "h3", "h4", "h5", "h6", "h7"
    ],
    
    nodes: [],
    
    push: function(node) {
      this.nodes.push(node);
    },
    
    claim: function(num) {
      var claimed = this.nodes.slice(this.nodes.length - num);
      
      for (var i=0; i < num; i++) {
        this.nodes.pop();
      };
      
      return claimed;
    },
    
    render: function(node, depth) {
      var elements = [],
          depth    = depth || 0;
      
      var add = function(str) {
        str = String.leftPad(str, str.length + (depth * 2), " ");
        elements.push(str);
      };
      
      if (Ext.isArray(node.children) && node.children.length > 0) {
        add(this.open(node));
        
        for (var i=0; i < node.children.length; i++) {
          elements = elements.concat(this.render(node.children[i], depth + 1));
        };
        
        add(this.close(node));
      } else if (Ext.isString(node.text)) {
        add(this.open(node));
        
        add(node.text);
        
        add(this.close(node));
      } else {
        add(this.open(node));
        add(this.close(node));
      }
      
      return elements;
    },
    
    open: function(node) {
      attrs = "";
      
      for (var name in node) {
        if (name == 'children' || name == 'tag') continue;
        
        attrs += name + "=\"" + node[name] + "\" ";
      }
      
      return "<" + node.tag + " " + attrs + ">";
    },
    
    close: function(node) {
      return "</" + node.tag + ">";
    },
    
    shortTag: function(node) {
      attrs = "";
      
      for (var name in node) {
        if (name == 'children' || name == 'tag') continue;
        
        attrs += name + "=\"" + node[name] + "\" ";
      }
      
      return "<" + node.tag + " " + attrs + " />";
    }
  };
})();

Ext.each(Jaml.tags, function(meth) {
  var defaults = {
    tag: meth
  };
  
  Jaml[meth] = function(meth) {
    return function() {
      var config     = {tag: meth},
          childCount = 0;
    
      for (var i=0; i < arguments.length; i++) {
        var arg = arguments[i];
        
        if (arg instanceof Node) {
          childCount ++;
        } else {
          if (Ext.isString(arg)) {
            config.text = arg;
          } else if (Ext.isObject(arg)) {
            Ext.applyIf(config, arg);
          }
        }
      };
      
      var node = new Node(config);
    
      if (childCount > 0) {
        node.children = Jaml.claim(childCount);
      }
    
      Jaml.push(node);
    
      return node;
    };
  }(meth);
}, this);

with (Jaml) {
  html(
    head(
      link({preset: "contentType"}),
      title("Get It")
    ),
    body(
      div({id: 'loading-mask'}),
      div({id: 'loading'},
        div({cls: 'loading-indicator'}),
        ul(
          li("First"),
          li("Second"),
          li("Third")
        )
      )
    )
  );
  
  var output = render(Jaml.nodes[0]);
    
  Ext.each(output, function(line) {
    console.log(line);
  }, this);
};


Jaml.render(function() {
  html(
    head(
      meta({preset: "contentType"}),
      title("Get It")
    ),
    body(
      div({id: 'loading-mask'}),
      div({id: 'loading'},
        div({cls: 'loading-indicator'}),
        ul(
          li("First"),
          li("Second"),
          li("Third"),
          
          render(function(name) {
            li(
              span("Name:"),
              name
            );
          }, ['First', 'Second', 'Third'])
        )
      )
    )
  ); 
});

Outputs:

<html>
  <head>
    <meta rah />
    <title>Get It</title>
  </head>
  <body>
    <div id="loading-mask"></div>
    <div id="loading">
      <div class="loading-indicator"></div>
      <ul>
        <li>First</li>
        <li>Second</li>
        <li>Third</li>
      </ul>
    </div>
  </body>
</html>