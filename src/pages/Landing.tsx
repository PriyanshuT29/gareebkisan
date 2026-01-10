import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { ArrowRight, Shield, TrendingUp, AlertTriangle, Sparkles } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

export function Landing() {
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const farmerId = localStorage.getItem("farmer_id")
    if (farmerId) {
      navigate("/dashboard")
    }
    
    // Trigger animations after mount
    setIsVisible(true)
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <img src="/logo.png" alt="KrishiBandhu" className="h-10 w-10 rounded-lg object-contain" />
          <span>KrishiBandhu</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link to="/auth">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Layer 1: Farming Context - Field Grid Lines */}
        {!shouldReduceMotion && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {/* Horizontal field rows - subtle parallax movement */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`field-row-${i}`}
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/40 to-transparent"
                style={{ top: `${15 + i * 12}%` }}
                initial={{ x: '-100%', opacity: 0 }}
                animate={isVisible ? { 
                  x: ['0%', '100%'],
                  opacity: [0, 0.4, 0]
                } : {}}
                transition={{
                  duration: 40 + i * 5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.5
                }}
              />
            ))}
            
            {/* Vertical crop columns */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`crop-col-${i}`}
                className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-green-400/35 to-transparent"
                style={{ left: `${20 + i * 15}%` }}
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: [0, 0.3, 0.3, 0] } : {}}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 1.2
                }}
              />
            ))}

            {/* Soil contour waves */}
            <svg className="absolute bottom-0 left-0 right-0 opacity-15" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <motion.path
                d="M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z"
                fill="#22c55e"
                initial={{ y: 10 }}
                animate={isVisible ? { y: [10, -5, 10] } : {}}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>
          </div>
        )}

        {/* Layer 2: Environmental Factors - Weather Elements */}
        {!shouldReduceMotion && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {/* Sunlight rays - gentle pulse */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`sun-ray-${i}`}
                className="absolute w-2 bg-gradient-to-b from-yellow-400/0 via-yellow-400/30 to-transparent"
                style={{
                  left: `${25 + i * 20}%`,
                  top: '-10%',
                  height: '40%',
                  transform: `rotate(${-10 + i * 8}deg)`,
                  transformOrigin: 'top'
                }}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={isVisible ? {
                  opacity: [0, 0.6, 0],
                  scaleY: [0, 1, 0]
                } : {}}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 1.5
                }}
              />
            ))}

            {/* Rain droplets - very subtle */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`rain-${i}`}
                className="absolute w-1 h-4 bg-gradient-to-b from-blue-400/40 to-transparent rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-5%'
                }}
                initial={{ y: 0, opacity: 0 }}
                animate={isVisible ? {
                  y: ['0vh', '110vh'],
                  opacity: [0, 0.4, 0.4, 0]
                } : {}}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.4
                }}
              />
            ))}

            {/* Wind waves - organic flow */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`wind-${i}`}
                className="absolute h-0.5 opacity-25"
                style={{
                  left: '-20%',
                  top: `${30 + i * 20}%`,
                  width: '140%',
                  background: 'linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.6), transparent)'
                }}
                initial={{ x: '-100%' }}
                animate={isVisible ? { x: '100%' } : {}}
                transition={{
                  duration: 15 + i * 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 2
                }}
              />
            ))}
          </div>
        )}

        {/* Layer 3: AI Intelligence Overlay - Data Flow & Optimization */}
        {!shouldReduceMotion && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {/* Neural network nodes - subtle pulse */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`node-${i}`}
                className="absolute w-3 h-3 rounded-full bg-primary/50 backdrop-blur-sm shadow-lg shadow-primary/30"
                style={{
                  left: `${15 + (i % 4) * 25}%`,
                  top: `${25 + Math.floor(i / 4) * 35}%`
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={isVisible ? {
                  scale: [0, 1.2, 1],
                  opacity: [0, 0.7, 0.5]
                } : {}}
                transition={{
                  duration: 3,
                  delay: 1 + i * 0.3,
                  ease: "easeOut"
                }}
              >
                {/* Connection lines between nodes */}
                {i < 7 && (
                  <motion.div
                    className="absolute w-0.5 h-12 bg-gradient-to-b from-primary/30 to-transparent origin-top"
                    style={{
                      left: '50%',
                      top: '100%',
                      transform: `rotate(${(i % 2) * 30 - 15}deg)`
                    }}
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={isVisible ? {
                      scaleY: [0, 1],
                      opacity: [0, 0.6]
                    } : {}}
                    transition={{
                      duration: 2,
                      delay: 1.5 + i * 0.3,
                      ease: "easeOut"
                    }}
                  />
                )}
              </motion.div>
            ))}

            {/* Data flow particles - intelligence in motion */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-2 h-2 rounded-full bg-primary/60 shadow-md shadow-primary/40"
                style={{
                  left: `${10 + i * 15}%`,
                  top: '50%'
                }}
                initial={{ y: 0, opacity: 0 }}
                animate={isVisible ? {
                  y: [0, -100, -200],
                  x: [0, Math.sin(i) * 30, Math.sin(i) * 60],
                  opacity: [0, 0.8, 0],
                  scale: [1, 1.5, 0.5]
                } : {}}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2 + i * 0.8
                }}
              />
            ))}

            {/* Optimization pulse waves - bringing calm to chaos */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`pulse-${i}`}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/40"
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={isVisible ? {
                  width: ['0px', '400px', '800px'],
                  height: ['0px', '400px', '800px'],
                  opacity: [0, 0.6, 0]
                } : {}}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 3 + i * 2.5
                }}
              />
            ))}

            {/* Intelligence scan lines - horizontal analysis */}
            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-lg shadow-primary/20"
              style={{ top: '50%' }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={isVisible ? {
                scaleX: [0, 1, 1, 0],
                opacity: [0, 0.7, 0.7, 0],
                y: ['0%', '50%', '100%']
              } : {}}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2.5
              }}
            />
          </div>
        )}

        <div className="mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-center"
          >
            <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20">
              <Sparkles className="mr-2 h-3 w-3" />
              AI-Powered Smart Farming
            </Badge>
            <motion.h1 
              className="mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              Smart Decisions.
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Better Crops.
              </span>
              <br />
              Higher Profit.
            </motion.h1>
            <motion.p 
              className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            >
              Get personalized crop advisory, real-time weather alerts, and accurate mandi price predictions—all powered by AI to help you make smarter farming decisions.
            </motion.p>
            <motion.div 
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
            >
              <Button size="lg" asChild className="group">
                <Link to="/dashboard">
                  Get Crop Insights
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="#features">Learn More</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Powerful Features for Modern Farmers</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Everything you need to optimize your farming operations and maximize profits
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Crop Advisory",
                description: "AI-powered personalized recommendations for sowing, irrigation, and fertilization based on your crop type, growth stage, and local conditions.",
                gradient: "from-green-500 to-emerald-600",
              },
              {
                icon: AlertTriangle,
                title: "Weather Risk Alerts",
                description: "Real-time weather forecasts with crop-specific risk assessments. Get actionable alerts before adverse conditions affect your harvest.",
                gradient: "from-blue-500 to-cyan-600",
              },
              {
                icon: TrendingUp,
                title: "Mandi Price Prediction",
                description: "Accurate price forecasts for your crops. Know the best time to sell and which mandi offers the best rates up to 30 days in advance.",
                gradient: "from-amber-500 to-orange-600",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full transition-all hover:scale-105 hover:shadow-xl">
                  <CardHeader>
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="px-6 py-16 bg-muted/50">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    AI Confidence Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Every recommendation includes a confidence score, so you know how reliable each suggestion is. Our AI learns from millions of data points to give you the best advice.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Real-Time Data Freshness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Weather data updates every hour. Price predictions refresh daily. Crop advisories adjust based on the latest conditions. You always have the most current information.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Ready to Transform Your Farming?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of farmers making smarter decisions with KrishiBandhu
            </p>
            <Button size="lg" asChild className="group">
              <Link to="/auth">
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
