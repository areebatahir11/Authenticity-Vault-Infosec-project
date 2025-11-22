// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Counters} from "lib/openzeppelin-contracts/contracts/utils/Counters.sol";

contract AuthenticityVault {
    using Counters for Counters.Counter;

    Counters.Counter public assetId;
    Counters.Counter public certificateId;
    Counters.Counter public mediaRecordId;
    Counters.Counter public legalDocumentsId;

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    enum RoleCategory {
        Assets,
        Certificate,
        MediaRecord,
        LegalDocuments
    }

    struct RoleAttributes {
        uint256 id;
        RoleCategory role;
        bytes32 fileHash;
        uint256 timestamp;
        bool isVerified;
        address uploader;
        address issuer;
    }

    struct ValidIssuerAndAuthority {
        RoleCategory role;
        address issuer;
        string orgName;
        string orgUrl;
    }

    // --- storage ---
    mapping(bytes32 => RoleAttributes[]) public recordsByHash;
    bytes32[] public allRecords;

    mapping(bytes32 => bool) public fileExistsForUpload;

    mapping(address => bool) public trustedIssuers;
    mapping(address => bool) public trustedLegalIdentity;
    mapping(address => bool) public trustedMediaMember;

    ValidIssuerAndAuthority[] public validIssuersList;
    ValidIssuerAndAuthority[] public validLegalAuthority;
    ValidIssuerAndAuthority[] public trustedMediaEntity;

    mapping(address => mapping(address => bytes32[]))
        public issuerToStudentHashes;

    // --- events ---
    event FileUploaded(
        bytes32 fileHash,
        address uploader,
        RoleCategory role,
        uint256 timestamp
    );
    event FileVerified(bytes32 fileHash, address verifier, uint256 timestamp);
    event CertificateIssuerOrLegalAuthorityRegistered(
        RoleCategory role,
        address issuer,
        string orgName,
        string orgUrl
    );
    event CertificateIssued(
        bytes32 fileHash,
        address issuer,
        address student,
        uint256 timestamp
    );

    // NEW EVENT (you requested this 🔥)
    event CertificateValidated(
        bytes32 fileHash,
        bool isValid,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == admin, "Not contract owner");
        _;
    }

    modifier uniqueUploadHash(bytes32 _fileHash) {
        require(
            !fileExistsForUpload[_fileHash],
            "File already exists (uploads)"
        );
        _;
    }

    function uploadFile(
        bytes32 _fileHash,
        address _uploader,
        RoleCategory _role
    ) public uniqueUploadHash(_fileHash) {
        uint256 id;
        bool autoVerified = false;

        if (_role == RoleCategory.Assets || _role == RoleCategory.MediaRecord) {
            require(msg.sender == admin, "Only admin can upload assets/media");

            if (_role == RoleCategory.Assets) {
                id = assetId.current();
                assetId.increment();
            } else {
                id = mediaRecordId.current();
                mediaRecordId.increment();
            }
        } else if (_role == RoleCategory.LegalDocuments) {
            require(
                trustedLegalIdentity[_uploader],
                "Unauthorized legal uploader"
            );

            id = legalDocumentsId.current();
            legalDocumentsId.increment();
            autoVerified = true;
        } else {
            revert("Invalid role for upload");
        }

        RoleAttributes memory attr = RoleAttributes({
            id: id,
            role: _role,
            fileHash: _fileHash,
            timestamp: block.timestamp,
            isVerified: autoVerified,
            uploader: _uploader,
            issuer: address(0)
        });

        recordsByHash[_fileHash].push(attr);
        allRecords.push(_fileHash);
        fileExistsForUpload[_fileHash] = true;

        emit FileUploaded(_fileHash, _uploader, _role, block.timestamp);
    }

    function registerAsTrustedIssuerOrLegalIdentity(
        RoleCategory _role,
        address _issuer,
        string memory orgName,
        string memory orgUrl
    ) public onlyOwner {
        ValidIssuerAndAuthority memory entry = ValidIssuerAndAuthority(
            _role,
            _issuer,
            orgName,
            orgUrl
        );

        if (_role == RoleCategory.Certificate) {
            validIssuersList.push(entry);
            trustedIssuers[_issuer] = true;
        } else if (_role == RoleCategory.LegalDocuments) {
            validLegalAuthority.push(entry);
            trustedLegalIdentity[_issuer] = true;
        } else {
            trustedMediaEntity.push(entry);
            trustedMediaMember[_issuer] = true;
        }

        emit CertificateIssuerOrLegalAuthorityRegistered(
            _role,
            _issuer,
            orgName,
            orgUrl
        );
    }

    function _hasIssuedBefore(
        address _issuer,
        address _student,
        bytes32 _fileHash
    ) internal view returns (bool) {
        bytes32[] storage list = issuerToStudentHashes[_issuer][_student];
        for (uint256 i = 0; i < list.length; i++) {
            if (list[i] == _fileHash) return true;
        }
        return false;
    }

    function issueCertificate(
        address _issuer,
        address _student,
        bytes32 _fileHash
    ) public {
        require(trustedIssuers[msg.sender], "Only trusted issuer");
        require(msg.sender == _issuer, "Issuer mismatch");
        require(
            !_hasIssuedBefore(_issuer, _student, _fileHash),
            "Certificate already issued!"
        );

        uint256 id = certificateId.current();
        certificateId.increment();

        RoleAttributes memory attr = RoleAttributes({
            id: id,
            role: RoleCategory.Certificate,
            fileHash: _fileHash,
            timestamp: block.timestamp,
            isVerified: true,
            uploader: _student,
            issuer: _issuer
        });

        recordsByHash[_fileHash].push(attr);
        allRecords.push(_fileHash);
        issuerToStudentHashes[_issuer][_student].push(_fileHash);

        emit CertificateIssued(_fileHash, _issuer, _student, block.timestamp);
    }

    function validateCertificate(bytes32 _fileHash) public returns (bool) {
        RoleAttributes[] storage list = recordsByHash[_fileHash];

        if (list.length == 0) {
            emit CertificateValidated(_fileHash, false, block.timestamp);
            return false;
        }

        for (uint256 i = 0; i < list.length; i++) {
            if (
                list[i].role == RoleCategory.Certificate && list[i].isVerified
            ) {
                emit CertificateValidated(_fileHash, true, block.timestamp);
                return true;
            }
        }

        emit CertificateValidated(_fileHash, false, block.timestamp);
        return false;
    }

    function viewMyLegalDocuments() public view returns (bytes32[] memory) {
        require(
            trustedLegalIdentity[msg.sender],
            "Only registered legal authorities can view legal documents"
        );

        uint256 total = allRecords.length;
        bytes32[] memory tempDocs = new bytes32[](total);
        uint256 idx = 0;

        for (uint256 i = 0; i < total; i++) {
            bytes32 h = allRecords[i];
            RoleAttributes[] storage list = recordsByHash[h];

            for (uint256 j = 0; j < list.length; j++) {
                if (
                    list[j].role == RoleCategory.LegalDocuments &&
                    list[j].uploader == msg.sender
                ) {
                    tempDocs[idx] = h;
                    idx++;
                    break; // only count each fileHash once
                }
            }
        }

        // Resize array to exact count
        bytes32[] memory myDocs = new bytes32[](idx);
        for (uint256 k = 0; k < idx; k++) {
            myDocs[k] = tempDocs[k];
        }

        return myDocs;
    }

    function getAllFileHashes() public view returns (bytes32[] memory) {
        return allRecords;
    }

    function getHashDetails(
        bytes32 _fileHash
    ) public view returns (RoleAttributes[] memory) {
        require(recordsByHash[_fileHash].length > 0, "Hash not found");
        return recordsByHash[_fileHash];
    }

    function getLatestHashDetails(
        bytes32 _fileHash
    ) public view returns (RoleAttributes memory) {
        uint256 len = recordsByHash[_fileHash].length;
        require(len > 0, "Hash not found");
        return recordsByHash[_fileHash][len - 1];
    }

    function getRegisteredIssuers()
        public
        view
        returns (ValidIssuerAndAuthority[] memory)
    {
        return validIssuersList;
    }

    function getRegisteredLegalAuthorities()
        public
        view
        returns (ValidIssuerAndAuthority[] memory)
    {
        return validLegalAuthority;
    }

    function getRegisteredMediaEntities()
        public
        view
        returns (ValidIssuerAndAuthority[] memory)
    {
        return trustedMediaEntity;
    }

    function totalRecords() public view returns (uint256) {
        return allRecords.length;
    }
}
