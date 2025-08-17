# DocumentStorage Smart Contract Deployment Guide

## Overview
This guide will help you deploy the DocumentStorage smart contract to the Avalanche blockchain using Remix IDE.

## Prerequisites
1. **MetaMask or Core Wallet** installed and configured
2. **AVAX tokens** for gas fees (testnet or mainnet)
3. **Remix IDE** access (https://remix.ethereum.org/)

## Smart Contract Details

### Contract Name: DocumentStorage
- **Solidity Version**: ^0.8.19
- **License**: MIT
- **Dependencies**: OpenZeppelin Contracts

### Key Features
- Document metadata storage on blockchain
- Batch upload functionality
- User document management
- Access control and security features

## Deployment Steps

### Step 1: Prepare Remix IDE
1. Open [Remix IDE](https://remix.ethereum.org/)
2. Create a new workspace or use existing one
3. Create a new file called `DocumentStorage.sol`

### Step 2: Install Dependencies
1. In Remix, go to the **Package Manager** plugin
2. Search for and install: `@openzeppelin/contracts`
3. Version: `^5.0.0` or latest

### Step 3: Copy Contract Code
Copy the entire `DocumentStorage.sol` contract code into your Remix file.

### Step 4: Compile Contract
1. Go to the **Solidity Compiler** plugin
2. Set compiler version to `0.8.19` or higher
3. Click **Compile DocumentStorage.sol**
4. Ensure no compilation errors

### Step 5: Configure Network
1. Go to the **Deploy & Run Transactions** plugin
2. Set **Environment** to **Injected Provider - MetaMask**
3. Connect your wallet
4. **Select Network**:
   - **Avalanche Mainnet**: Chain ID 43114
   - **Avalanche Fuji Testnet**: Chain ID 43113 (Recommended for testing)

### Step 6: Deploy Contract
1. **Contract**: Select `DocumentStorage`
2. **Account**: Select your connected wallet
3. **Gas Limit**: Leave as default (usually sufficient)
4. **Value**: 0 (no ETH/AVAX needed for deployment)
5. Click **Deploy**
6. **Confirm transaction** in your wallet

### Step 7: Get Contract Address
1. After successful deployment, copy the **Contract Address**
2. Update the `CONTRACT_ADDRESSES` in `contract-interface.ts`

## Network Configuration

### Avalanche Mainnet (Chain ID: 43114)
- **RPC URL**: https://api.avax.network/ext/bc/C/rpc
- **Chain ID**: 43114
- **Currency Symbol**: AVAX
- **Block Explorer**: https://snowtrace.io/

### Avalanche Fuji Testnet (Chain ID: 43113)
- **RPC URL**: https://api.avax-test.network/ext/bc/C/rpc
- **Chain ID**: 43113
- **Currency Symbol**: AVAX
- **Block Explorer**: https://testnet.snowtrace.io/

## Update Contract Addresses

After deployment, update the contract addresses in `components/admin-dashboard/contract-interface.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  // Avalanche Mainnet
  43114: "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE",
  // Avalanche Fuji Testnet
  43113: "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE",
  // Local development
  1337: "YOUR_LOCAL_CONTRACT_ADDRESS_HERE",
}
```

## Testing the Contract

### Test Functions
1. **uploadDocument**: Upload a single document
2. **batchUploadDocuments**: Upload multiple documents at once
3. **getDocument**: Retrieve document details
4. **getUserDocuments**: Get user's uploaded documents

### Test Data Example
```javascript
// Document hash (IPFS hash or file hash)
"QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"

// Document name
"Sample Document.pdf"

// File size (in bytes)
"1048576"

// File type
"application/pdf"
```

## Gas Estimation

### Typical Gas Costs (Fuji Testnet)
- **Single Document Upload**: ~80,000 - 120,000 gas
- **Batch Upload (5 documents)**: ~200,000 - 300,000 gas
- **Document Retrieval**: ~25,000 gas (read operation)

### Gas Cost Calculation
```
Gas Cost = Gas Used × Gas Price
Example: 100,000 × 25 Gwei = 0.0025 AVAX
```

## Security Considerations

1. **Access Control**: Only document owners can remove their documents
2. **Reentrancy Protection**: Uses OpenZeppelin's ReentrancyGuard
3. **Input Validation**: All inputs are validated before processing
4. **Event Logging**: All operations are logged as events

## Troubleshooting

### Common Issues
1. **Compilation Errors**: Check Solidity version compatibility
2. **Deployment Failures**: Ensure sufficient AVAX for gas fees
3. **Network Issues**: Verify correct network selection
4. **Contract Interaction Errors**: Check contract address and ABI

### Error Messages
- **"Contract not deployed on network"**: Update contract addresses
- **"Insufficient funds"**: Add more AVAX to wallet
- **"User rejected transaction"**: Check wallet permissions

## Support

For technical support or questions:
1. Check Remix IDE documentation
2. Review Avalanche documentation
3. Check contract compilation logs
4. Verify network configuration

## Next Steps

After successful deployment:
1. Test contract functions
2. Update frontend configuration
3. Deploy to mainnet (if ready)
4. Monitor contract usage and gas costs
