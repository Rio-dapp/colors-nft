const ColorsContract = artifacts.require("ColorsContract");
const RoksToken = artifacts.require("RoksToken");

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
            assert.include(err.message, "value out-of-bounds", "Mint with problems, mintRandomColor -1 value out-of-bounds");
        }

        var count = await ColorsContractInstance.balanceOf(callerAccount);
        assert.equal(count, 0, 'balanceOf must be 0');
    });

    it('Mint random colors', async () => {
        const ColorsContractInstance = await ColorsContract.deployed();
        var callerAccount = accounts[0];
        await ColorsContractInstance.mintRandomColor(0,{from: callerAccount});
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
        console.log("       tokens count = " + count);

        for (let index = 0; index < count; index++) {
           var token = await ColorsContractInstance.tokenOfOwnerByIndex(callerAccount,index);
           console.log("        index = "+ index + ", token = " + token);
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
       
        assert.equal(commisionSeted.toNumber(), MargeCommision, 'commision must be MargeCommision = ' 
        + MargeCommision);
    });

    it('[predictColorAfterMarge] view First', async () => {
        const ColorsContractInstance = await ColorsContract.deployed();
        var callerAccount = accounts[0];

        var predictMarge = await ColorsContractInstance.predictColorAfterMarge(16777215,16777214,0);
        console.log("       [predictColorAfterMarge] view First " + predictMarge.toNumber());
        assert.equal(16777214, predictMarge.toNumber(), 'predictMarge must be 16777214');
    });

    it('[margeColors] Marge colors: 0 teration, existing tokens 0,1 index', async () => {
        const ColorsContractInstance = await ColorsContract.deployed();
        var callerAccount = accounts[0];

        var token0 = await ColorsContractInstance.tokenOfOwnerByIndex(callerAccount,0);
        var token1 = await ColorsContractInstance.tokenOfOwnerByIndex(callerAccount,1);
        
        await ColorsContractInstance.margeColors(token0, token1, 0,
            {from: callerAccount, value: MargeCommision});
     
        var count = await ColorsContractInstance.balanceOf(callerAccount);
        var tokenResult = await ColorsContractInstance.tokenOfOwnerByIndex(callerAccount,count - 1);
        console.log("       [Marge colors] tokenResult: " + tokenResult.toNumber());
        
        assert.equal(await web3.eth.getBalance(ColorsContractInstance.address), MargeCommision, 
                     'getBalance must be '+MargeCommision);
        assert.equal(count, 4, 'balanceOf must be 4');
    });

    
    it('[mintColors] and [predictColorAfterMarge] than show result', async () => {
        const ColorsContractInstance = await ColorsContract.deployed();
        var callerAccount = accounts[0];

        var mint = await ColorsContractInstance.mintColors([16777215,16777214], 
            ["16777215 test1", "16777214 test2"],{from: callerAccount});
        
        var predictMarge = await ColorsContractInstance.predictColorAfterMarge(16777215,16777214, 100);
        console.log("       [mintColors] view Second " + predictMarge.toNumber());
        assert.equal(predictMarge.toNumber(), 1, 'predictMarge must be 1');

        var count = await ColorsContractInstance.balanceOf(callerAccount);
        assert.equal(count, 6, 'balanceOf must be 6');
    });

    it('[setInfo] and [getInfo] than show result', async () => {
        const ColorsContractInstance = await ColorsContract.deployed();
        const RoksTokenInstance = await RoksToken.deployed();
        await RoksTokenInstance.Mint(1000);

        var callerAccount = accounts[0];
        var roksHolderAccount = accounts[1];
        assert.equal((await RoksTokenInstance.balanceOf(roksHolderAccount)), 0, 
                     'roksHolderAccount dosent have to ROKS tokens ');

        console.log("       " + (await RoksTokenInstance.balanceOf(roksHolderAccount)) +
        " / " + RoksTokenInstance.address + " / " + (await RoksTokenInstance.totalSupply()));
        
        await ColorsContractInstance.setROKS(RoksTokenInstance.address, roksHolderAccount);
        var roksTokenContract = await ColorsContractInstance.ROKSContract.call();
        assert.equal(roksTokenContract, RoksTokenInstance.address, 
            'roksTokenContract != RoksTokenInstance.address');
        
        var commision =500; 
        await ColorsContractInstance.setROKSCommision(commision);
        var roksRocksCommision = await ColorsContractInstance.RocksCommision.call();
        assert.equal(roksRocksCommision, commision, 
            'roksRocksCommision != ' + commision);
        
        
        var count = await ColorsContractInstance.balanceOf(callerAccount);
        assert.equal(count, 6, 'balanceOf must be 6');
    });
});