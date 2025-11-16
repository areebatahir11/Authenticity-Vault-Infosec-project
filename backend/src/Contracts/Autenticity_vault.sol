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

    ValidIssuerAndAuthority[] public validIssuersList;
    ValidIssuerAndAuthority[] public validLegalAuthority;
    ValidIssuerAndAuthority[] public trustedMediaEntity;

    mapping(bytes32 => RoleAttributes) public records;
    mapping(bytes32 => bool) public fileHashDuplicationPrevent;
    mapping(address => bool) public trustedIssuers;
    mapping(address => bool) public trustedLegalIdentity;
    mapping(address => bool) public trustedMediaMember;
    mapping(address => mapping(address => bytes32)) public issuerToStudent;

    event FileUploaded(
        bytes32 indexed fileHash,
        address indexed uploader,
        RoleCategory role,
        uint256 timestamp
    );
    event FileVerified(
        bytes32 indexed fileHash,
        address indexed verifier,
        uint256 timestamp
    );
    event CertificateIssuerOrLegalAuthorityRegistered(
        RoleCategory role,
        address indexed issuer,
        string orgName,
        string orgUrl
    );

    modifier onlyOwner() {
        require(msg.sender == admin, "Not contract owner");
        _;
    }

    modifier uniqueHash(bytes32 _fileHash) {
        require(!fileHashDuplicationPrevent[_fileHash], "File already exists");
        _;
    }

    /// Unified upload function for Assets, MediaRecords, LegalDocuments
    function uploadFile(
        bytes32 _fileHash,
        address _uploader,
        RoleCategory _role
    ) public uniqueHash(_fileHash) {
        uint256 id;
        bool autoVerified = false;

        if (_role == RoleCategory.Assets || _role == RoleCategory.MediaRecord) {
            require(msg.sender == admin, "Only admin!");

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
                "Unauthorized legal identity"
            );
            id = legalDocumentsId.current();
            legalDocumentsId.increment();
            autoVerified = true;
        } else {
            revert("Invalid role for this function");
        }

        records[_fileHash] = RoleAttributes(
            id,
            _role,
            _fileHash,
            block.timestamp,
            autoVerified,
            _uploader,
            address(0)
        );

        fileHashDuplicationPrevent[_fileHash] = true;

        emit FileUploaded(_fileHash, _uploader, _role, block.timestamp);
    }

    // Register Trusted Certificate Issuer or Legal Authority
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

    // Certificate Issuance (By Trusted Educators)
    function issueCertificate(
        address _issuer,
        address _student,
        bytes32 _fileHash
    ) public uniqueHash(_fileHash) {
        require(
            trustedIssuers[msg.sender],
            "Only trusted issuer can issue certificates"
        );
        require(msg.sender == _issuer, "Issuer mismatch");

        uint256 id = certificateId.current();
        certificateId.increment();

        issuerToStudent[_issuer][_student] = _fileHash;
        fileHashDuplicationPrevent[_fileHash] = true;

        records[_fileHash] = RoleAttributes(
            id,
            RoleCategory.Certificate,
            _fileHash,
            block.timestamp,
            true, // Certificates are verified immediately
            _student,
            msg.sender
        );
    }

    // Certificate Validation
    function uploadCertificateForValidation(
        bytes32 _fileHash
    ) public view returns (bool) {
        return (records[_fileHash].role == RoleCategory.Certificate &&
            records[_fileHash].isVerified);
    }

    // View Legal Docs (Confidential Access)
    function viewLegalDocByAuthority(
        bytes32 _fileHash
    ) public view onlyOwner returns (RoleAttributes memory) {
        return records[_fileHash];
    }

    // Media Verification
    function verifyMedia(bytes32 _fileHash) public {
        require(!fileHashDuplicationPrevent[_fileHash], "File already exists");
        require(!records[_fileHash].isVerified, "File already verified");
        records[_fileHash].isVerified = true;

        emit FileVerified(_fileHash, msg.sender, block.timestamp);
    }
}
