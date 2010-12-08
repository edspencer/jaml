require("./spec_helper.js");

describe("Jaml.Template", function() {
  
  beforeEach(function(){
    // fooBar = new Jaml.Node("fooBar");
  });
  
  describe("basic", function() {
    it("renders", function(){
      assert.equal("<ul>\n" +
                   "  <li>red</li>\n" +
                   "  <li>green</li>\n" + 
                   "</ul>\n", 
                   new Jaml.Template(function(){
                     ul(
                       li("red"),
                       li("green")
                     )
                   }).render());
    });
    
    it("renders with data", function(){
      assert.equal("<ul>\n" +
                   "  <li>red</li>\n" +
                   "  <li>green</li>\n" + 
                   "</ul>\n", 
                   new Jaml.Template(function(widget){
                     ul(
                       li(widget.primaryColor),
                       li(widget.secondaryColor)
                     )
                   }).render({primaryColor: "red", secondaryColor: "green"}));
    });    
  });
  
  describe("array data", function() {
    it("renders the template for each item in the array", function(){
      assert.equal("<ul>\n" +
                   "  <li>red</li>\n" +
                   "  <li>green</li>\n" + 
                   "</ul>\n" +
                   "<ul>\n" +
                   "  <li>orange</li>\n" +
                   "  <li>blue</li>\n" + 
                   "</ul>\n" +
                   "<ul>\n" +
                   "  <li>yellow</li>\n" +
                   "  <li>purple</li>\n" + 
                   "</ul>\n",
                   new Jaml.Template(function(widget){
                     ul(
                       li(widget.primaryColor),
                       li(widget.secondaryColor)
                     )
                   }).render([
                     {primaryColor: "red", secondaryColor: "green"},
                     {primaryColor: "orange", secondaryColor: "blue"},
                     {primaryColor: "yellow", secondaryColor: "purple"}
                   ]));
    });    
  });
});

