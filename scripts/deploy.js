const { ethers, run, network } = require("hardhat");

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");

  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();
  console.log(`Deployed contract to:  ${simpleStorage.address}`);
  console.log(network.config);
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address, []);
  }
  const currentValue = await simpleStorage.retrieve();
  console.log(`Current Value is: ${currentValue}}`)

  const transactionResponse = await simpleStorage.store(7)
  await transactionResponse.wait()
  const updatedValue = await simpleStorage.retrieve()
  console.log(`Updated Value is: ${updatedValue}}`)
}

async function verify(contractAddress, args) {
  console.log("Verifting contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArgument: arg,
    });
  } catch (e) {
    if (e.message.toLowerCase().inclues("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(e);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit();
  });
