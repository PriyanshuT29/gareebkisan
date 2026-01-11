import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import {
  TrendingUp,
  Target,
  Calculator,
  CloudRain,
  Sprout,
  FileText,
  Mic,
  Sparkles,
  Check,
  Crown,
} from "lucide-react"
import { Card } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

export function Premium() {
  const { t } = useTranslation()

  const features = [
    {
      icon: TrendingUp,
      title: t('premium.mandiInsights.title'),
      description: t('premium.mandiInsights.description'),
      benefits: [
        t('premium.mandiInsights.benefit1'),
        t('premium.mandiInsights.benefit2'),
        t('premium.mandiInsights.benefit3'),
      ],
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Target,
      title: t('premium.profitOptimization.title'),
      description: t('premium.profitOptimization.description'),
      benefits: [
        t('premium.profitOptimization.benefit1'),
        t('premium.profitOptimization.benefit2'),
      ],
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Calculator,
      title: t('premium.whatIfSimulator.title'),
      description: t('premium.whatIfSimulator.description'),
      benefits: [
        t('premium.whatIfSimulator.benefit1'),
        t('premium.whatIfSimulator.benefit2'),
        t('premium.whatIfSimulator.benefit3'),
      ],
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: CloudRain,
      title: t('premium.weatherAnalysis.title'),
      description: t('premium.weatherAnalysis.description'),
      benefits: [
        t('premium.weatherAnalysis.benefit1'),
        t('premium.weatherAnalysis.benefit2'),
        t('premium.weatherAnalysis.benefit3'),
      ],
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      icon: Sprout,
      title: t('premium.expertAdvisory.title'),
      description: t('premium.expertAdvisory.description'),
      benefits: [
        t('premium.expertAdvisory.benefit1'),
        t('premium.expertAdvisory.benefit2'),
        t('premium.expertAdvisory.benefit3'),
      ],
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      icon: FileText,
      title: t('premium.reports.title'),
      description: t('premium.reports.description'),
      benefits: [
        t('premium.reports.benefit1'),
        t('premium.reports.benefit2'),
      ],
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: Mic,
      title: t('premium.voiceFeatures.title'),
      description: t('premium.voiceFeatures.description'),
      benefits: [
        t('premium.voiceFeatures.benefit1'),
        t('premium.voiceFeatures.benefit2'),
      ],
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-4 flex justify-center">
              <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400 px-4 py-2 text-lg font-semibold">
                <Crown className="mr-2 h-5 w-5" />
                {t('premium.badge')}
              </Badge>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t('premium.hero.title')}
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-green-50 sm:text-2xl">
              {t('premium.hero.subtitle')}
            </p>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-8 flex justify-center gap-4"
            >
              <Sparkles className="h-12 w-12 text-yellow-300 animate-pulse" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold text-gray-900">
            {t('premium.features.title')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            {t('premium.features.subtitle')}
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <Card className="h-full overflow-hidden border-2 border-gray-100 transition-all hover:border-green-300 hover:shadow-xl">
                <div className="p-6">
                  {/* Icon */}
                  <div
                    className={`mb-4 inline-flex rounded-xl ${feature.bgColor} p-3`}
                  >
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-4 text-gray-600">{feature.description}</p>

                  {/* Benefits */}
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <Card className="overflow-hidden border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="p-8 text-center sm:p-12">
              <div className="mb-4 flex justify-center">
                <Crown className="h-16 w-16 text-yellow-500" />
              </div>
              <h2 className="mb-3 text-3xl font-bold text-gray-900">
                {t('premium.cta.title')}
              </h2>
              <p className="mx-auto mb-6 max-w-2xl text-lg text-gray-600">
                {t('premium.cta.description')}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>{t('premium.cta.point1')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>{t('premium.cta.point2')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>{t('premium.cta.point3')}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
