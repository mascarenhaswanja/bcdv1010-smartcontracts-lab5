pragma solidity ^0.6.0;

contract Calculator {
    uint number;

    constructor(uint val) public {
        number = val;
    }

        function getVal() public view returns(uint) {
            return number;
        }

        function addNumber(uint val) public {
            number += val;
        }

        function subNumber(uint val) public {
            number -= val;
        }
}
