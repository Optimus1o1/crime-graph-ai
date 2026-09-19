import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("----------------------------------------------------");
  console.log("CrimeGraph AI — Deploying CrimeGraphAnchor contract...");
  console.log("----------------------------------------------------");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "MATIC/POL");

  const CrimeGraphAnchor = await ethers.getContractFactory("CrimeGraphAnchor");
  const contract = await CrimeGraphAnchor.deploy();
  await contract.waitForDeployment();

  const deployedAddress = await contract.getAddress();
  console.log(">>> CrimeGraphAnchor successfully deployed to:", deployedAddress);

  // Write deployment info to a JSON file for backend/frontend consumption
  const deploymentInfo = {
    contractAddress: deployedAddress,
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
  };

  const outputPath = path.join(__dirname, "deployment.json");
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("Deployment details saved to:", outputPath);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
