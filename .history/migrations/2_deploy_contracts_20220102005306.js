var ColorsContract = artifacts.require("ColorsContract");
var RoksToken = artifacts.require("RoksToken");

var Arg = ["Color token","Color"];
module.exports = deployer => {
    //deployer.deploy(ColorsContract, Arg);
    deployer.deploy(RoksToken);
    deployer.deploy(ColorsContract);
};