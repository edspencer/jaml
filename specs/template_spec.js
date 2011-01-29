require("./spec_helper.js");

describe("Jaml.Template", function() {
  
  describe("all html tags", function() {
    it("a giant integration test for all html tags, so we see what we're allowing." +
       "  intentionally locating this at the top of this spec file.", function(){      
      expect(new Jaml.Template(function(){
               html(
                 head(
                   meta(), script(), title(), link()
                 ),
                 body(
                   div(), p(), em(), strong(), span(), a(), img(),
                   br(), hr(),
                   table(
                     thead(tr(th())),
                     tfoot(tr(td())),
                     tbody(tr(td()))
                     
                   ),
                   ul(li(), ol()),
                   dl(), dt(), dd(),
                   h1(), h2(), h3(), h4(), h5(), h6(), h7(),
                   form(
                     fieldset(
                       label(),
                       input(),
                       textarea(),
                       select({name: "test"}, option({value: "test"}, "test"))
                     )
                   )
                 )
               )
             }).render()).
     toEqual("<html>\n" +
             "  <head>\n" +
             "    <meta/>\n    <script></script>\n    <title/>\n    <link/>\n" +
             "  </head>\n" +
             "  <body>\n" +
             "    <div/>\n    <p/>\n    <em></em>\n    <strong></strong>\n    <span/>\n    <a/>\n    <img/>\n" +
             "    <br/>\n    <hr/>\n" +
             "    <table>\n" +
             "      <thead>\n        <tr>\n          <th/>\n        </tr>\n      </thead>\n" +
             "      <tfoot>\n        <tr>\n          <td/>\n        </tr>\n      </tfoot>\n" +
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
             "        <select name=\"test\">\n" +
             "          <option value=\"test\">test</option>\n" +
             "        </select>\n" +
             "      </fieldset>\n" +
             "    </form>\n" +
             "  </body>\n" +
             "</html>\n");
    });
  });
  
  describe("basic", function() {
    it("renders", function(){
      expect(new Jaml.Template(function(){
               ul(
                 li("red"),
                 li("green")
               )
             }).render()).
     toEqual("<ul>\n" +
             "  <li>red</li>\n" +
             "  <li>green</li>\n" + 
             "</ul>\n");
    });
    
    it("renders with data", function(){
      var theWidget = {primaryColor: "red", secondaryColor: "green"}
      
      expect(new Jaml.Template(function(widget){
               ul(
                 li(widget.primaryColor),
                 li(widget.secondaryColor)
               )
             }).render(theWidget)).
     toEqual("<ul>\n" +
             "  <li>red</li>\n" +
             "  <li>green</li>\n" + 
             "</ul>\n");
    });    
  });
  
  describe("array data", function() {
    it("renders the template for each item in the array", function(){
      expect(new Jaml.Template(function(widget, i){
               ul({id: i},
                 li(widget.primaryColor),
                 li(widget.secondaryColor)
               )
             }).render([
               {primaryColor: "red", secondaryColor: "green"},
               {primaryColor: "orange", secondaryColor: "blue"},
               {primaryColor: "yellow", secondaryColor: "purple"}
             ])).
     toEqual("<ul id=\"0\">\n" +
             "  <li>red</li>\n" +
             "  <li>green</li>\n" + 
             "</ul>\n" +
             "<ul id=\"1\">\n" +
             "  <li>orange</li>\n" +
             "  <li>blue</li>\n" + 
             "</ul>\n" +
             "<ul id=\"2\">\n" +
             "  <li>yellow</li>\n" +
             "  <li>purple</li>\n" + 
             "</ul>\n");
    });
    it("renders the template for each item in the array, using thisObj", function(){
        expect(new Jaml.Template(function(widget, i){
                 ul({id: i, data: this.data},
                   li(widget.primaryColor),
                   li(widget.secondaryColor)
                 )
               }).render({data: "test"}, [
                 {primaryColor: "red", secondaryColor: "green"},
                 {primaryColor: "orange", secondaryColor: "blue"},
                 {primaryColor: "yellow", secondaryColor: "purple"}
               ])).
       toEqual("<ul data=\"test\" id=\"0\">\n" +
               "  <li>red</li>\n" +
               "  <li>green</li>\n" + 
               "</ul>\n" +
               "<ul data=\"test\" id=\"1\">\n" +
               "  <li>orange</li>\n" +
               "  <li>blue</li>\n" + 
               "</ul>\n" +
               "<ul data=\"test\" id=\"2\">\n" +
               "  <li>yellow</li>\n" +
               "  <li>purple</li>\n" + 
               "</ul>\n");
      });
  });
  
  
});

