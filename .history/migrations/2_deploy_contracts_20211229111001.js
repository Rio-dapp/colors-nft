var ColorsContract = artifacts.require("ColorsContract");
var Arg = ["Color token","Color"];
module.exports = deployer => {
    //deployer.deploy(ColorsContract, Arg);
    deployer.deploy(ColorsContract);
};