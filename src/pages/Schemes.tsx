import { motion } from "framer-motion"
import { ExternalLink, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { mockSchemes } from "../data/mockData"
import { useTranslation } from "react-i18next"

export function Schemes() {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">{t('schemes.title')}</h1>
        <p className="text-muted-foreground">Find and apply for relevant government subsidies and programs</p>
      </motion.div>

      <div className="grid gap-6">
        {mockSchemes.map((scheme, index) => (
          <motion.div
            key={scheme.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{scheme.title}</CardTitle>
                    <CardDescription className="mt-2 text-base">
                      {scheme.description}
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('schemes.benefits')}</p>
                    <p className="font-semibold text-primary">{scheme.benefit}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('schemes.eligibility')}</p>
                    <p className="text-sm">{scheme.eligibility}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('schemes.deadline')}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      {scheme.deadline}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="gap-2" asChild>
                  <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                    {t('schemes.apply')} <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
