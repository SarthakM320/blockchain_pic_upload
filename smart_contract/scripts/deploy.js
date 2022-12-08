const main = async() => {
  

  const Photos = await hre.ethers.getContractFactory("uploadPhoto");
  const photo_contract = await Photos.deploy();

  await photo_contract.deployed();

  console.log("Contract deployed to: ", photo_contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

const runMain = async() => {
  try{
    await main();
    process.exit(0);
  }catch (error){
    console.error(error);
    process.exit(1);
  }
}

runMain();