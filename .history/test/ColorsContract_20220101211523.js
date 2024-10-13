const ColorsContract = artifacts.require("ColorsContract");
contract('ColorsContract', (accounts) => {
    it('Mint random colors', async () => {
        const ColorsContractInstance = await ColorsContract.deployed();
        var callerAccount = accounts[0];
        await ColorsContractInstance.mintRandomColor(1,{from: callerAccount});
        await ColorsContractInstance.mintRandomColor(10,{from: callerAccount});
        await ColorsContractInstance.mintRandomColor(100,{from: callerAccount});
        var count = await ColorsContractInstance.balanceOf(callerAccount);
        
        assert.equal(count, 3, 'A correctness property about SendResponse of HelloBlockchain');
    });

    it('Check tokens', async () => {
        const ColorsContractInstance = await ColorsContract.deployed();
        var callerAccount = accounts[0];
       
        var count = await ColorsContractInstance.balanceOf(callerAccount);
       //var wei = web3.utils.toWei(count);
        console.log("tokens count = " + count);

        for (let index = 0; index < count; index++) {
           var token = await ColorsContractInstance.tokenOfOwnerByIndex(callerAccount,index);
           console.log("index = "+ index + ", token = " + token);
           assert.equal(await ColorsContractInstance.ownerOf(token), callerAccount, 'callerAccount not owned ' + token);
        }

       var lastToken = await ColorsContractInstance.LastColorHex.call();
       var token = await ColorsContractInstance.tokenOfOwnerByIndex(callerAccount,count - 1);
       assert.equal(lastToken.toNumber(), token.toNumber(), 'lastToken != token');
       
       //console.log(await ColorsContractInstance.ownerOf(lastToken));
      
       //console.log(().toString());
       //console.log((await ColorsContractInstance.testGet(lastToken)).toString());
       
       //tokenOfOwnerByIndex
       //.toString();

        // Because the function call can change the state of contract HelloBlockchain, please write assertions
        // below to check the contract state.
    });

    it('Transfet', async () => {
        const ColorsContractInstance = await ColorsContract.deployed();
        var callerAccount = accounts[0];
        await ColorsContractInstance.mintRandomColor(1,{from: callerAccount});
        await ColorsContractInstance.mintRandomColor(10,{from: callerAccount});
        await ColorsContractInstance.mintRandomColor(100,{from: callerAccount});
        var count = await ColorsContractInstance.balanceOf(callerAccount);
        
        assert.equal(count, 3, 'A correctness property about SendResponse of HelloBlockchain');
    });

});