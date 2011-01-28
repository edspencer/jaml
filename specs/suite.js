require("./spec_helper")

if (jasmine.executeSpecsInFolder)
  jasmine.executeSpecsInFolder(__dirname)
else
  jasmine.requireAllSpecFiles(__dirname)
