import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Sprout,
  CloudRain,
  TrendingUp,
  Calculator,
  Settings,
  X,
  Users,
  ShoppingBag,
  FileText,
  ClipboardList,
} from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { useTranslation } from "react-i18next"

interface SidebarProps {
  isMobileOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isMobileOpen = false, onClose }: SidebarProps) {
  const location = useLocation()
  const { t } = useTranslation()

  const menuItems = [
    { icon: LayoutDashboard, label: t('nav.dashboard'), path: "/dashboard" },
    { icon: Sprout, label: "Crop Advisory", path: "/dashboard/crop-advisory" },
    { icon: CloudRain, label: t('nav.weather'), path: "/dashboard/weather-alerts" },
    { icon: TrendingUp, label: "Mandi Prices", path: "/dashboard/mandi-prices" },
    { icon: Calculator, label: "Simulator", path: "/dashboard/simulator" },
    { icon: Users, label: t('nav.community'), path: "/dashboard/community" },
    { icon: ShoppingBag, label: t('nav.marketplace'), path: "/dashboard/marketplace" },
    { icon: FileText, label: t('nav.schemes'), path: "/dashboard/schemes" },
    { icon: ClipboardList, label: t('nav.farmLog'), path: "/dashboard/farm-log" },
    { icon: Settings, label: t('nav.settings'), path: "/dashboard/settings" },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 border-r bg-card pt-16 lg:pt-0 transition-transform duration-300",
          !isMobileOpen && "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Desktop Logo */}
        <div className="hidden lg:flex h-16 items-center border-b px-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt={t('app.name')} className="h-12 w-12 rounded-lg object-contain" />
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{t('app.name')}</span>
          </div>
        </div>
        
        {/* Mobile Header */}
        <div className="flex h-16 items-center justify-between border-b px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt={t('app.name')} className="h-8 w-8 rounded-lg object-contain" />
            <span className="font-bold text-lg">{t('app.name')}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="space-y-2 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose?.()}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all hover:bg-accent",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5 relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
