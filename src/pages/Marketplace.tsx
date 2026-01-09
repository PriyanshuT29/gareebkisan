import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, MapPin, Plus, X, Phone, MessageCircle, Heart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
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
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [showAddListing, setShowAddListing] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [newListing, setNewListing] = useState({
    name: "",
    price: "",
    unit: "",
    category: "seeds"
  })

  const filteredItems = filter === "all" 
    ? mockMarketplaceItems 
    : mockMarketplaceItems.filter(item => item.category === filter)

  const toggleFavorite = (itemId: string) => {
    const newFavorites = new Set(favorites)
    if (favorites.has(itemId)) {
      newFavorites.delete(itemId)
    } else {
      newFavorites.add(itemId)
    }
    setFavorites(newFavorites)
  }

  const handleContact = (item: any) => {
    setSelectedItem(item)
  }

  const handleCall = () => {
    alert(`Calling ${selectedItem?.seller}... \n(Demo: In production, this would initiate a phone call)`)
  }

  const handleMessage = () => {
    alert(`Opening chat with ${selectedItem?.seller}... \n(Demo: In production, this would open a messaging interface)`)
  }

  const handleAddListing = () => {
    if (!newListing.name || !newListing.price) {
      alert("Please fill in all required fields")
      return
    }
    alert("Listing added successfully! \n(Demo: In production, this would be submitted to the backend)")
    setShowAddListing(false)
    setNewListing({ name: "", price: "", unit: "", category: "seeds" })
  }

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
              <SelectItem value="produce">Produce</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowAddListing(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('marketplace.addListing')}
          </Button>
        </div>
      </motion.div>

      {/* Add Listing Modal */}
      <AnimatePresence>
        {showAddListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddListing(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-lg p-6 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{t('marketplace.addListing')}</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowAddListing(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Product Name</label>
                  <Input
                    value={newListing.name}
                    onChange={(e) => setNewListing({...newListing, name: e.target.value})}
                    placeholder="e.g., Wheat Seeds"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Price (₹)</label>
                  <Input
                    type="number"
                    value={newListing.price}
                    onChange={(e) => setNewListing({...newListing, price: e.target.value})}
                    placeholder="e.g., 2500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Unit</label>
                  <Input
                    value={newListing.unit}
                    onChange={(e) => setNewListing({...newListing, unit: e.target.value})}
                    placeholder="e.g., quintal, bag, piece"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select value={newListing.category} onValueChange={(value) => setNewListing({...newListing, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seeds">Seeds</SelectItem>
                      <SelectItem value="fertilizers">Fertilizers</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="produce">Produce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowAddListing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddListing}>
                  Add Listing
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Contact Seller</h2>
                <Button variant="ghost" size="icon" onClick={() => setSelectedItem(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="font-semibold">{selectedItem.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Seller</p>
                  <p className="font-semibold">{selectedItem.seller}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">{selectedItem.location}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Button onClick={handleCall} className="gap-2">
                    <Phone className="h-4 w-4" />
                    Call
                  </Button>
                  <Button onClick={handleMessage} variant="outline" className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Message
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video w-full bg-muted flex items-center justify-center relative">
                 {/* Placeholder for actual image */}
                 <ShoppingCart className="h-12 w-12 text-muted-foreground/50" />
                 <Button
                   variant="ghost"
                   size="icon"
                   className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                   onClick={() => toggleFavorite(item.id)}
                 >
                   <Heart className={`h-4 w-4 ${favorites.has(item.id) ? 'fill-red-500 text-red-500' : ''}`} />
                 </Button>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{item.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {item.location}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="capitalize">{item.category}</Badge>
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
                <Button className="w-full" onClick={() => handleContact(item)}>
                  {t('marketplace.contact')}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
