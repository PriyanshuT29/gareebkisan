import { useState } from "react"
import { motion } from "framer-motion"
import { ClipboardList, Plus, Calendar as CalendarIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { mockFarmLogs } from "../data/mockData"
import { useTranslation } from "react-i18next"

export function FarmLog() {
  const { t } = useTranslation()
  const [logs] = useState(mockFarmLogs)

  const totalCost = logs.reduce((acc, log) => acc + log.cost, 0)

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">{t('farmLog.title')}</h1>
          <p className="text-muted-foreground">Track your daily farming activities and expenses</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t('farmLog.addLog')}
        </Button>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t('dashboard.recentActivities')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <ClipboardList className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{log.activity}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="h-3 w-3" />
                        {new Date(log.date).toLocaleDateString()}
                        <span>•</span>
                        <span className="capitalize">{log.category}</span>
                      </div>
                      {log.notes && (
                        <p className="mt-1 text-sm text-muted-foreground">{log.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="font-semibold text-red-500">
                    - ₹{log.cost.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.overview')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl bg-primary/5 p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Expenses (Jan)</p>
              <p className="text-3xl font-bold text-primary">₹{totalCost.toLocaleString()}</p>
            </div>
            
            <div className="mt-6 space-y-4">
               <h4 className="text-sm font-semibold">Expense Distribution</h4>
               {/* Mock distribution */}
               <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                   <span>Inputs (Seeds/Fertilizers)</span>
                   <span>80%</span>
                 </div>
                 <div className="h-2 w-full rounded-full bg-secondary">
                   <div className="h-2 w-[80%] rounded-full bg-primary" />
                 </div>
                 
                 <div className="flex justify-between text-sm">
                   <span>Labor</span>
                   <span>20%</span>
                 </div>
                 <div className="h-2 w-full rounded-full bg-secondary">
                   <div className="h-2 w-[20%] rounded-full bg-orange-500" />
                 </div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
