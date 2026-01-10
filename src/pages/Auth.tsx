import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate, Link } from "react-router-dom"
import { Tractor, ArrowRight, User, Loader2, Phone, Mail, MapPin } from "lucide-react"
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
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [error, setError] = useState("")

  // Password Reset State
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [resetPhone, setResetPhone] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [resetSuccess, setResetSuccess] = useState("")

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const storedId = localStorage.getItem("farmer_id")
      const { data: { session } } = await supabase.auth.getSession()

      if (storedId || session) {
        navigate("/dashboard")
      }
    }
    checkSession()
  }, [navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // 1. Custom Table Login (Bypasses Supabase Auth Confirmation)
      const { data: farmer, error: fetchError } = await supabase
        .from('farmers')
        .select('*')
        .eq('email', email)
        .single()

      if (fetchError || !farmer) {
        setError("Email not registered. Please sign up first.")
        setIsLoading(false)
        return
      }

      // 2. Validate Password (Plain text check as per request)
      if (farmer.password !== password) {
        setError("Incorrect password.")
        const shouldShowReset = window.confirm("Incorrect password. Would you like to reset it?")
        if (shouldShowReset) {
          setShowResetPassword(true)
        }
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
      // 1. Check if email already exists in our table
      const { data: existingUser } = await supabase
        .from('farmers')
        .select('id')
        .eq('email', email)
        .single()

      if (existingUser) {
        throw new Error("Email already registered. Please login.")
      }

      // 2. Create Supabase Auth User to generating a Valid ID
      // This step is CRITICAL to satisfy the foreign key constraint on 'farmers.id'
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        // If user exists in Auth but not in Farmers (rare edge case), we might still want to proceed if we can get the ID.
        // unlikely given step 1 check, unless manual DB manipulation.
        throw authError
      }

      if (!authData.user) {
        throw new Error("Failed to create account credential.")
      }

      const newUserId = authData.user.id

      // 3. Insert into Farmers Table
      // We use the ID from step 2 to satisfy FK.
      // We store the password in plain text as requested for the custom login flow.
      const { error: insertError } = await supabase
        .from("farmers")
        .insert([
          {
            id: newUserId,
            email: email,
            password: password,
            name: name,
            phone: phone,
            city: city,
            state: state,
          },
        ])
        .single()

      if (insertError) {
        console.error("Error creating profile:", insertError)
        throw insertError
      }

      // 4. Signup Success -> Auto Login
      console.log("Signup successful")
      localStorage.setItem("farmer_id", newUserId)
      navigate("/dashboard")

    } catch (err: any) {
      console.error("Signup error:", err)
      setError(err.message || "Signup failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setResetSuccess("")

    try {
      // Verify user by Email and Phone
      const { data: farmer, error: fetchError } = await supabase
        .from('farmers')
        .select('id')
        .eq('email', email)
        .eq('phone', resetPhone)
        .single()

      if (fetchError || !farmer) {
        throw new Error("Details do not match our records.")
      }

      // Update Password
      const { error: updateError } = await supabase
        .from('farmers')
        .update({ password: newPassword })
        .eq('id', farmer.id)

      if (updateError) throw updateError

      setResetSuccess("Password updated successfully! Please login.")
      setTimeout(() => {
        setShowResetPassword(false)
        setPassword("")
      }, 2000)

    } catch (err: any) {
      setError(err.message || "Failed to reset password")
    } finally {
      setIsLoading(false)
    }
  }

  if (showResetPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-muted/20">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Verify your identity to set a new password</CardDescription>
          </CardHeader>
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {resetSuccess && <div className="text-green-500 text-sm">{resetSuccess}</div>}

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number (Validation)</label>
                <Input value={resetPhone} onChange={(e) => setResetPhone(e.target.value)} required placeholder="Enter stored phone number" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <Input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required type="password" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => setShowResetPassword(false)}>Back to Login</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Reset Password"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
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
                    Enter your email to access your farm dashboard
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
                      <label className="text-sm font-medium leading-none" htmlFor="login-email">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="name@example.com"
                          className="pl-10"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none" htmlFor="login-password">
                        Password
                      </label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="text-right">
                      <button type="button" onClick={() => setShowResetPassword(true)} className="text-xs text-primary hover:underline">
                        Forgot Password?
                      </button>
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
                      <label className="text-sm font-medium leading-none" htmlFor="signup-email">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="name@example.com"
                          className="pl-10"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none" htmlFor="signup-password">
                        Password
                      </label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

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
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="city"
                            placeholder="Bhopal"
                            className="pl-10"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </div>
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
