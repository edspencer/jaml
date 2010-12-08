require("./spec_helper.js")

describe("Jaml.Node", function() {
  it("renders nothing inside if there's nothing in the node", function(){
    assert.equal("<fooBar></fooBar>\n", new Jaml.Node("fooBar").render())
  })  

  it("properly prepends the specified amount of left padding", function(){
    assert.equal("     <fooBar></fooBar>\n", new Jaml.Node("fooBar").render(5))
  })  
})

