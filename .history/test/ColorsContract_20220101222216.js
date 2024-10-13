const ColorsContract = artifacts.require("ColorsContract");
contract('ColorsContract', (accounts) => {
    var MargeCommision = 1;

    it('Mint with problems', async () => {
        const ColorsContractInstance = await ColorsContract.deployed();
        var callerAccount = accounts[0];
        
        // mintRandomColor -1 
        try
        {
            var result = await ColorsContractInstance.mintRandomColor(-1, {from: callerAccount});
            assert.fail("mintRandomColor passed -1");
        }
        catch(err)
        {
            assert.include(err.message, "value out-of-bounds", "mintRandomColor -1 value out-of-bounds");
        }

        var count = await ColorsContractInstance.balanceOf(callerAccount);
        assert.equal(count, 0, 'balanceOf must be 0');
    });

    it('Mint random colors', async () => {
        const ColorsContractInstance = await ColorsContract.deployed();
        var callerAccount = accounts[0];
        await ColorsContractInstance.mintRandomColor(1,{from: callerAccount});
        await ColorsContractInstance.mintRandomColor(10,{from: callerAccount});
        await ColorsContractInstance.mintRandomColor(100,{from: callerAccount});
        var count = await ColorsContractInstance.balanceOf(callerAccount);
        assert.equal(count, 3, 'balanceOf must be 3');
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

    it('Set Marge commision', async () => {
        const ColorsContractInstance = await ColorsContract.deployed();
        var callerAccount = accounts[0];

        var commision = await ColorsContractInstance.MargeCommision.call();
        assert.equal(commision, 0, 'commision must be 0');
        
        var setCommision = await ColorsContractInstance.setMargeCommision(MargeCommision,
            {from: callerAccount})
        var commisionSeted = await ColorsContractInstance.MargeCommision.call();
        console.log("-----");
        console.log(commisionSeted.toNumber());
        console.log(MargeCommision);
        assert.equal(commisionSeted.toNumber(), MargeCommision, 'commision must be MargeCommision = ' +MargeCommision);

    });

    it('Marge colors', async () => {
        const ColorsContractInstance = await ColorsContract.deployed();
        var callerAccount = accounts[0];

        var token0 = await ColorsContractInstance.tokenOfOwnerByIndex(callerAccount,0);
        var token1 = await ColorsContractInstance.tokenOfOwnerByIndex(callerAccount,1);
        
        await ColorsContractInstance.margeColors(token0,token1,1,
            {from: callerAccount, value: MargeCommision});
     
        var count = await ColorsContractInstance.balanceOf(callerAccount);
        var tokenResult = await ColorsContractInstance.tokenOfOwnerByIndex(callerAccount,count - 1);
        console.log("Result: ");
        console.log(tokenResult);
        assert.equal(count, 4, 'balanceOf must be 4');
    });
});