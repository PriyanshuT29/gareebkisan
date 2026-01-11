import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { DashboardLayout } from "./components/layout/DashboardLayout"
import { Landing } from "./pages/Landing"
import { Dashboard } from "./pages/Dashboard"
import { CropAdvisory } from "./pages/CropAdvisory"
import { WeatherAlerts } from "./pages/WeatherAlerts"
import { MandiPrices } from "./pages/MandiPrices"
import { Simulator } from "./pages/Simulator"
import { Community } from "./pages/Community"
import { Marketplace } from "./pages/Marketplace"
import { Schemes } from "./pages/Schemes"
import { FarmLog } from "./pages/FarmLog"
import { Settings } from "./pages/Settings"
import { Auth } from "./pages/Auth"
import { Premium } from "./pages/Premium"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="crop-advisory" element={<CropAdvisory />} />
          <Route path="weather-alerts" element={<WeatherAlerts />} />
          <Route path="mandi-prices" element={<MandiPrices />} />
          <Route path="simulator" element={<Simulator />} />
          <Route path="community" element={<Community />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="schemes" element={<Schemes />} />
          <Route path="farm-log" element={<FarmLog />} />
          <Route path="settings" element={<Settings />} />
          <Route path="premium" element={<Premium />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
