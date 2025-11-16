import { useState } from 'react'

import {
  Shield,
  FileCheck,
  Scale,
  Newspaper,
  ChevronRight,
  Upload,
  CheckCircle,
  Users,
  Lock,
  Globe,
  Zap,
} from 'lucide-react'

export default function TimelineSection() {
  const steps = [
    {
      number: '01',
      title: 'Upload Document',
      description:
        'Upload your certificate, legal document, or media file to the platform. The system generates a unique cryptographic hash.',
    },
    {
      number: '02',
      title: 'Blockchain Storage',
      description:
        'Document hash is stored on the blockchain with timestamp and issuer information, creating an immutable record.',
    },
    {
      number: '03',
      title: 'Authority Verification',
      description:
        'Trusted issuers and authorities verify the authenticity of uploaded documents through their registered credentials.',
    },
    {
      number: '04',
      title: 'Instant Validation',
      description:
        'Anyone can verify document authenticity by uploading the file and matching its hash against blockchain records.',
    },
  ]

  return (
    <section
      id="how-it-works"
      className="py-24 bg-linear-to-b from-slate-900 to-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How Verification Works
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            A seamless four-step process ensuring document authenticity
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-indigo-600 to-sky-500"></div>

          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`relative mb-12 md:mb-20 ${
                idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } flex flex-col md:flex items-center`}
            >
              <div
                className={`w-full md:w-5/12 ${
                  idx % 2 === 0
                    ? 'md:text-right md:pr-12'
                    : 'md:text-left md:pl-12'
                }`}
              >
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                  <div className="text-5xl font-bold bg-linear-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-400">{step.description}</p>
                </div>
              </div>

              <div className="hidden md:flex absolute left-1/2 w-12 h-12 -ml-6 bg-linear-to-br from-indigo-600 to-sky-500 rounded-full items-center justify-center border-4 border-slate-900 z-10">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>

              <div className="w-full md:w-5/12"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
