import { useEffect } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { ArrowRight, Shield, TrendingUp, AlertTriangle, Sparkles } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

export function Landing() {
  const navigate = useNavigate()

  useEffect(() => {
    const farmerId = localStorage.getItem("farmer_id")
    if (farmerId) {
      navigate("/dashboard")
    }
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
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20">
              <Sparkles className="mr-2 h-3 w-3" />
              AI-Powered Smart Farming
            </Badge>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Smart Decisions.
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Better Crops.
              </span>
              <br />
              Higher Profit.
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Get personalized crop advisory, real-time weather alerts, and accurate mandi price predictions—all powered by AI to help you make smarter farming decisions.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="group">
                <Link to="/dashboard">
                  Get Crop Insights
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="#features">Learn More</Link>
              </Button>
            </div>
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
