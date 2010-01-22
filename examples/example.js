// CommonJS example

var Jaml = require("jaml").Jaml;

Jaml.register('simple', function() {
  p("this is a test");
});

Jaml.register('multi', function() {
  p("first sibling");
  p("second sibling");
  p("third sibling");
});

Jaml.register('nested', function() {
  h1("some title");
  div(
    p("some stuff"),
    ul(
      li('list'),
      li('of'),
      li('items')
    )
  );
});

Jaml.register('product', function(data) {
  h2(data.title);
  div(
    img({src: data.thumbnail}),
    p(data.description),
    form()
  );
});

Jaml.register('category', function(category) {
  h1(category.title);
  div({cls: 'products'},
    Jaml.render('product', category.products)
  );
});

var product = {
  title: 'My Product',
  thumbnail: 'some.jpg',
  description: 'It is great!'
};

var category = {
  title: "DVDs",
  products: [product, product]
};

print(Jaml.render('category', category));
