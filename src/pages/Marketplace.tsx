import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { mockMarketplaceItems } from "../data/mockData"
import { useTranslation } from "react-i18next"

export function Marketplace() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState("all")

  const filteredItems = filter === "all" 
    ? mockMarketplaceItems 
    : mockMarketplaceItems.filter(item => item.category === filter)

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">{t('marketplace.title')}</h1>
          <p className="text-muted-foreground">{t('marketplace.browse')}</p>
        </div>
        <div className="flex gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('marketplace.category')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('farmLog.all')}</SelectItem>
              <SelectItem value="seeds">{t('marketplace.seeds')}</SelectItem>
              <SelectItem value="fertilizers">{t('marketplace.fertilizer')}</SelectItem>
              <SelectItem value="equipment">{t('marketplace.equipment')}</SelectItem>
            </SelectContent>
          </Select>
          <Button>{t('marketplace.addListing')}</Button>
        </div>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden">
              <div className="aspect-video w-full bg-muted flex items-center justify-center">
                 {/* Placeholder for actual image */}
                 <ShoppingCart className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{item.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {item.location}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{item.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">₹{item.price.toLocaleString()}</span>
                  <span className="text-muted-foreground">/{item.unit}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Seller: {item.seller}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">{t('marketplace.contact')}</Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
