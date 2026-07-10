import { Info, Sparkles, TrendingUp, AlertCircle } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, ReferenceLine, Tooltip as RechartsTooltip } from "recharts"

const GAUGE_DATA = [
  { name: 'CSAT', value: 92, color: '#10b981' }, // 92% satisfaction
  { name: 'Remaining', value: 8, color: 'hsl(var(--muted))' }
]

const BULLET_DATA = [
  {
    name: 'Q3 Revenue',
    actual: 1.6,
    target: 2.0,
    poor: 1.0,
    satisfactory: 1.5,
    good: 2.5
  }
]

export default function BusinessIntelligenceTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* Premium Alert Banner */}
      <div className="p-4 bg-primary/10 border border-primary/20 backdrop-blur-md rounded-2xl flex gap-3 shadow-sm items-start">
        <Info className="w-5 h-5 text-primary mt-0.5" />
        <div>
          <h4 className="font-semibold text-primary">Simulation Mode Active</h4>
          <p className="text-sm text-primary/80 mt-1">Because the uploaded dataset only contains content metadata, this intelligence vertical uses highly-realistic simulated operational data to demonstrate structural BI capabilities.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* CSAT Gauge */}
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold mb-1 w-full text-left">Customer Satisfaction (CSAT)</h3>
          <p className="text-xs text-muted-foreground mb-6 w-full text-left">Real-time simulated user satisfaction index.</p>
          
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={GAUGE_DATA}
                  cx="50%"
                  cy="100%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {GAUGE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-2">
               <span className="text-4xl font-bold text-foreground">92%</span>
               <span className="text-sm font-medium text-emerald-500 flex items-center gap-1 mt-1"><TrendingUp className="w-4 h-4"/> +3.2% vs last month</span>
            </div>
          </div>
        </div>

        {/* AI Insight Matrix */}
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow lg:col-span-2 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-semibold">AI Operational Insights</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-6">Automated anomaly detection and strategic recommendations.</p>
          
          <div className="grid gap-4 md:grid-cols-2 flex-1">
             <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex flex-col justify-center">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2 font-medium">
                  <TrendingUp className="w-4 h-4" /> Cost Optimization
                </div>
                <p className="text-sm text-foreground/80">Bandwidth caching algorithms have successfully reduced streaming operational costs by 14% over the last 30 days.</p>
             </div>
             
             <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex flex-col justify-center">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-2 font-medium">
                  <AlertCircle className="w-4 h-4" /> Churn Risk Detected
                </div>
                <p className="text-sm text-foreground/80">Cohort B is showing early warning signs of elevated churn. Recommendation: Deploy targeted retention email campaign.</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Financial Bullet Chart */}
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Quarterly Revenue vs Target</h3>
          <p className="text-xs text-muted-foreground mb-4">Tracking actual $MM against established KPI targets.</p>
          
          <div className="h-[120px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={BULLET_DATA} layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
                  <XAxis type="number" domain={[0, 'dataMax']} hide />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "currentColor", opacity: 0.8 }} />
                  <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  
                  {/* Background ranges (Poor, Satisfactory, Good) */}
                  <Bar dataKey="good" fill="hsl(var(--muted))" opacity={0.3} barSize={40} isAnimationActive={false} />
                  
                  {/* Actual Value */}
                  <Bar dataKey="actual" fill="#3b82f6" barSize={16} radius={4} />

                  {/* Target Line */}
                  <ReferenceLine x={2.0} stroke="#f43f5e" strokeWidth={4} strokeDasharray="3 3" />
               </BarChart>
             </ResponsiveContainer>
          </div>
          <div className="flex justify-between items-center text-xs text-muted-foreground px-16 mt-[-10px]">
            <span>$0</span>
            <span className="flex items-center gap-1"><div className="w-3 h-0.5 bg-rose-500"></div> Target: $2.0M</span>
            <span>$2.5M</span>
          </div>
        </div>
      </div>

    </div>
  )
}
