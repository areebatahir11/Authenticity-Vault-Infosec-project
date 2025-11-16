//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {AuthenticityVault} from "src/Contracts/Autenticity_vault.sol";

contract DeployAuthenticityVault is Script {
    function run() external {
        vm.startBroadcast();
        new AuthenticityVault();
        vm.stopBroadcast();
    }
}
