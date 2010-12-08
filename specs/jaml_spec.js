require("./spec_helper.js");

describe("Jaml (top-level)", function() {

  beforeEach(function(){
    Jaml.templates = {}
  })
  
  describe("you can register a template and then use it to render", function() {
    it("works with no data passed in (very simple)", function(){
      Jaml.register("color", function(){
        ul(
          li("red"),
          li("green")
        )
      });
    
      assert.equal("<ul>\n" +
                   "  <li>red</li>\n" +
                   "  <li>green</li>\n" + 
                   "</ul>\n", 
                   Jaml.render("color"));
    });

    it("works with data passed in", function(){
      Jaml.register("color", function(widget){
        ul(
          li(widget.primaryColor),
          li(widget.secondaryColor)
        )
      });
    
      assert.equal("<ul>\n" +
                   "  <li>red</li>\n" +
                   "  <li>green</li>\n" + 
                   "</ul>\n", 
                   Jaml.render("color", {primaryColor:"red", secondaryColor:"green"} ));
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
      
      var christmasTree = {primaryColor:"red", secondaryColor:"green", shape:"round"}

      assert.equal("<ul>\n" +
                   "  <li>red</li>\n" +
                   "  <li>green</li>\n" + 
                   "</ul>\n", 
                   Jaml.render("color", christmasTree ));
                   
      assert.equal("<p>round</p>\n",
                   Jaml.render("shape", christmasTree ));
    });
    
    it("can override a template by using the same name", function(){
      var christmasTree = {shape:"round"}
      
      Jaml.register("shape", function(widget){
        p(widget.shape)
      });
      assert.equal("<p>round</p>\n", Jaml.render("shape", christmasTree ));
                   
      Jaml.register("shape", function(widget){
        div(widget.shape)
      });
      assert.equal("<div>round</div>\n", Jaml.render("shape", christmasTree ));

    });
    
  });    
});

