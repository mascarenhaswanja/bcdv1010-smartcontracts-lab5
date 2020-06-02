/*const Calculator = artifacts.require("./Calculator.sol");
contract("Calculator", (accounts) => {
  it("should assert true", function (done) {
    const calculator = Calculator.deployed();
    assert.isTrue(true);
    done();
  });
});*/

/*const Calculator = artifacts.require("./Calculator");

contract("Calculator", (accounts) => {
  let contractInstance;
  // Create instance before all test cases
  before(() => {
    Calculator.deployed().then((calInstance) => {
      contractInstance = calInstance;
      console.log("Creating instance for all test cases");
    });
  });

  it("should return 10", () => {
    contractInstance.getVal.call().then((result) => {
      assert.equal(result.valueOf(), 10, "Test failed : should return 10");
    });
  });

  it("should return 23", () => {
    contractInstance.addNumber(10);
    contractInstance.subNumber(7);
    contractInstance.getVal
      .call()
      .then((result) => {
        assert.equal(result.valueOf(), 13, "Test failed : should return 13");
        contractInstance.addNumber(10);
        return contractInstance.getVal.call();
      })
      .then((result) => {
        assert.equal(result.valueOf(), 23, "Test failed : should return 23");
      });
  });
}); */
// Using async-await

const Calculator = artifacts.require("Calculator");

contract("Calculator", (accounts) => {
  let contractInstance;

  before(async () => {
    contractInstance = await Calculator.new(10);
    console.log("Creating instances for all test cases!");
  });

  it("should return 10", async () => {
    const result = await contractInstance.getVal.call();
    assert.equal(await result.valueOf(), 10, "Test failed : should return 10");
  });

  it("should return 23", async () => {
    contractInstance.addNumber(10);
    contractInstance.subNumber(7);
    let result = await contractInstance.getVal.call();
    assert.equal(result.valueOf(), 13, "Test failed : should return 13");
    await contractInstance.addNumber(10);
    result = await contractInstance.getVal.call();
    assert.equal(result.valueOf(), 23, "Test failed : should return 23");
  });
});