import { useState } from 'react'

import { ChevronRight, Lock } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="mb-6 inline-flex items-center px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm">
          <Lock className="w-4 h-4 mr-2" />
          Decentralized Verification Platform
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Secure Digital
          <span className="block bg-linear-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
            Authenticity Verification
          </span>
        </h1>

        <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto">
          Blockchain-powered platform ensuring the integrity of certificates,
          legal documents, and media content through decentralized verification
          and immutable record-keeping.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center justify-center transition shadow-lg shadow-indigo-600/50">
            Get Started
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
          <button className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 text-white rounded-lg font-semibold backdrop-blur-sm border border-slate-700 transition">
            View Documentation
          </button>
        </div>

        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-linear-to-t from-slate-900 to-transparent h-32 bottom-0 z-10"></div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
            <svg viewBox="0 0 600 300" className="w-full h-auto">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop
                    offset="0%"
                    style={{ stopColor: '#6366F1', stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: '#0EA5E9', stopOpacity: 1 }}
                  />
                </linearGradient>
              </defs>
              <circle
                cx="100"
                cy="150"
                r="60"
                fill="url(#grad1)"
                opacity="0.2"
              />
              <circle
                cx="300"
                cy="150"
                r="80"
                fill="url(#grad1)"
                opacity="0.3"
              />
              <circle
                cx="500"
                cy="150"
                r="60"
                fill="url(#grad1)"
                opacity="0.2"
              />
              <line
                x1="160"
                y1="150"
                x2="220"
                y2="150"
                stroke="#6366F1"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <line
                x1="380"
                y1="150"
                x2="440"
                y2="150"
                stroke="#0EA5E9"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <circle cx="100" cy="150" r="40" fill="#6366F1" />
              <circle cx="300" cy="150" r="50" fill="#0EA5E9" />
              <circle cx="500" cy="150" r="40" fill="#6366F1" />
              <text
                x="100"
                y="155"
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                Upload
              </text>
              <text
                x="300"
                y="155"
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                Verify
              </text>
              <text
                x="500"
                y="155"
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                Secure
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
