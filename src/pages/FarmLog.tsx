import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ClipboardList, Plus, Calendar as CalendarIcon, X, Trash2, Edit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { mockFarmLogs } from "../data/mockData"
import { useTranslation } from "react-i18next"

export function FarmLog() {
  const { t } = useTranslation()
  const [logs, setLogs] = useState(mockFarmLogs)
  const [showAddLog, setShowAddLog] = useState(false)
  const [newLog, setNewLog] = useState({
    activity: "",
    cost: "",
    notes: "",
    category: "inputs" as "labor" | "inputs" | "machinery" | "other"
  })

  const totalCost = logs.reduce((acc, log) => acc + log.cost, 0)
  
  // Calculate category-wise expenses
  const categoryExpenses = logs.reduce((acc, log) => {
    acc[log.category] = (acc[log.category] || 0) + log.cost
    return acc
  }, {} as Record<string, number>)

  const handleAddLog = () => {
    if (!newLog.activity || !newLog.cost) {
      alert("Please fill in activity and cost")
      return
    }
    
    const logEntry = {
      id: String(logs.length + 1),
      date: new Date().toISOString().split('T')[0],
      activity: newLog.activity,
      cost: parseFloat(newLog.cost),
      notes: newLog.notes,
      category: newLog.category
    }
    
    setLogs([logEntry, ...logs])
    setNewLog({ activity: "", cost: "", notes: "", category: "inputs" })
    setShowAddLog(false)
  }

  const handleDeleteLog = (id: string) => {
    if (confirm("Are you sure you want to delete this log entry?")) {
      setLogs(logs.filter(log => log.id !== id))
    }
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
          <h1 className="text-3xl font-bold">{t('farmLog.title')}</h1>
          <p className="text-muted-foreground">Track your daily farming activities and expenses</p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setShowAddLog(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('farmLog.addLog')}
        </Button>
      </motion.div>

      {/* Add Log Modal */}
      <AnimatePresence>
        {showAddLog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAddLog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add Farm Log Entry</h2>
                <button onClick={() => setShowAddLog(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Activity</label>
                  <Input
                    value={newLog.activity}
                    onChange={(e) => setNewLog({ ...newLog, activity: e.target.value })}
                    placeholder="e.g., Wheat sowing"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Cost (₹)</label>
                  <Input
                    type="number"
                    value={newLog.cost}
                    onChange={(e) => setNewLog({ ...newLog, cost: e.target.value })}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <Select 
                    value={newLog.category}
                    onValueChange={(value) => setNewLog({ ...newLog, category: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inputs">Inputs (Seeds, Fertilizer)</SelectItem>
                      <SelectItem value="labor">Labor</SelectItem>
                      <SelectItem value="machinery">Machinery</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                  <Input
                    value={newLog.notes}
                    onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                    placeholder="Additional details..."
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAddLog}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Add Entry
                  </Button>
                  <Button 
                    onClick={() => setShowAddLog(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-red-500">
                      - ₹{log.cost.toLocaleString()}
                    </div>
                    <button 
                      onClick={() => handleDeleteLog(log.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
               <div className="space-y-2">
                 {Object.entries(categoryExpenses).map(([category, amount]) => {
                   const percentage = Math.round((amount / totalCost) * 100)
                   return (
                     <div key={category}>
                       <div className="flex justify-between text-sm">
                         <span className="capitalize">{category}</span>
                         <span>{percentage}%</span>
                       </div>
                       <div className="h-2 w-full rounded-full bg-secondary">
                         <div 
                           className="h-2 rounded-full bg-primary" 
                           style={{ width: `${percentage}%` }}
                         />
                       </div>
                     </div>
                   )
                 })}
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
