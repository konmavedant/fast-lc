# Admin Dashboard - On-Chain Data Component

This component provides a complete interface for administrators to upload and manage documents on the Avalanche blockchain.

## Features

### 🔗 Wallet Connection
- **MetaMask Support**: Connect with MetaMask wallet
- **Core Wallet Support**: Connect with Core Wallet (Avalanche native)
- **Network Detection**: Automatically detects Avalanche mainnet (43114) and Fuji testnet (43113)
- **Network Switching**: Built-in buttons to switch between mainnet and testnet

### 📁 Document Upload
- **Multiple File Support**: Upload multiple documents simultaneously
- **File Validation**: Supports PDF, JPG, JPEG, and DOCX files
- **File Hash Generation**: Generates keccak256 hashes for blockchain storage
- **Size Display**: Shows file sizes in human-readable format

### ⛓️ Blockchain Integration
- **Smart Contract Interaction**: Integrates with document storage smart contract
- **Transaction Tracking**: Monitors transaction status and confirmation
- **Gas Usage Display**: Shows gas consumption for each transaction
- **Block Explorer Links**: Direct links to Snowtrace for transaction verification

## Smart Contract Integration

The component integrates with a smart contract that stores:
- File hash (keccak256)
- File metadata (name, size, type)
- Uploader address
- Timestamp
- Transaction hash

### Contract Functions
- `storeDocument(fileHash, fileName, fileSize, fileType)` - Stores document hash on-chain
- `getDocument(fileHash)` - Retrieves document metadata
- `getDocumentsByUploader(uploader)` - Gets all documents by a specific uploader

## Usage

### Prerequisites
1. **Wallet Installation**: MetaMask or Core Wallet must be installed
2. **Network Configuration**: Wallet must be connected to Avalanche network
3. **Smart Contract**: Deployed contract with the correct ABI and address

### Setup
1. **Update Contract Addresses**: Modify `contract-interface.ts` with your deployed contract addresses
2. **Network Configuration**: Ensure your wallet supports Avalanche networks
3. **Gas Fees**: Users need AVAX for transaction fees

### User Flow
1. **Connect Wallet**: Click "Connect Wallet" button
2. **Select Files**: Choose documents to upload (PDF, JPG, DOCX)
3. **Review Documents**: Check file list and remove unwanted files
4. **Upload On-Chain**: Click "Upload Documents On-Chain" button
5. **Monitor Progress**: Watch transaction status and confirmation
6. **Verify on Explorer**: Click "View on Explorer" to verify on Snowtrace

## Technical Details

### State Management
- `walletAddress`: Connected wallet address
- `documents`: Array of selected documents with status tracking
- `transactions`: Array of completed transactions
- `networkId`: Current blockchain network ID
- `networkName`: Human-readable network name

### File Processing
- **Hash Generation**: Uses ethers.js keccak256 for file hashing
- **Validation**: Ensures hash format matches blockchain requirements
- **Status Tracking**: Tracks upload progress (pending → uploading → success/error)

### Error Handling
- **Wallet Connection**: Handles connection failures gracefully
- **Network Issues**: Detects and reports network problems
- **Contract Errors**: Catches and displays smart contract interaction failures
- **File Validation**: Validates file types and sizes

## Security Considerations

### On-Chain Storage
- **File Hashes Only**: Stores file hashes, not actual file content
- **Metadata Validation**: Validates all metadata before storage
- **Access Control**: Smart contract should implement proper access controls

### User Privacy
- **File Content**: Files are never stored on the blockchain
- **Hash Privacy**: File hashes are public but don't reveal content
- **Address Privacy**: Consider using privacy solutions for sensitive data

## Customization

### Styling
- Uses Tailwind CSS for responsive design
- Follows the project's design system
- Customizable color schemes and layouts

### Functionality
- **File Types**: Modify `accept` attribute for different file types
- **Hash Algorithm**: Change from keccak256 to other algorithms
- **Contract Functions**: Add additional smart contract interactions
- **Network Support**: Extend to support other blockchain networks

### Contract Integration
- **ABI Updates**: Modify contract interface for different contract designs
- **Gas Estimation**: Add gas estimation before transactions
- **Batch Uploads**: Implement batch document uploads for efficiency

## Troubleshooting

### Common Issues
1. **Wallet Not Connecting**: Ensure MetaMask/Core Wallet is installed and unlocked
2. **Wrong Network**: Use network switching buttons to connect to Avalanche
3. **Transaction Fails**: Check gas fees and network congestion
4. **File Upload Errors**: Verify file format and size limits

### Debug Information
- Check browser console for detailed error messages
- Verify wallet network connection
- Confirm smart contract deployment and ABI compatibility

## Future Enhancements

### Planned Features
- **IPFS Integration**: Store actual files on IPFS with blockchain references
- **Batch Processing**: Upload multiple documents in single transaction
- **Document Retrieval**: Query and display previously uploaded documents
- **Access Control**: Role-based permissions for document access
- **Audit Trail**: Complete history of document modifications

### Performance Optimizations
- **Lazy Loading**: Load document lists on demand
- **Caching**: Cache frequently accessed document metadata
- **Compression**: Optimize file hash generation for large files
- **Off-chain Storage**: Hybrid approach for better scalability

## Support

For technical support or feature requests, please refer to the project documentation or contact the development team.
