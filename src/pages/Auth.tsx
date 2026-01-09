import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate, Link } from "react-router-dom"
import { Tractor, ArrowRight, User, Loader2, Phone } from "lucide-react"
import { supabase } from "../lib/supabase"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { useTranslation } from "react-i18next"

export function Auth() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  // Form State
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [error, setError] = useState("")

  // Check if already logged in
  useEffect(() => {
    const farmerId = localStorage.getItem("farmer_id")
    if (farmerId) {
      navigate("/dashboard")
    }
  }, [navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Attempting login for:", phone)

      // 1. Find farmer by phone
      const { data: farmers, error: fetchError } = await supabase
        .from('farmers')
        .select('*')
        .eq('phone', phone)

      if (fetchError) throw fetchError

      // 2. Validate
      const farmer = farmers?.[0]
      if (!farmer) {
        setError("Farmer not found. Please sign up.")
        setIsLoading(false)
        return
      }

      if (farmer.name.toLowerCase().trim() !== name.toLowerCase().trim()) {
        setError("Name does not match our records.")
        setIsLoading(false)
        return
      }

      // 3. Login Success
      console.log("Login successful:", farmer)
      localStorage.setItem("farmer_id", farmer.id)
      navigate("/dashboard")

    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Attempting signup for:", phone)

      // 1. Check duplicate phone
      const { data: existing, error: checkError } = await supabase
        .from('farmers')
        .select('id')
        .eq('phone', phone)
        .maybeSingle()

      if (checkError) throw checkError

      if (existing) {
        setError("Phone number already registered. Please login.")
        setIsLoading(false)
        return
      }

      // 2. Create Farmer
      const newId = crypto.randomUUID()
      const { data: newFarmer, error: insertError } = await supabase
        .from('farmers')
        .insert([
          {
            id: newId,
            name: name,
            phone: phone,
            city: city,
            state: state
          }
        ])
        .select()
        .single()

      if (insertError) throw insertError

      // 3. Signup Success
      console.log("Signup successful:", newFarmer)
      localStorage.setItem("farmer_id", newFarmer.id)
      navigate("/dashboard")

    } catch (err: any) {
      console.error("Signup error:", err)
      setError(err.message || "Signup failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-primary p-10 text-primary-foreground relative overflow-hidden">
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
            <img src="/logo.png" alt="KrishiBandhu" className="h-10 w-10 rounded-lg" />
            <span>KrishiBandhu</span>
          </Link>
          <div className="mt-20">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Empowering Farmers with AI Technology
            </h1>
            <p className="text-xl opacity-90 max-w-lg">
              Join thousands of farmers using our platform to increase yields, optimize resources, and get real-time market insights.
            </p>
          </div>
        </div>

        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex items-center gap-4 text-sm opacity-80">
          <div className="flex items-center gap-1">
            <Tractor className="h-4 w-4" />
            <span>Smart Farming</span>
          </div>
          <div className="h-4 w-px bg-current" />
          <span>Market Insights</span>
          <div className="h-4 w-px bg-current" />
          <span>Crop Advisory</span>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex items-center justify-center p-6 bg-muted/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="lg:hidden flex items-center gap-2 text-xl font-bold mb-8 justify-center text-primary">
            <img src="/logo.png" alt="KrishiBandhu" className="h-8 w-8 rounded-lg" />
            <span>KrishiBandhu</span>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
              <TabsTrigger value="signup">{t('auth.signUp')}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="border-0 shadow-lg">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-center">{t('dashboard.welcome')}</CardTitle>
                  <CardDescription className="text-center">
                    Enter your details to access your farm dashboard
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    {error && (
                      <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                        {error}
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none" htmlFor="login-name">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-name"
                          placeholder="Ram Singh"
                          className="pl-10"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none" htmlFor="login-phone">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-phone"
                          type="tel"
                          placeholder="9876543210"
                          className="pl-10"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-4">
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('common.loading')}
                        </>
                      ) : (
                        <>
                          Login <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="border shadow-xl">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-center">{t('auth.register')}</CardTitle>
                  <CardDescription className="text-center">
                    Start your journey towards smarter farming today
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup}>
                  <CardContent className="space-y-4">
                    {error && (
                      <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                        {error}
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none" htmlFor="signup-name">
                        {t('auth.name')}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          placeholder="Ram Singh"
                          className="pl-10"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none" htmlFor="signup-phone">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-phone"
                          type="tel"
                          placeholder="9876543210"
                          className="pl-10"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="city">
                          City
                        </label>
                        <Input
                          id="city"
                          placeholder="Bhopal"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="state">
                          State
                        </label>
                        <Input
                          id="state"
                          placeholder="Madhya Pradesh"
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-4">
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('common.loading')}
                        </>
                      ) : (
                        <>
                          Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground">
            By using this demo app, you understand this is for testing purposes only.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
