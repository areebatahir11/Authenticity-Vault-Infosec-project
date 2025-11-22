import Navbar from '../components/Navbar'
import HeroSection from './LandingPage/heroSection'
import FeaturesSection from './LandingPage/FeatureSection'
import TimelineSection from './LandingPage/TimelineSection'
import RoleCardsSection from './LandingPage/RoleCardSection'
import UploadSection from './LandingPage/UploadSection'
import Footer from './LandingPage/footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TimelineSection />
      <RoleCardsSection />
      <UploadSection />
      <Footer />
    </div>
  )
}
