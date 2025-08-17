// Contract ABI for DocumentStorage smart contract (Deployed on Avalanche Fuji Testnet)
export const DOCUMENT_STORAGE_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "documentHash",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "uploader",
				"type": "address"
			}
		],
		"name": "DocumentRemoved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "documentHash",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "documentName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "fileSize",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "fileType",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "uploader",
				"type": "address"
			}
		],
		"name": "DocumentUploaded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "allDocumentHashes",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string[]",
				"name": "_documentHashes",
				"type": "string[]"
			},
			{
				"internalType": "string[]",
				"name": "_documentNames",
				"type": "string[]"
			},
			{
				"internalType": "uint256[]",
				"name": "_fileSizes",
				"type": "uint256[]"
			},
			{
				"internalType": "string[]",
				"name": "_fileTypes",
				"type": "string[]"
			}
		],
		"name": "batchUploadDocuments",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "documents",
		"outputs": [
			{
				"internalType": "string",
				"name": "documentHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "documentName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "fileSize",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "fileType",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "uploader",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_start",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_count",
				"type": "uint256"
			}
		],
		"name": "getAllDocuments",
		"outputs": [
			{
				"internalType": "bytes32[]",
				"name": "",
				"type": "bytes32[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_documentHash",
				"type": "bytes32"
			}
		],
		"name": "getDocument",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "documentHash",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "documentName",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "fileSize",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "fileType",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "uploader",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "exists",
						"type": "bool"
					}
				],
				"internalType": "struct DocumentStorage.Document",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalDocumentCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getUserDocumentCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getUserDocuments",
		"outputs": [
			{
				"internalType": "bytes32[]",
				"name": "",
				"type": "bytes32[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_documentHash",
				"type": "bytes32"
			}
		],
		"name": "isDocumentExists",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_documentHash",
				"type": "bytes32"
			}
		],
		"name": "removeDocument",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_documentHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_documentName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_fileSize",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_fileType",
				"type": "string"
			}
		],
		"name": "uploadDocument",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userDocuments",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Avalanche Mainnet
  43114: "0x0000000000000000000000000000000000000000", // Replace with your deployed contract address
  // Avalanche Fuji Testnet - DEPLOYED CONTRACT
  43113: "0xb61a6a3cf8ee3c3a835179ed467e73f939ee37d6",
  // Local development
  1337: "0x0000000000000000000000000000000000000000", // Replace with your local contract address
}

// Contract configuration
export const getContractConfig = (networkId: number) => {
  const address = CONTRACT_ADDRESSES[networkId as keyof typeof CONTRACT_ADDRESSES]
  if (!address || address === "0x0000000000000000000000000000000000000000") {
    throw new Error(`Contract not deployed on network ${networkId}`)
  }
  
  return {
    address,
    abi: DOCUMENT_STORAGE_ABI
  }
}

// Network names
export const getNetworkName = (networkId: number): string => {
  switch (networkId) {
    case 43114:
      return "Avalanche C-Chain (Mainnet)"
    case 43113:
      return "Avalanche Fuji (Testnet)"
    case 1337:
      return "Local Development"
    default:
      return `Unknown Network (${networkId})`
  }
}

// File validation
export const validateFileHash = (hash: string): boolean => {
  return hash.length > 0 && hash.length <= 66 // IPFS hashes are typically 46 chars, but allow some flexibility
}

// Format file size for blockchain storage
export const formatFileSizeForChain = (sizeInBytes: number): string => {
  return sizeInBytes.toString()
}

// Document metadata interface
export interface DocumentMetadata {
  documentHash: string
  documentName: string
  fileSize: string
  fileType: string
  timestamp: number
  uploader: string
  exists: boolean
}

// Upload status interface
export interface UploadStatus {
  documentId: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  transactionHash?: string
  error?: string
}

// Batch upload result interface
export interface BatchUploadResult {
  success: boolean
  uploadedCount: number
  failedCount: number
  results: UploadStatus[]
  totalGasUsed?: string
}
