import { Bell, Globe, Menu } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { useState } from "react"
import { useTranslation } from "react-i18next"

interface NavbarProps {
  onMenuClick?: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { t, i18n } = useTranslation()
  const [notifications] = useState(3)

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt={t('app.name')} className="h-10 w-10 rounded-lg object-contain" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t('app.name')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Language Switcher */}
          <div className="relative hidden sm:block">
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="en">{t('language.en')}</option>
              <option value="hi">{t('language.hi')}</option>
              <option value="pa">{t('language.pa')}</option>
              <option value="mr">{t('language.mr')}</option>
              <option value="ta">{t('language.ta')}</option>
              <option value="te">{t('language.te')}</option>
              <option value="gu">{t('language.gu')}</option>
              <option value="bn">{t('language.bn')}</option>
              <option value="kn">{t('language.kn')}</option>
              <option value="or">{t('language.or')}</option>
            </select>
            <Globe className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {notifications}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
