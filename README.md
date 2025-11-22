# **Authenticity Vault**

**Authenticity Vault** is a **decentralized platform** for verifying and storing digital assets, certificates, media records, and legal documents securely on the blockchain. It ensures **authenticity, transparency, and trust** using Ethereum smart contracts and a modern Next.js frontend.

---

## **🚀 Features**

* **📂 Secure Asset Uploads**

  * Upload any digital asset (images, videos, files) with a **unique hash**
  * Prevent duplicate uploads automatically

* **🎓 Certificate Issuance & Verification**

  * Trusted issuers can issue educational certificates
  * Certificates are verified **on-chain**, and **anyone can validate them**

* **📰 Media Verification**

  * Media organizations can upload content
  * Verification ensures **authenticity of news and media files**

* **📜 Legal Documents**

  * Legal authorities can upload and store **verified documents**
  * Only authorized entities can manage these documents

* **🔑 Role-Based Access Control**

  * Admin, trusted issuers, legal authorities, and media members have **specific permissions**

---

## **🛠 Tech Stack**

![Solidity](https://img.shields.io/badge/Solidity-363636?style=flat\&logo=solidity\&logoColor=white)
![Ethereum](https://img.shields.io/badge/Ethereum-627eea?style=flat\&logo=ethereum\&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat\&logo=next.js\&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat\&logo=tailwind-css\&logoColor=white)
![Ethers.js](https://img.shields.io/badge/Ethers.js-627eea?style=flat\&logo=ethereum\&logoColor=white)

---

## **💻 Live Demo / Preview**

**For trying the app locally:**

* **📁 Upload Files**

  * Who can upload: Admin, legal authorities, or media entities
  * How it works: Each file is hashed using **keccak256** to prevent duplication, ensuring integrity and uniqueness

* **🔑 Register Trusted Entities**

  * Admin-only action: Register trusted certificate issuers or legal authorities
  * Permissions: Only registered entities can issue certificates or upload legal documents, maintaining a secure ecosystem

* **🎓 Issue Certificates**

  * Trusted issuers assign certificates to students
  * Certificates are automatically verified **on-chain**

* **✅ Validate & Verify**

  * Certificate validation: Anyone can verify certificates
  * Media verification: News or media files can be verified for authenticity
  * Legal documents: Viewable only by authorized personnel

---

## **📜 Smart Contract Highlights**

| **Function**                             | **Description**                                                         |
| ---------------------------------------- | ----------------------------------------------------------------------- |
| `uploadFile`                             | Upload assets, media records, or legal documents with role-based access |
| `registerAsTrustedIssuerOrLegalIdentity` | Admin-only registration of trusted issuers and legal authorities        |
| `issueCertificate`                       | Trusted issuers issue certificates to students                          |
| `uploadCertificateForValidation`         | Check if a certificate is valid                                         |
| `viewLegalDocByAuthority`                | Admin-only access to legal documents                                    |
| `verifyMedia`                            | Verify authenticity of media files                                      |

---

## **🎨 UI / Frontend**

* Built with **Next.js + React + Tailwind CSS**
* Modern, responsive landing page with **Glassmorphism effects**
* **Sections include:**

  * Hero / Overview
  * Features
  * Timeline / How It Works
  * Role Cards
  * Upload Section
  * Footer

---

## **🌟 Why Authenticity Vault?**

* Ensures **full transparency and immutability** of digital records
* Enables **secure educational and legal workflows**
* Prevents **fake certificates and news tampering**
* Serves as a **trusted platform** for digital verification

---

## **🔗 Author**

**Areeba Tahir**
Blockchain Developer | Full-Stack dApp Enthusiast

---


