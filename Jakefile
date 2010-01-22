var FILE = require("file");
var JAKE = require("jake");

JAKE.task("default", ["Jaml-all.js", "lib/jaml.js"]);

JAKE.file("Jaml-all.js", ["src/Jaml.js", "src/Node.js", "src/Template.js"], function(t) {
    concat(t.name(), t.prerequisites());
});

JAKE.task("lib/jaml.js", ["Jaml-all.js", "src/commonjs.js"], function(t) {
    concat(t.name(), t.prerequisites());
});

function concat(target, sources) {
    var f = FILE.open(target, "w", { charset : "UTF-8" });
    try {
        sources.forEach(function(dep) {
            FILE.open(dep, "r", { charset : "UTF-8" }).copy(f).close();
            f.write("\n");
        });
    } finally {
        f.close();
    }
}
