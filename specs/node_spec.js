require("./spec_helper.js");

describe("Jaml.Node", function() {
  
  beforeEach(function(){
    fooBar = new Jaml.Node("fooBar");
  });
  
  describe("tag closing", function() {
    it("self-closes by default", function(){
      assert.equal("<fooBar/>\n", new Jaml.Node("fooBar").render());
    });

    it("textarea (for example) should not self-close", function(){
      assert.equal("<textarea></textarea>\n", new Jaml.Node("textarea").render());
    });
  });
  
  describe("padding of spaces at the front", function() {
    it("properly prepends the specified amount of left padding", function(){
      assert.equal("<fooBar/>\n", new Jaml.Node("fooBar").render());
      assert.equal("<fooBar/>\n", new Jaml.Node("fooBar").render(0));
      assert.equal("     <fooBar/>\n", new Jaml.Node("fooBar").render(5));
    });
  });
  
  describe("attributes", function() {
    it("renders attributes as key value pairs separated by = in the tag", function(){
      assert.equal("<fooBar a=\"b\"/>\n", fooBar.setAttributes({a:"b"}).render());
    });

    it("renders several attributes in a row.  order is imposed.", function(){
      assert.equal("<fooBar a=\"b\" c=\"d\" x=\"y\"/>\n", fooBar.setAttributes({x:"y", a:"b", c:"d"}).render());
    });
  });
});

