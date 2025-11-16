import Navbar from '../components/Navbar'
import Dashboard from '../components/DashboardCard'
import LandingPage from '../components/LandingPage'

export default function Home() {
  return (
    <>
      <div>
        <LandingPage />
      </div>
      <div>
        <Navbar />
      </div>
      <div>
        <Dashboard />
      </div>
    </>
  )
}
