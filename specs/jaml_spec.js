require("./spec_helper.js");

describe("Jaml (top-level)", function() {

  beforeEach(function(){
    Jaml.templates = {};
  })
  
  describe("you can register a template and then use it to render", function() {
    it("works with no data passed in (very simple)", function(){
      Jaml.register("color", function(){
        ul(
          li("red"),
          li("green")
        )
      });
    
      expect(Jaml.render("color")).
     toEqual("<ul>\n" +
             "  <li>red</li>\n" +
             "  <li>green</li>\n" + 
             "</ul>\n");
    });

    it("works with data passed in", function(){
      Jaml.register("color", function(widget){
        ul(
          li(widget.primaryColor),
          li(widget.secondaryColor)
        )
      });
    
      expect(Jaml.render("color", {primaryColor:"red", secondaryColor:"green"} )).
     toEqual("<ul>\n" +
             "  <li>red</li>\n" +
             "  <li>green</li>\n" + 
             "</ul>\n");
    });

    it("can have multiple templates", function(){
      Jaml.register("color", function(widget){
        ul(
          li(widget.primaryColor),
          li(widget.secondaryColor)
        )
      });
    
      Jaml.register("shape", function(widget){
        p(widget.shape)
      });
      
      var christmasTree = {primaryColor:"red", secondaryColor:"green", shape:"round"};
      
      expect(Jaml.render("color", christmasTree )).
     toEqual("<ul>\n" +
             "  <li>red</li>\n" +
             "  <li>green</li>\n" + 
             "</ul>\n");
      
      expect(Jaml.render("shape", christmasTree )).
     toEqual("<p>round</p>\n");        
    });
    
    it("can override a template by using the same name", function(){
      var christmasTree = {shape:"round"};
      
      Jaml.register("shape", function(widget){
        p(widget.shape)
      });
      expect(Jaml.render("shape", christmasTree )).
     toEqual("<p>round</p>\n");
                   
      Jaml.register("shape", function(widget){
        div(widget.shape)
      });
      expect(Jaml.render("shape", christmasTree )).
     toEqual("<div>round</div>\n");

    });
    
  });    
});

