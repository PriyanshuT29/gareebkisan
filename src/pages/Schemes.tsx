import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Calendar, BookmarkPlus, Check, Filter, Info, TrendingUp, Droplets, Sprout, IndianRupee, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { mockSchemes } from "../data/mockData"
import { useTranslation } from "react-i18next"

export function Schemes() {
  const { t } = useTranslation()
  const [savedSchemes, setSavedSchemes] = useState<Set<string>>(new Set())
  const [filterApplied, setFilterApplied] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // Categorize schemes
  const categorizeScheme = (title: string) => {
    if (title.includes("PM Kisan") || title.includes("Kalyan Yojana")) return "financial"
    if (title.includes("Insurance") || title.includes("Fasal Bima")) return "insurance"
    if (title.includes("Solar") || title.includes("Kusum") || title.includes("Irrigation") || title.includes("Sinchai")) return "infrastructure"
    if (title.includes("e-NAM") || title.includes("Market") || title.includes("Bhavantar")) return "marketing"
    if (title.includes("Credit Card") || title.includes("KCC")) return "credit"
    if (title.includes("Organic") || title.includes("PKVY") || title.includes("Soil Health")) return "advisory"
    if (title.includes("Mechanization") || title.includes("SMAM")) return "mechanization"
    if (title.includes("Horticulture") || title.includes("MIDH") || title.includes("Matsya")) return "diversification"
    if (title.includes("Call Centre") || title.includes("Helpline")) return "support"
    return "other"
  }

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "financial": return <IndianRupee className="h-4 w-4" />
      case "insurance": return <Shield className="h-4 w-4" />
      case "infrastructure": return <Droplets className="h-4 w-4" />
      case "marketing": return <TrendingUp className="h-4 w-4" />
      case "advisory": return <Sprout className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch(category) {
      case "financial": return "bg-green-100 text-green-800"
      case "insurance": return "bg-blue-100 text-blue-800"
      case "infrastructure": return "bg-purple-100 text-purple-800"
      case "marketing": return "bg-orange-100 text-orange-800"
      case "credit": return "bg-yellow-100 text-yellow-800"
      case "advisory": return "bg-teal-100 text-teal-800"
      case "mechanization": return "bg-indigo-100 text-indigo-800"
      case "diversification": return "bg-pink-100 text-pink-800"
      case "support": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const toggleSaveScheme = (schemeId: string) => {
    const newSaved = new Set(savedSchemes)
    if (savedSchemes.has(schemeId)) {
      newSaved.delete(schemeId)
    } else {
      newSaved.add(schemeId)
    }
    setSavedSchemes(newSaved)
  }

  const handleApply = (scheme: any) => {
    if (scheme.link.startsWith('http')) {
      window.open(scheme.link, '_blank', 'noopener,noreferrer')
    } else {
      alert(`Application process initiated for: ${scheme.title}\n\n(In production, this would redirect to the government portal or show an application form)`)
    }
  }

  const filteredSchemes = mockSchemes
    .filter(s => filterApplied === "saved" ? savedSchemes.has(s.id) : true)
    .filter(s => categoryFilter === "all" ? true : categorizeScheme(s.title) === categoryFilter)
  
  // Count schemes by category
  const categoryCount = {
    financial: mockSchemes.filter(s => categorizeScheme(s.title) === "financial").length,
    insurance: mockSchemes.filter(s => categorizeScheme(s.title) === "insurance").length,
    infrastructure: mockSchemes.filter(s => categorizeScheme(s.title) === "infrastructure").length,
    marketing: mockSchemes.filter(s => categorizeScheme(s.title) === "marketing").length,
  }
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">{t('schemes.title')}</h1>
          <p className="text-muted-foreground">Find and apply for relevant government subsidies and programs</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterApplied === "all" ? "default" : "outline"}
            onClick={() => setFilterApplied("all")}
          >
            All Schemes ({mockSchemes.length})
          </Button>
          <Button
            variant={filterApplied === "saved" ? "default" : "outline"}
            onClick={() => setFilterApplied("saved")}
          >
            <BookmarkPlus className="h-4 w-4 mr-2" />
            Saved ({savedSchemes.size})
          </Button>
        </div>
      </motion.div>

      {/* Category Filter Pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        <Badge 
          variant={categoryFilter === "all" ? "default" : "outline"}
          className="cursor-pointer px-4 py-2 text-sm"
          onClick={() => setCategoryFilter("all")}
        >
          All Categories
        </Badge>
        <Badge 
          variant="outline"
          className={`cursor-pointer px-4 py-2 text-sm ${categoryFilter === "financial" ? "bg-green-100 text-green-800 border-green-300" : ""}`}
          onClick={() => setCategoryFilter("financial")}
        >
          <IndianRupee className="h-3 w-3 mr-1" />
          Financial Support ({categoryCount.financial})
        </Badge>
        <Badge 
          variant="outline"
          className={`cursor-pointer px-4 py-2 text-sm ${categoryFilter === "insurance" ? "bg-blue-100 text-blue-800 border-blue-300" : ""}`}
          onClick={() => setCategoryFilter("insurance")}
        >
          Insurance ({categoryCount.insurance})
        </Badge>
        <Badge 
          variant="outline"
          className={`cursor-pointer px-4 py-2 text-sm ${categoryFilter === "infrastructure" ? "bg-purple-100 text-purple-800 border-purple-300" : ""}`}
          onClick={() => setCategoryFilter("infrastructure")}
        >
          <Droplets className="h-3 w-3 mr-1" />
          Infrastructure ({categoryCount.infrastructure})
        </Badge>
        <Badge 
          variant="outline"
          className={`cursor-pointer px-4 py-2 text-sm ${categoryFilter === "marketing" ? "bg-orange-100 text-orange-800 border-orange-300" : ""}`}
          onClick={() => setCategoryFilter("marketing")}
        >
          <TrendingUp className="h-3 w-3 mr-1" />
          Marketing ({categoryCount.marketing})
        </Badge>
      </motion.div>

      {/* Schemes count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredSchemes.length} scheme{filteredSchemes.length !== 1 ? 's' : ''}
      </div>

      <div className="grid gap-6">
        {filteredSchemes.map((scheme, index) => {
          const category = categorizeScheme(scheme.title)
          const categoryColor = getCategoryColor(category)
          
          return (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{scheme.title}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleSaveScheme(scheme.id)}
                          className="h-8 w-8"
                        >
                          {savedSchemes.has(scheme.id) ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <BookmarkPlus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="flex gap-2 mb-2">
                        <Badge className={categoryColor}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Badge>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
                        {scheme.title.includes("(MP)") && (
                          <Badge variant="outline" className="border-orange-500 text-orange-600">
                            MP State Scheme
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="mt-2 text-base">
                        {scheme.description}
                      </CardDescription>
                    </div>
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
              <CardFooter className="gap-2">
                <Button className="gap-2 flex-1" onClick={() => handleApply(scheme)}>
                  {t('schemes.apply')} <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="outline" asChild>
                  <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                    Learn More
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )})}
        
        {filteredSchemes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">
              {filterApplied === "saved" 
                ? "No saved schemes yet. Save schemes to view them here."
                : "No schemes found matching your filters."}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
