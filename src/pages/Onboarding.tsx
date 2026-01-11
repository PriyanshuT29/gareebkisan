import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { 
  MapPin, 
  Sprout, 
  Droplets, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft, 
  Check,
  Loader2,
  Calendar
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { useTranslation } from "react-i18next"
import { supabase } from "../lib/supabase"

// Indian States and Districts (sample data - can be expanded)
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
]

const COMMON_CROPS = [
  "गेहूं (Wheat)", "धान (Rice)", "मक्का (Maize)", "बाजरा (Bajra)",
  "जौ (Barley)", "सोयाबीन (Soybean)", "मूंगफली (Groundnut)",
  "सरसों (Mustard)", "कपास (Cotton)", "गन्ना (Sugarcane)",
  "चना (Chickpea)", "तुअर (Pigeon Pea)", "मूंग (Mung Bean)",
  "उड़द (Black Gram)", "मसूर (Lentil)", "अरहर (Arhar)",
  "टमाटर (Tomato)", "प्याज (Onion)", "आलू (Potato)"
]

const GROWTH_STAGES = [
  { value: "sowing", label: "बुवाई (Sowing)" },
  { value: "germination", label: "अंकुरण (Germination)" },
  { value: "tillering", label: "टिलरिंग (Tillering)" },
  { value: "flowering", label: "फूल (Flowering)" },
  { value: "harvesting", label: "कटाई (Harvesting)" }
]

const IRRIGATION_TYPES = [
  { value: "rainfed", label: "वर्षा आधारित (Rainfed)" },
  { value: "borewell", label: "नलकूप (Borewell)" },
  { value: "canal", label: "नहर (Canal)" },
  { value: "drip", label: "ड्रिप / स्प्रिंकलर (Drip/Sprinkler)" }
]

const FARMING_TYPES = [
  { value: "traditional", label: "पारंपरिक (Traditional)" },
  { value: "organic", label: "जैविक (Organic)" },
  { value: "mixed", label: "मिश्रित (Mixed)" }
]

export function Onboarding() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Form Data
  const [state, setState] = useState(localStorage.getItem("signup_state") || "")
  const [district, setDistrict] = useState("")
  const [village, setVillage] = useState("")
  
  const [crop, setCrop] = useState("")
  const [growthStage, setGrowthStage] = useState("")
  const [sowingDate, setSowingDate] = useState("")
  
  const [landArea, setLandArea] = useState("")
  const [irrigationType, setIrrigationType] = useState("")
  
  const [nearestMandi, setNearestMandi] = useState("")
  const [farmingType, setFarmingType] = useState("")

  const totalSteps = 4

  const handleNext = () => {
    // Validation for required fields
    if (currentStep === 1 && !state) {
      setError("कृपया राज्य चुनें")
      return
    }
    if (currentStep === 2 && (!crop || !growthStage)) {
      setError("कृपया फसल और विकास चरण चुनें")
      return
    }
    if (currentStep === 3 && (!landArea || !irrigationType)) {
      setError("कृपया भूमि क्षेत्र और सिंचाई प्रकार दर्ज करें")
      return
    }

    setError("")
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    setError("")
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    setError("")
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    setError("")

    try {
      const farmerId = localStorage.getItem("farmer_id")
      
      if (!farmerId) {
        throw new Error("User session not found. Please login again.")
      }

      // Update farmer profile with location data
      const { error: profileError } = await supabase
        .from("farmers")
        .update({
          state: state || null,
          district: district || null,
          village: village || null,
          farming_type: farmingType || null,
          nearest_mandi: nearestMandi || null,
        })
        .eq("id", farmerId)

      if (profileError) {
        console.error("Profile update error:", profileError)
        throw profileError
      }

      // Create crop log entry if crop data provided
      if (crop && growthStage) {
        const { error: cropError } = await supabase
          .from("crop_logs")
          .insert({
            farmer_id: farmerId,
            crop_name: crop,
            growth_stage: growthStage,
            sowing_date: sowingDate || null,
            land_area: landArea ? parseFloat(landArea) : null,
            irrigation_type: irrigationType || null,
            status: "active"
          })

        if (cropError) {
          console.error("Crop log error:", cropError)
          // Don't fail onboarding if crop log fails
        }
      }

      // Clear signup temporary data
      localStorage.removeItem("signup_state")
      
      // Navigate to dashboard
      navigate("/dashboard")
      
    } catch (err: any) {
      console.error("Onboarding error:", err)
      setError(err.message || "Failed to save data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">आपकी स्थिति</h2>
              <p className="text-muted-foreground">अपना स्थान की जानकारी दें</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">राज्य *</label>
                <select
                  className="w-full h-12 px-4 rounded-xl border border-input bg-background"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                >
                  <option value="">राज्य चुनें</option>
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">जिला *</label>
                <Input
                  placeholder="जिला का नाम दर्ज करें"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">गाँव (वैकल्पिक)</label>
                <Input
                  placeholder="गाँव का नाम दर्ज करें"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Sprout className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">फसल की जानकारी</h2>
              <p className="text-muted-foreground">आप कौन सी फसल उगा रहे हैं?</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">फसल का नाम *</label>
                <select
                  className="w-full h-12 px-4 rounded-xl border border-input bg-background"
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  required
                >
                  <option value="">फसल चुनें</option>
                  {COMMON_CROPS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">विकास चरण *</label>
                <div className="grid grid-cols-2 gap-3">
                  {GROWTH_STAGES.map(stage => (
                    <button
                      key={stage.value}
                      type="button"
                      onClick={() => setGrowthStage(stage.value)}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        growthStage === stage.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-input hover:border-primary/50"
                      }`}
                    >
                      {stage.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">बुवाई की तारीख (वैकल्पिक)</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    className="pl-10"
                    value={sowingDate}
                    onChange={(e) => setSowingDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Droplets className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">भूमि और सिंचाई</h2>
              <p className="text-muted-foreground">खेती की जानकारी दें</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">भूमि क्षेत्र (एकड़ में) *</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="उदाहरण: 5"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">सिंचाई का प्रकार *</label>
                <div className="grid grid-cols-2 gap-3">
                  {IRRIGATION_TYPES.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setIrrigationType(type.value)}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        irrigationType === type.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-input hover:border-primary/50"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">बाजार की जानकारी</h2>
              <p className="text-muted-foreground">आपकी पसंदीदा मंडी</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">निकटतम मंडी (वैकल्पिक)</label>
                <Input
                  placeholder="मंडी का नाम दर्ज करें"
                  value={nearestMandi}
                  onChange={(e) => setNearestMandi(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  उदाहरण: भोपाल मंडी, इंदौर मंडी
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">खेती का प्रकार (वैकल्पिक)</label>
                <div className="grid grid-cols-1 gap-3">
                  {FARMING_TYPES.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFarmingType(type.value)}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        farmingType === type.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-input hover:border-primary/50"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Main Card */}
        <motion.div
          className="bg-background rounded-2xl shadow-xl p-8 border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1 || isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              पीछे
            </Button>

            <div className="flex gap-3">
              {currentStep < totalSteps && (
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  disabled={isLoading}
                >
                  Skip करें
                </Button>
              )}
              
              {currentStep < totalSteps ? (
                <Button onClick={handleNext} disabled={isLoading}>
                  आगे बढ़ें
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleComplete} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Complete
                      <Check className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Help Text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          💡 यह जानकारी आपको बेहतर फसल सलाह और मंडी भाव देने में मदद करेगी
        </p>
      </div>
    </div>
  )
}
