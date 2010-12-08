require.paths.push("specs")
require.paths.push("src")

require("../../jasmine-node/lib/jasmine")

for(var key in jasmine) {
  global[key] = jasmine[key]
}

require("Jaml")
require("Node")
require("Template")