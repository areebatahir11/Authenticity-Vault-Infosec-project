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

export default function FeaturesSection() {
  const features = [
    {
      icon: <FileCheck className="w-10 h-10" />,
      title: 'Authentic Certificates',
      description:
        'Issue and verify academic and professional certificates with blockchain-backed authenticity. Prevent fraud and ensure credential integrity across institutions.',
    },
    {
      icon: <Scale className="w-10 h-10" />,
      title: 'Legal Document Verification',
      description:
        'Securely validate legal documents and contracts with cryptographic proof. Enable trusted authorities to maintain immutable records of legal authenticity.',
    },
    {
      icon: <Newspaper className="w-10 h-10" />,
      title: 'Media Authenticity',
      description:
        'Combat misinformation by verifying news articles and video content. Track the origin and authenticity of media through decentralized validation networks.',
    },
  ]

  return (
    <section id="features" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Comprehensive Verification Solutions
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Protecting authenticity across multiple domains with blockchain
            technology
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-indigo-500/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-linear-to-br from-indigo-600/5 to-sky-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative">
                <div className="w-16 h-16 bg-linear-to-br from-indigo-600 to-sky-500 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
