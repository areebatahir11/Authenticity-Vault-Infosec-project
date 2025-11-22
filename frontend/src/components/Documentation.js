export default function Documentation() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300 pt-28 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
          Authenticity Vault Documentation
        </h1>

        <p className="text-lg text-slate-400 text-center mb-12">
          Learn how to use the Authenticity Vault to upload, verify, and issue
          trusted digital documents.
        </p>

        {/* Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-indigo-400 mb-4">
            Introduction
          </h2>
          <p className="leading-relaxed">
            Authenticity Vault is a decentralized verification platform built on
            Ethereum. It allows users, organizations, and legal authorities to
            upload digital assets, issue blockchain-verified certificates, and
            validate legal documents with complete transparency and trust.
          </p>
        </section>

        {/* How it Works */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-indigo-400 mb-4">
            How It Works
          </h2>
          <ul className="space-y-3 list-disc pl-6">
            <li>Upload any document (certificate, legal file, image, PDF).</li>
            <li>
              The system computes a unique{' '}
              <strong>SHA-256 document hash</strong>.
            </li>
            <li>
              The hash is stored permanently on the blockchain inside the Vault
              Contract.
            </li>
            <li>
              Anyone can validate a document by uploading it again — if the hash
              matches, the document is authentic.
            </li>
            <li>
              Registered issuers can issue certificates that include:
              <ul className="list-disc pl-6 mt-2 text-slate-400">
                <li>Recipient Name</li>
                <li>Issuer Address</li>
                <li>Document Hash</li>
                <li>Timestamp</li>
              </ul>
            </li>
          </ul>
        </section>

        {/* Roles */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-indigo-400 mb-4">
            User Roles
          </h2>

          <div className="space-y-6">
            <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-xl">
              <h3 className="text-white font-semibold text-xl mb-2">
                General User
              </h3>
              <p className="text-slate-400">
                Can upload documents, verify authenticity, and view legal files.
              </p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-xl">
              <h3 className="text-white font-semibold text-xl mb-2">
                Registered Issuer
              </h3>
              <p className="text-slate-400">
                Trusted entities who can issue verified certificates using the
                Vault.
              </p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-xl">
              <h3 className="text-white font-semibold text-xl mb-2">
                Authority Panel
              </h3>
              <p className="text-slate-400">
                Special administrative users who validate legal documents,
                resolve disputes, and manage compliance.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-indigo-400 mb-4">
            Key Features
          </h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>Blockchain-backed document verification</li>
            <li>Immutable registration of certificate issuers</li>
            <li>Secure document upload with hashing</li>
            <li>Instant certificate authenticity check</li>
            <li>Legal document validation and authority management</li>
            <li>Decentralized and censorship-resistant system</li>
          </ul>
        </section>

        {/* Smart Contract */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-indigo-400 mb-4">
            Smart Contract Overview
          </h2>
          <p className="leading-relaxed mb-4">
            The Authenticity Vault contract includes functions for:
          </p>
          <ul className="space-y-2 list-disc pl-6">
            <li>
              <strong>registerIssuer()</strong> — Add an authorized certificate
              issuer
            </li>
            <li>
              <strong>uploadDocument()</strong> — Store hash + metadata
            </li>
            <li>
              <strong>issueCertificate()</strong> — Issue an official blockchain
              certificate
            </li>
            <li>
              <strong>validateDocument()</strong> — Verify authenticity
            </li>
            <li>
              <strong>viewLegalDocument()</strong> — Access legal files
            </li>
          </ul>
        </section>

        {/* Getting Started */}
        <section>
          <h2 className="text-2xl font-semibold text-indigo-400 mb-4">
            Getting Started
          </h2>

          <ol className="list-decimal pl-6 space-y-3">
            <li>Connect your wallet.</li>
            <li>Navigate to Dashboard.</li>
            <li>Upload or verify a document.</li>
            <li>Register as an issuer if needed.</li>
            <li>Issue certificates or validate existing ones.</li>
          </ol>
        </section>
      </div>
    </div>
  )
}
