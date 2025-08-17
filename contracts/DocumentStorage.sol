// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title DocumentStorage
 * @dev Smart contract for storing document metadata and hashes on Avalanche blockchain
 * @author Your Name
 */
contract DocumentStorage is Ownable, ReentrancyGuard {
    
    // Document structure
    struct Document {
        string documentHash;
        string documentName;
        uint256 fileSize;
        string fileType;
        uint256 timestamp;
        address uploader;
        bool exists;
    }
    
    // Mapping from document hash to document details
    mapping(bytes32 => Document) public documents;
    
    // Mapping from user address to their uploaded documents
    mapping(address => bytes32[]) public userDocuments;
    
    // Array of all document hashes
    bytes32[] public allDocumentHashes;
    
    // Events
    event DocumentUploaded(
        bytes32 indexed documentHash,
        string documentName,
        uint256 fileSize,
        string fileType,
        uint256 timestamp,
        address indexed uploader
    );
    
    event DocumentRemoved(
        bytes32 indexed documentHash,
        address indexed uploader
    );
    
    // Modifiers
    modifier documentExists(bytes32 _documentHash) {
        require(documents[_documentHash].exists, "Document does not exist");
        _;
    }
    
    modifier onlyDocumentOwner(bytes32 _documentHash) {
        require(documents[_documentHash].uploader == msg.sender, "Only document owner can perform this action");
        _;
    }
    
    // Constructor
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Upload a new document
     * @param _documentHash IPFS hash or file hash
     * @param _documentName Name of the document
     * @param _fileSize Size of the file in bytes
     * @param _fileType Type/MIME type of the file
     */
    function uploadDocument(
        string memory _documentHash,
        string memory _documentName,
        uint256 _fileSize,
        string memory _fileType
    ) external nonReentrant {
        require(bytes(_documentHash).length > 0, "Document hash cannot be empty");
        require(bytes(_documentName).length > 0, "Document name cannot be empty");
        require(_fileSize > 0, "File size must be greater than 0");
        require(bytes(_fileType).length > 0, "File type cannot be empty");
        
        // Create bytes32 hash from string hash for efficient storage
        bytes32 documentKey = keccak256(abi.encodePacked(_documentHash));
        
        // Check if document already exists
        require(!documents[documentKey].exists, "Document already exists");
        
        // Create new document
        Document memory newDocument = Document({
            documentHash: _documentHash,
            documentName: _documentName,
            fileSize: _fileSize,
            fileType: _fileType,
            timestamp: block.timestamp,
            uploader: msg.sender,
            exists: true
        });
        
        // Store document
        documents[documentKey] = newDocument;
        
        // Add to user's documents
        userDocuments[msg.sender].push(documentKey);
        
        // Add to all documents
        allDocumentHashes.push(documentKey);
        
        // Emit event
        emit DocumentUploaded(
            documentKey,
            _documentName,
            _fileSize,
            _fileType,
            block.timestamp,
            msg.sender
        );
    }
    
    /**
     * @dev Get document details by hash
     * @param _documentHash Document hash
     * @return Document details
     */
    function getDocument(bytes32 _documentHash) external view returns (Document memory) {
        require(documents[_documentHash].exists, "Document does not exist");
        return documents[_documentHash];
    }
    
    /**
     * @dev Get all documents uploaded by a specific user
     * @param _user User address
     * @return Array of document hashes
     */
    function getUserDocuments(address _user) external view returns (bytes32[] memory) {
        return userDocuments[_user];
    }
    
    /**
     * @dev Get all documents (paginated)
     * @param _start Starting index
     * @param _count Number of documents to return
     * @return Array of document hashes
     */
    function getAllDocuments(uint256 _start, uint256 _count) external view returns (bytes32[] memory) {
        require(_start < allDocumentHashes.length, "Start index out of bounds");
        
        uint256 end = _start + _count;
        if (end > allDocumentHashes.length) {
            end = allDocumentHashes.length;
        }
        
        bytes32[] memory result = new bytes32[](end - _start);
        for (uint256 i = _start; i < end; i++) {
            result[i - _start] = allDocumentHashes[i];
        }
        
        return result;
    }
    
    /**
     * @dev Get total number of documents
     * @return Total count
     */
    function getTotalDocumentCount() external view returns (uint256) {
        return allDocumentHashes.length;
    }
    
    /**
     * @dev Remove document (only by owner)
     * @param _documentHash Document hash to remove
     */
    function removeDocument(bytes32 _documentHash) external onlyDocumentOwner(_documentHash) {
        require(documents[_documentHash].exists, "Document does not exist");
        
        // Remove from user's documents
        bytes32[] storage userDocs = userDocuments[msg.sender];
        for (uint256 i = 0; i < userDocs.length; i++) {
            if (userDocs[i] == _documentHash) {
                userDocs[i] = userDocs[userDocs.length - 1];
                userDocs.pop();
                break;
            }
        }
        
        // Remove from all documents
        for (uint256 i = 0; i < allDocumentHashes.length; i++) {
            if (allDocumentHashes[i] == _documentHash) {
                allDocumentHashes[i] = allDocumentHashes[allDocumentHashes.length - 1];
                allDocumentHashes.pop();
                break;
            }
        }
        
        // Delete document
        delete documents[_documentHash];
        
        // Emit event
        emit DocumentRemoved(_documentHash, msg.sender);
    }
    
    /**
     * @dev Batch upload multiple documents
     * @param _documentHashes Array of document hashes
     * @param _documentNames Array of document names
     * @param _fileSizes Array of file sizes
     * @param _fileTypes Array of file types
     */
    function batchUploadDocuments(
        string[] memory _documentHashes,
        string[] memory _documentNames,
        uint256[] memory _fileSizes,
        string[] memory _fileTypes
    ) external nonReentrant {
        require(
            _documentHashes.length == _documentNames.length &&
            _documentNames.length == _fileSizes.length &&
            _fileSizes.length == _fileTypes.length,
            "Array lengths must match"
        );
        
        for (uint256 i = 0; i < _documentHashes.length; i++) {
            // Call internal upload function for each document
            _uploadDocumentInternal(
                _documentHashes[i],
                _documentNames[i],
                _fileSizes[i],
                _fileTypes[i]
            );
        }
    }
    
    /**
     * @dev Internal function to upload a document (used by batch upload)
     * @param _documentHash IPFS hash or file hash
     * @param _documentName Name of the document
     * @param _fileSize Size of the file in bytes
     * @param _fileType Type/MIME type of the file
     */
    function _uploadDocumentInternal(
        string memory _documentHash,
        string memory _documentName,
        uint256 _fileSize,
        string memory _fileType
    ) internal {
        require(bytes(_documentHash).length > 0, "Document hash cannot be empty");
        require(bytes(_documentName).length > 0, "Document name cannot be empty");
        require(_fileSize > 0, "File size must be greater than 0");
        require(bytes(_fileType).length > 0, "File type cannot be empty");
        
        // Create bytes32 hash from string hash for efficient storage
        bytes32 documentKey = keccak256(abi.encodePacked(_documentHash));
        
        // Check if document already exists
        require(!documents[documentKey].exists, "Document already exists");
        
        // Create new document
        Document memory newDocument = Document({
            documentHash: _documentHash,
            documentName: _documentName,
            fileSize: _fileSize,
            fileType: _fileType,
            timestamp: block.timestamp,
            uploader: msg.sender,
            exists: true
        });
        
        // Store document
        documents[documentKey] = newDocument;
        
        // Add to user's documents
        userDocuments[msg.sender].push(documentKey);
        
        // Add to all documents
        allDocumentHashes.push(documentKey);
        
        // Emit event
        emit DocumentUploaded(
            documentKey,
            _documentName,
            _fileSize,
            _fileType,
            block.timestamp,
            msg.sender
        );
    }
    
    /**
     * @dev Check if document exists
     * @param _documentHash Document hash to check
     * @return True if document exists
     */
    function isDocumentExists(bytes32 _documentHash) external view returns (bool) {
        return documents[_documentHash].exists;
    }
    
    /**
     * @dev Get document count for a specific user
     * @param _user User address
     * @return Number of documents uploaded by user
     */
    function getUserDocumentCount(address _user) external view returns (uint256) {
        return userDocuments[_user].length;
    }
}
