const ColorsContract = artifacts.require("ColorsContract");
contract('ColorsContract', (accounts) => {

    it('Mint', async () => {
        console.log("ColorsContract start deploy...");
        const ColorsContractInstance = await ColorsContract.deployed();
        var callerAccount = accounts[0];
        var colorHex = [
                        await ColorsContractInstance.mintRandomColor(0,{from: callerAccount}),
                        await ColorsContractInstance.mintRandomColor(10,{from: callerAccount}),
                        await ColorsContractInstance.mintRandomColor(100,{from: callerAccount}),
        ];
        
        var count = await ColorsContractInstance.balanceOf(callerAccount);
        var wei = web3.utils.toWei(count);
        console.log("tokens count = " + wei);

        for (let index = 0; index < wei.length; index++) {
           var token = await ColorsContractInstance.tokenOfOwnerByIndex(callerAccount,index);
           assert.equal(token, colorHex[index], 'tokenOfOwnerByIndex need equel to ' + colorHex[index]);
           console.log("okenOfOwnerByIndex callerAccount has token " + token);
        }

       var lastToken = await ColorsContractInstance.LastColorHex.call();
       console.log("lastToken = " + lastToken.toString());
       
       console.log(await ColorsContractInstance.ownerOf(lastToken));
      
       //console.log(().toString());
       //console.log((await ColorsContractInstance.testGet(lastToken)).toString());
       
       //tokenOfOwnerByIndex
       //.toString();

        // Because the function call can change the state of contract HelloBlockchain, please write assertions
        // below to check the contract state.
        assert.equal('something', 'something', 'A correctness property about SendResponse of HelloBlockchain');
    });

});