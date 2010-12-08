require("./spec_helper.js");

describe("Jaml.Template", function() {
  
  beforeEach(function(){
    // fooBar = new Jaml.Node("fooBar");
  });

  describe("all html tags", function() {
    it("a giant integration test for all html tags, so we see what we're allowing." +
       "  intentionally locating this at the top of this spec file.", function(){      
      assert.equal(
        "<html>\n" +
        "  <head>\n" +
        "    <meta/>\n    <script/>\n    <title/>\n    <link/>\n" +
        "  </head>\n" +
        "  <body>\n" +
        "    <div/>\n    <p/>\n    <span/>\n    <a/>\n    <img/>\n" +
        "    <br/>\n    <hr/>\n" +
        "    <table>\n" +
        "      <thead>\n        <tr>\n          <th/>\n        </tr>\n      </thead>\n" +
        "      <tbody>\n        <tr>\n          <td/>\n        </tr>\n      </tbody>\n" +
        "    </table>\n" +
        "    <ul>\n      <li/>\n      <ol/>\n    </ul>\n" +
        "    <dl/>\n    <dt/>\n    <dd/>\n" +
        "    <h1/>\n    <h2/>\n    <h3/>\n    <h4/>\n    <h5/>\n    <h6/>\n    <h7/>\n" +
        "    <form>\n" +
        "      <fieldset>\n" +
        "        <label/>\n" +
        "        <input/>\n" +
        "        <textarea></textarea>\n" + //I'm not self-closing
        "      </fieldset>\n" +
        "    </form>\n" +
        "  </body>\n" +
        "</html>\n", 
      new Jaml.Template(function(){
        html(
          head(
            meta(), script(), title(), link()
          ),
          body(
            div(), p(), span(), a(), img(),
            br(), hr(),
            table(
              thead(tr(th())),
              tbody(tr(td()))
            ),
            ul(li(), ol()),
            dl(), dt(), dd(),
            h1(), h2(), h3(), h4(), h5(), h6(), h7(),
            form(
              fieldset(
                label(),
                input(),
                textarea()
              )
            )
          )
        )
      }).render());
    });
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

