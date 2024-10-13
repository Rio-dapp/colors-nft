const ColorsContract = artifacts.require("ColorsContract");
contract('ColorsContract', (accounts) => {

    it('testing SendResponse of ColorsContract', async () => {
        console.log("ColorsContract test");
        const ColorsContractInstance = await ColorsContract.deployed();
        var callerAccount = accounts[0];
        var colorHex0 = await ColorsContractInstance.mintColor({from: callerAccount});
        var colorHex1 = await ColorsContractInstance.mintColor({from: callerAccount});
        var lastToken =await ColorsContractInstance.LastColorHex.call();
       console.log(lastToken.toString());
       console.log(await ColorsContractInstance.ownerOf(lastToken));
       console.log((await ColorsContractInstance.balanceOf(callerAccount)).toString());
       console.log((await ColorsContractInstance.tokenOfOwnerByIndex(callerAccount,0)).toString());
       console.log((await ColorsContractInstance.tokenOfOwnerByIndex(callerAccount,1)).toString());
      
       console.log((await ColorsContractInstance.testGet(lastToken)).toString());
       
       //tokenOfOwnerByIndex
       //.toString();

        // Because the function call can change the state of contract HelloBlockchain, please write assertions
        // below to check the contract state.
        assert.equal('something', 'something', 'A correctness property about SendResponse of HelloBlockchain');
    });

});