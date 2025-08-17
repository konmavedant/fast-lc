"use client"

import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, Upload, Wallet, FileText, ExternalLink, CheckCircle, XCircle, Network, ArrowLeft, FileText as FileTextIcon, Copy, Check } from 'lucide-react'
import { 
  getContractConfig, 
  validateFileHash, 
  formatFileSizeForChain, 
  getNetworkName,
  type DocumentMetadata 
} from './contract-interface'
import { useRouter, useSearchParams } from 'next/navigation'

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      isAvalanche?: boolean
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeListener: (event: string, callback: (...args: any[]) => void) => void
    }
  }
}

interface Document {
  id: string
  name: string
  size: number
  type: string
  file: File
  hash?: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  transactionHash?: string
}

interface TransactionDetails {
  hash: string
  status: 'pending' | 'confirmed' | 'failed'
  timestamp: number
  blockNumber?: number
  gasUsed?: string
  documentsCount?: number
  documents?: Array<{
    name: string
    hash?: string
    size: number
    type: string
  }>
}

const OnChainData: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const lcNumber = searchParams.get('lc')
  const lcStatus = searchParams.get('status')
  
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [transactions, setTransactions] = useState<TransactionDetails[]>([])
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [networkId, setNetworkId] = useState<number | null>(null)
  const [networkName, setNetworkName] = useState<string>('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successTransactionHash, setSuccessTransactionHash] = useState<string>('')
  const [successDocumentsCount, setSuccessDocumentsCount] = useState<number>(0)
  const [copiedHash, setCopiedHash] = useState(false)

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {})
        window.ethereum.removeListener('chainChanged', () => {})
      }
    }
  }, [])

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask
  }

  // Check if Core Wallet is installed
  const isCoreWalletInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isAvalanche
  }

  // Connect wallet function
  const connectWallet = async () => {
    if (!isMetaMaskInstalled() && !isCoreWalletInstalled()) {
      setError('Please install MetaMask or Core Wallet to connect')
      return
    }

    setIsConnecting(true)
    setError('')

    try {
      // Request account access
      if (!window.ethereum) {
        throw new Error('No ethereum provider found')
      }
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const address = accounts[0]
      setWalletAddress(address)
      setSuccess(`Wallet connected: ${address.slice(0, 6)}...${address.slice(-4)}`)
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setWalletAddress('')
          setSuccess('Wallet disconnected')
        } else {
          setWalletAddress(accounts[0])
        }
      })

      // Get and set network information
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      const networkId = parseInt(chainId, 16)
      setNetworkId(networkId)
      setNetworkName(getNetworkName(networkId))

      // Listen for network changes
      window.ethereum.on('chainChanged', (chainId: string) => {
        const newNetworkId = parseInt(chainId, 16)
        setNetworkId(newNetworkId)
        setNetworkName(getNetworkName(newNetworkId))
      })

    } catch (err) {
      setError('Failed to connect wallet')
      console.error('Wallet connection error:', err)
    } finally {
      setIsConnecting(false)
    }
  }

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newDocuments: Document[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      status: 'pending'
    }))

    setDocuments(prev => [...prev, ...newDocuments])
    setError('')
  }

  // Remove document
  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }

  // Generate file hash (simplified - in production you'd use IPFS or similar)
  const generateFileHash = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer
        const hash = ethers.keccak256(new Uint8Array(arrayBuffer))
        resolve(hash)
      }
      reader.readAsArrayBuffer(file)
    })
  }

  // Upload documents on-chain with real-time updates
  const uploadDocumentsOnChain = async () => {
    if (!walletAddress) {
      setError('Please connect your wallet first')
      return
    }

    if (documents.length === 0) {
      setError('Please select documents to upload')
      return
    }

    setIsUploading(true)
    setError('')

    try {
      // Create provider and signer
      if (!window.ethereum) {
        throw new Error('No ethereum provider found')
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      // Get contract configuration for current network
      if (!networkId) {
        throw new Error('Network not detected')
      }
      
      const contractConfig = getContractConfig(networkId)
      const contract = new ethers.Contract(contractConfig.address, contractConfig.abi, signer)
      
      // Prepare batch upload data
      const documentHashes: string[] = []
      const documentNames: string[] = []
      const fileSizes: string[] = []
      const fileTypes: string[] = []

      // Process each document and generate hashes
      for (const doc of documents) {
        // Update document status to uploading
        setDocuments(prev => prev.map(d => 
          d.id === doc.id ? { ...d, status: 'uploading' } : d
        ))

        // Generate file hash
        const fileHash = await generateFileHash(doc.file)
        
        // Validate file hash
        if (!validateFileHash(fileHash)) {
          throw new Error(`Invalid file hash generated for ${doc.name}`)
        }

        // Store document hash for batch upload
        documentHashes.push(fileHash)
        documentNames.push(doc.name)
        fileSizes.push(formatFileSizeForChain(doc.size))
        fileTypes.push(doc.type)

        // Update document with hash
        setDocuments(prev => prev.map(d => 
          d.id === doc.id ? { ...d, hash: fileHash } : d
        ))
      }

      // Perform batch upload to smart contract
      console.log('Uploading documents to smart contract:', {
        documentHashes,
        documentNames,
        fileSizes,
        fileTypes
      })

      // Call smart contract batch upload function
      const tx = await contract.batchUploadDocuments(
        documentHashes,
        documentNames,
        fileSizes,
        fileTypes
      )
      
      // Wait for transaction confirmation
      const receipt = await tx.wait()
      
      // Update all documents with success status and transaction hash
      setDocuments(prev => prev.map(doc => ({
        ...doc,
        status: 'success',
        transactionHash: receipt.hash
      })))

      // Add transaction to list with enhanced details
      const transactionDetails = {
        hash: receipt.hash,
        status: 'confirmed' as const,
        timestamp: Date.now(),
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed?.toString() || '0',
        documentsCount: documents.length,
        documents: documents.map(doc => ({
          name: doc.name,
          hash: doc.hash,
          size: doc.size,
          type: doc.type
        }))
      }
      
      setTransactions(prev => [...prev, transactionDetails])

      // Enhanced success message with transaction details
      setSuccess(`${documents.length} document(s) uploaded successfully on-chain! Transaction Hash: ${receipt.hash}`)
      
      // Show detailed success notification
      const successMessage = `✅ ${documents.length} document(s) uploaded successfully!
      
Transaction Hash: ${receipt.hash}
Block Number: ${receipt.blockNumber}
Gas Used: ${receipt.gasUsed?.toString() || '0'}

Documents uploaded:
${documents.map(doc => `• ${doc.name} (${doc.type})`).join('\n')}

View on Explorer: ${getExplorerLink(receipt.hash)}`
      
      console.log(successMessage)
      
      // Log transaction details for debugging
      console.log('Transaction completed successfully:', {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed?.toString(),
        documentsUploaded: documents.length,
        timestamp: new Date().toISOString()
      })
      
      // Show success popup modal
      setSuccessTransactionHash(receipt.hash)
      setSuccessDocumentsCount(documents.length)
      setShowSuccessModal(true)
      
      // Navigate back to admin dashboard with success message after 8 seconds (giving time for popup)
      setTimeout(() => {
        if (lcNumber) {
          router.push(`/admin-dashboard?success=true&lc=${lcNumber}`)
        } else {
          router.push('/admin-dashboard?success=true')
        }
      }, 8000)
      
    } catch (err) {
      setError('Failed to upload documents on-chain')
      console.error('Upload error:', err)
      
      // Update failed documents
      setDocuments(prev => prev.map(doc => ({
        ...doc,
        status: 'error'
      })))
    } finally {
      setIsUploading(false)
    }
  }

  // Get Avalanche Explorer link
  const getExplorerLink = (hash: string) => {
    return `https://snowtrace.io/tx/${hash}`
  }

  // Copy transaction hash to clipboard
  const copyTransactionHash = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash)
      setCopiedHash(true)
      setTimeout(() => setCopiedHash(false), 2000)
    } catch (err) {
      console.error('Failed to copy transaction hash:', err)
      setError('Failed to copy transaction hash')
    }
  }

  // Copy transaction hash from popup
  const copyTransactionHashFromPopup = async () => {
    try {
      await navigator.clipboard.writeText(successTransactionHash)
      setCopiedHash(true)
      setTimeout(() => setCopiedHash(false), 2000)
    } catch (err) {
      console.error('Failed to copy transaction hash:', err)
      setError('Failed to copy transaction hash')
    }
  }

  // Close success modal and proceed
  const closeSuccessModal = () => {
    setShowSuccessModal(false)
    // Navigate back to admin dashboard
    if (lcNumber) {
      router.push(`/admin-dashboard?success=true&lc=${lcNumber}`)
    } else {
      router.push('/admin-dashboard?success=true')
    }
  }

  // Switch to Avalanche network
  const switchToAvalanche = async () => {
    if (!window.ethereum) return
    
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0xa86a', // 43114 in hex
            chainName: 'Avalanche C-Chain',
            nativeCurrency: {
              name: 'AVAX',
              symbol: 'AVAX',
              decimals: 18
            },
            rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
            blockExplorerUrls: ['https://snowtrace.io/']
          }
        ]
      })
    } catch (err) {
      console.error('Failed to switch network:', err)
    }
  }

  // Switch to Fuji testnet
  const switchToFuji = async () => {
    if (!window.ethereum) return
    
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0xa869', // 43113 in hex
            chainName: 'Avalanche Fuji Testnet',
            nativeCurrency: {
              name: 'AVAX',
              symbol: 'AVAX',
              decimals: 18
            },
            rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
            blockExplorerUrls: ['https://testnet.snowtrace.io/']
          }
        ]
      })
    } catch (err) {
      console.error('Failed to switch network:', err)
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Get status icon and color
  const getStatusDisplay = (status: Document['status']) => {
    switch (status) {
      case 'pending':
        return { icon: <FileText className="h-4 w-4" />, color: 'bg-gray-100 text-gray-800' }
      case 'uploading':
        return { icon: <Loader2 className="h-4 w-4 animate-spin" />, color: 'bg-blue-100 text-blue-800' }
      case 'success':
        return { icon: <CheckCircle className="h-4 w-4" />, color: 'bg-green-100 text-green-800' }
      case 'error':
        return { icon: <XCircle className="h-4 w-4" />, color: 'bg-red-100 text-red-800' }
      default:
        return { icon: <FileText className="h-4 w-4" />, color: 'bg-gray-100 text-gray-800' }
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/admin-dashboard')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">On-Chain Data Management</h1>
        <p className="text-muted-foreground">
          Upload and manage documents on the Avalanche blockchain
        </p>
      </div>
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
        <button 
          onClick={() => router.push('/admin-dashboard')}
          className="hover:text-foreground transition-colors"
        >
          Admin Dashboard
        </button>
        <span>/</span>
        <span>On-Chain Data</span>
        {lcNumber && (
          <>
            <span>/</span>
            <span className="font-medium">{lcNumber}</span>
          </>
        )}
      </div>

      {/* LC Information Card */}
      {lcNumber && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5" />
              Letter of Credit Information
            </CardTitle>
            <CardDescription>
              Processing blockchain upload for this LC
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">LC Number</Label>
                <p className="text-lg font-semibold">{lcNumber}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Current Status</Label>
                <Badge className="mt-1">
                  {lcStatus}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wallet Connection Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Connection
          </CardTitle>
          <CardDescription>
            Connect your MetaMask or Core Wallet to interact with the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!walletAddress ? (
            <Button 
              onClick={connectWallet} 
              disabled={isConnecting}
              className="w-full sm:w-auto"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setWalletAddress('')}
                >
                  Disconnect
                </Button>
              </div>
              {networkName && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Network className="h-4 w-4" />
                    Network: {networkName}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={switchToAvalanche}
                      className="text-xs"
                    >
                      Switch to Mainnet
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={switchToFuji}
                      className="text-xs"
                    >
                      Switch to Testnet
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Documents
          </CardTitle>
          <CardDescription>
            Select documents to upload on-chain. Supported formats: PDF, JPG, DOCX
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="documents">Select Files</Label>
            <Input
              id="documents"
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.docx"
              onChange={handleFileSelect}
              className="cursor-pointer"
            />
          </div>

          {/* Document List */}
          {documents.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Documents ({documents.length})</Label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {documents.map((doc) => {
                  const statusDisplay = getStatusDisplay(doc.status)
                  return (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {statusDisplay.icon}
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(doc.size)} • {doc.type}
                          </p>
                          {doc.hash && (
                            <p className="text-xs text-muted-foreground">
                              Hash: {doc.hash.slice(0, 10)}...{doc.hash.slice(-8)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={statusDisplay.color}>
                          {doc.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(doc.id)}
                          className="h-8 w-8 p-0"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={uploadDocumentsOnChain}
            disabled={!walletAddress || documents.length === 0 || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading On-Chain...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Documents On-Chain
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Transaction Details */}
      {transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Transaction Details
            </CardTitle>
            <CardDescription>
              View the status and details of your on-chain transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((tx, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  {/* Transaction Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'}>
                        {tx.status}
                      </Badge>
                      <div className="text-sm">
                        <span className="font-medium">Transaction #{index + 1}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(getExplorerLink(tx.hash), '_blank')}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View on Explorer
                    </Button>
                  </div>

                  {/* Transaction Hash - Prominently Displayed */}
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-xs font-medium text-gray-600 mb-1">Transaction Hash</div>
                    <div className="font-mono text-sm break-all bg-white p-2 rounded border">
                      {tx.hash}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyTransactionHash(tx.hash)}
                        className="text-xs h-7"
                      >
                        Copy Hash
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(getExplorerLink(tx.hash), '_blank')}
                        className="text-xs h-7"
                      >
                        Open Explorer
                      </Button>
                    </div>
                  </div>

                  {/* Transaction Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium text-gray-600">Timestamp:</span>
                      <div className="text-gray-800">{new Date(tx.timestamp).toLocaleString()}</div>
                    </div>
                    {tx.blockNumber && (
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="font-medium text-gray-600">Block Number:</span>
                        <div className="text-gray-800">{tx.blockNumber.toLocaleString()}</div>
                      </div>
                    )}
                    {tx.gasUsed && (
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="font-medium text-gray-600">Gas Used:</span>
                        <div className="text-gray-800">{tx.gasUsed}</div>
                      </div>
                    )}
                  </div>

                  {/* Documents Uploaded in This Transaction */}
                  {tx.documentsCount && (
                    <div className="bg-blue-50 p-3 rounded-md">
                      <div className="text-sm font-medium text-blue-800 mb-2">
                        Documents Uploaded: {tx.documentsCount}
                      </div>
                      <div className="space-y-1">
                        {tx.documents?.map((doc, docIndex) => (
                          <div key={docIndex} className="text-xs text-blue-700 flex items-center gap-2">
                            <span>• {doc.name}</span>
                            <span className="text-blue-500">({doc.type})</span>
                            <span className="text-blue-400">({formatFileSize(doc.size)})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

             {success && (
         <Alert>
           <CheckCircle className="h-4 w-4" />
           <AlertDescription>{success}</AlertDescription>
         </Alert>
       )}

       {/* Success Transaction Popup Modal */}
       <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
         <DialogContent className="sm:max-w-md">
           <DialogHeader>
             <DialogTitle className="flex items-center gap-2 text-green-600">
               <CheckCircle className="h-6 w-6" />
               On-Chain Transaction Completed!
             </DialogTitle>
             <DialogDescription className="text-base">
               Your documents have been successfully uploaded to the blockchain. 
               You can now proceed with the shipment process.
             </DialogDescription>
           </DialogHeader>
           
           <div className="space-y-4">
             {/* Transaction Summary */}
             <div className="bg-green-50 p-4 rounded-lg border border-green-200">
               <div className="flex items-center justify-between mb-2">
                 <span className="text-sm font-medium text-green-800">
                   Documents Uploaded: {successDocumentsCount}
                 </span>
                 <Badge variant="secondary" className="bg-green-100 text-green-800">
                   Success
                 </Badge>
               </div>
               <p className="text-xs text-green-600">
                 All documents are now stored on the Avalanche blockchain and can be verified.
               </p>
             </div>

             {/* Transaction Hash Section */}
             <div className="space-y-3">
               <Label className="text-sm font-medium text-gray-700">
                 Transaction Hash
               </Label>
               <div className="bg-gray-50 p-3 rounded-md border">
                 <div className="font-mono text-sm break-all bg-white p-2 rounded border text-gray-800">
                   {successTransactionHash}
                 </div>
                 <div className="flex gap-2 mt-3">
                   <Button
                     onClick={copyTransactionHashFromPopup}
                     variant="outline"
                     size="sm"
                     className="flex items-center gap-2 text-xs"
                   >
                     {copiedHash ? (
                       <>
                         <Check className="h-3 w-3 text-green-600" />
                         Copied!
                       </>
                     ) : (
                       <>
                         <Copy className="h-3 w-3" />
                         Copy Hash
                       </>
                     )}
                   </Button>
                   <Button
                     onClick={() => window.open(getExplorerLink(successTransactionHash), '_blank')}
                     variant="outline"
                     size="sm"
                     className="flex items-center gap-2 text-xs"
                   >
                     <ExternalLink className="h-3 w-3" />
                     View on Explorer
                   </Button>
                 </div>
               </div>
             </div>

             {/* Action Buttons */}
             <div className="flex gap-3 pt-2">
               <Button
                 onClick={closeSuccessModal}
                 className="flex-1"
               >
                 Continue to Dashboard
               </Button>
               <Button
                 onClick={() => window.open(getExplorerLink(successTransactionHash), '_blank')}
                 variant="outline"
                 className="flex-1"
               >
                 Verify Transaction
               </Button>
             </div>

             {/* Instructions */}
             <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
               <div className="flex items-start gap-2">
                 <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                 <div className="text-xs text-blue-800">
                   <strong>Next Steps:</strong> You can now proceed with your shipment process. 
                   The transaction hash above serves as proof of document upload and can be shared 
                   with relevant parties for verification.
                 </div>
               </div>
             </div>
           </div>
         </DialogContent>
       </Dialog>
     </div>
   )
 }

export default OnChainData
