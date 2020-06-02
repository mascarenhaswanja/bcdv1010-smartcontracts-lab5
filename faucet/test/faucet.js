const Faucet = artifacts.require("Faucet");
const truffleAssert = require("truffle-assertions");
const BigNumber = require("bignumber.js");

contract("Faucet", (accounts) => {
    const creator = accounts[0];
    const donor = accounts[1];
    const beneficiary =  accounts[2];
    const withdrawalAmount = 2000000000000000;
    const refilAmount = 10000000000000000;
    let faucetInstance;

    before(async () => {
        faucetInstance = await Faucet.deployed({ from: creator });
        await web3.eth.sendTransaction({
            from: donor,
            to: faucetInstance.address,
            value: refilAmount
        });

        const balance = await web3.eth.getBalance(faucetInstance.address);
        assert.equal(
            refilAmount, 
            balance, 
            "The balance of the contract should be as expected"
        );
    });

    it("should be able to withdraw using withdraw()", async () => {
        const beneficiaryBalance = await web3.eth.getBalance(beneficiary);
        const faucetBalance = await web3.eth.getBalance(faucetInstance.address);
        const tx = await faucetInstance.withdraw(
            web3.utils.toBN(withdrawalAmount), 
            { from: beneficiary }
        );

        // Obtain the gas price
        const trx = await web3.eth.getTransaction(tx.receipt.transactionHash);
        const transactionFee = web3.utils
            .toBN(trx.gasPrice)
            .mul(web3.utils.toBN(tx.receipt.gasUsed));

        const faucetNewBalance = await web3.eth.getBalance(faucetInstance.address);
        const calculatedFaucetBalance = web3.utils
            .toBN(faucetBalance)
            .sub(web3.utils
            .toBN(withdrawalAmount));

        const beneficiaryNewBalance = await web3.eth
            .getBalance(beneficiary);

        const calculateBeneficiaryBalance =
            web3.utils
                .toBN(beneficiaryBalance)
                .add(web3.utils.toBN(withdrawalAmount))
                .sub(transactionFee)
                .toString();

        assert.equal(
            beneficiaryNewBalance,
            calculateBeneficiaryBalance,
            "The beneficiary balance is not as expected"
        );

        assert.equal(
            faucetNewBalance,
            calculatedFaucetBalance,
            "The contract balance is not as expected."
        );

        truffleAssert.eventEmitted(tx, "Withdrawal", (obj) => {
            return (
                obj.to === beneficiary && 
                new BigNumber(obj.amount).isEqualTo(new BigNumber(withdrawalAmount))
            );
        });
    });

    it("should revert on withdraw if amount exceeds the contract balance", async () => {
        const withdrawalAmount = web3.utils
            .toBN(refilAmount)
            .add(web3.utils.toBN(200));
        await truffleAssert.reverts(
            faucetInstance.withdraw(withdrawalAmount, { from: beneficiary }),
            "Faucet: Insufficient balance for withdrawal request"
        );
    }); 
});