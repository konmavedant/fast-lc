# Real-Time Document Upload System

A decentralized document management system built on Avalanche blockchain with real-time upload capabilities and smart contract integration.

## Features

- 🔐 **Wallet Integration**: MetaMask and Core Wallet support
- 📄 **Document Management**: Upload, store, and manage documents on blockchain
- ⚡ **Real-Time Updates**: Live status updates during upload process
- 🚀 **Batch Upload**: Upload multiple documents in a single transaction
- 🔒 **Smart Contract Security**: Built with OpenZeppelin security standards
- 🌐 **Multi-Network Support**: Avalanche Mainnet and Fuji Testnet
- 📱 **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## Smart Contract Features

- **Document Storage**: Store document metadata and hashes on blockchain
- **Batch Operations**: Upload multiple documents efficiently
- **Access Control**: Secure document management with ownership controls
- **Event Logging**: Comprehensive event tracking for all operations
- **Gas Optimization**: Efficient storage and retrieval operations

## Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask or Core Wallet browser extension
- AVAX tokens for gas fees (testnet or mainnet)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fast-lc
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_AVALANCHE_MAINNET_RPC=https://api.avax.network/ext/bc/C/rpc
   NEXT_PUBLIC_AVALANCHE_FUJI_RPC=https://api.avax-test.network/ext/bc/C/rpc
   NEXT_PUBLIC_MAINNET_CONTRACT_ADDRESS=YOUR_MAINNET_CONTRACT_ADDRESS
   NEXT_PUBLIC_TESTNET_CONTRACT_ADDRESS=YOUR_TESTNET_CONTRACT_ADDRESS
   ```

4. **Deploy Smart Contract**
   - Follow the [Deployment Guide](./DEPLOYMENT_GUIDE.md)
   - Update contract addresses in `contract-interface.ts`

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Smart Contract Deployment

### Using Remix IDE

1. Open [Remix IDE](https://remix.ethereum.org/)
2. Create new file `DocumentStorage.sol`
3. Copy the contract code from `contracts/DocumentStorage.sol`
4. Install OpenZeppelin dependencies
5. Compile and deploy to Avalanche network

### Contract Addresses

After deployment, update the addresses in `components/admin-dashboard/contract-interface.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  43114: "YOUR_MAINNET_CONTRACT_ADDRESS",    // Avalanche Mainnet
  43113: "YOUR_TESTNET_CONTRACT_ADDRESS",    // Avalanche Fuji Testnet
  1337: "YOUR_LOCAL_CONTRACT_ADDRESS",       // Local Development
}
```

## Usage

### 1. Connect Wallet
- Click "Connect Wallet" button
- Approve MetaMask/Core Wallet connection
- Ensure you're on Avalanche network

### 2. Select Documents
- Choose files to upload (PDF, JPG, DOCX supported)
- Review file details and sizes
- Remove unwanted files if needed

### 3. Upload to Blockchain
- Click "Upload Documents On-Chain"
- Confirm transaction in wallet
- Monitor real-time upload progress
- View transaction details and explorer links

### 4. Track Documents
- View upload status for each document
- Access transaction hashes and block information
- Navigate to blockchain explorer for verification

## Network Configuration

### Avalanche Mainnet (Chain ID: 43114)
- **RPC URL**: https://api.avax.network/ext/bc/C/rpc
- **Block Explorer**: https://snowtrace.io/
- **Currency**: AVAX

### Avalanche Fuji Testnet (Chain ID: 43113)
- **RPC URL**: https://api.avax-test.network/ext/bc/C/rpc
- **Block Explorer**: https://testnet.snowtrace.io/
- **Currency**: AVAX (testnet tokens)

## Gas Costs

### Estimated Gas Usage
- **Single Document**: 80,000 - 120,000 gas
- **Batch Upload (5 docs)**: 200,000 - 300,000 gas
- **Document Retrieval**: 25,000 gas (read operation)

### Cost Calculation
```
Gas Cost = Gas Used × Gas Price
Example: 100,000 × 25 Gwei = 0.0025 AVAX
```

## Security Features

- **Reentrancy Protection**: Prevents reentrancy attacks
- **Access Control**: Only document owners can modify their documents
- **Input Validation**: Comprehensive validation of all inputs
- **Event Logging**: Full audit trail of all operations
- **Ownership Controls**: Secure contract administration

## File Support

### Supported Formats
- **Documents**: PDF, DOCX, TXT
- **Images**: JPG, JPEG, PNG
- **Archives**: ZIP, RAR (with size limits)

### File Size Limits
- **Individual File**: Up to 10MB
- **Batch Upload**: Up to 50MB total
- **Hash Generation**: SHA-256 for file integrity

## Development

### Project Structure
```
fast-lc/
├── components/
│   └── admin-dashboard/
│       ├── on-chain-data.tsx      # Main upload component
│       └── contract-interface.ts  # Smart contract integration
├── contracts/
│   └── DocumentStorage.sol        # Smart contract
├── public/                        # Static assets
└── styles/                        # CSS and styling
```

### Key Components

- **OnChainData**: Main document upload interface
- **ContractInterface**: Smart contract ABI and configuration
- **DocumentStorage**: Solidity smart contract
- **Wallet Integration**: MetaMask and Core Wallet support

### Technologies Used

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Blockchain**: Ethereum/Avalanche, ethers.js
- **Smart Contracts**: Solidity, OpenZeppelin
- **Build Tool**: Next.js 14

## Testing

### Test Network
- Use Avalanche Fuji testnet for development
- Get testnet AVAX from [Avalanche Faucet](https://faucet.avax.network/)

### Contract Testing
1. Deploy to testnet first
2. Test all functions with small files
3. Verify event emissions
4. Check gas optimization

## Troubleshooting

### Common Issues

1. **Wallet Connection Failed**
   - Ensure MetaMask/Core Wallet is installed
   - Check network configuration
   - Refresh page and retry

2. **Transaction Failed**
   - Verify sufficient AVAX balance
   - Check gas limits
   - Ensure correct network selection

3. **Contract Not Found**
   - Update contract addresses
   - Verify network compatibility
   - Check contract deployment status

### Error Messages

- **"Contract not deployed on network"**: Update contract addresses
- **"Insufficient funds"**: Add more AVAX to wallet
- **"User rejected transaction"**: Check wallet permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Check the [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- Review Avalanche documentation
- Open an issue on GitHub

## Roadmap

- [ ] IPFS integration for file storage
- [ ] Advanced document encryption
- [ ] Multi-signature document approval
- [ ] Document versioning and history
- [ ] API endpoints for external integration
- [ ] Mobile app development

## Acknowledgments

- [Avalanche](https://www.avax.network/) for blockchain infrastructure
- [OpenZeppelin](https://openzeppelin.com/) for security libraries
- [Remix IDE](https://remix.ethereum.org/) for smart contract development
- [Ethers.js](https://docs.ethers.io/) for blockchain interaction
