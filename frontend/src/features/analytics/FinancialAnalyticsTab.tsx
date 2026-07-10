import { ResponsivePie } from '@nivo/pie'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts"
import { Info, DollarSign } from "lucide-react"

const MOCK_MRR = [
  { month: 'Jan', historical: 1.1, forecast: null },
  { month: 'Feb', historical: 1.25, forecast: null },
  { month: 'Mar', historical: 1.35, forecast: null },
  { month: 'Apr', historical: 1.5, forecast: null },
  { month: 'May', historical: 1.6, forecast: 1.6 },
  { month: 'Jun', historical: null, forecast: 1.75 },
  { month: 'Jul', historical: null, forecast: 1.95 },
  { month: 'Aug', historical: null, forecast: 2.2 }
]

const MOCK_ARPU = [
  { month: 'Jan', arpu: 12.50 },
  { month: 'Feb', arpu: 12.80 },
  { month: 'Mar', arpu: 13.10 },
  { month: 'Apr', arpu: 13.60 },
  { month: 'May', arpu: 14.20 },
  { month: 'Jun', arpu: 14.80 }
]

const MOCK_TIERS = [
  { id: "Premium ($19.99)", value: 45, color: "hsl(var(--primary))" },
  { id: "Standard ($12.99)", value: 35, color: "hsl(var(--secondary))" },
  { id: "Basic ($8.99)", value: 20, color: "hsl(var(--muted))" }
]

export default function FinancialAnalyticsTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* Premium Alert Banner */}
      <div className="p-4 bg-primary/10 border border-primary/20 backdrop-blur-md rounded-2xl flex gap-3 shadow-sm items-start">
        <Info className="w-5 h-5 text-primary mt-0.5" />
        <div>
          <h4 className="font-semibold text-primary">Simulation Mode Active</h4>
          <p className="text-sm text-primary/80 mt-1">This dashboard represents the billing integration layer. Since Netflix's open dataset doesn't contain user payment logs, these metrics run on simulated baseline data to demonstrate the structural capabilities of a live Stripe/Chargebee API connection.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* MRR Forecast (Line Chart with dashed projection) */}
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow lg:col-span-2 h-[400px] flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-semibold">Monthly Recurring Revenue (MRR) Forecast</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Historical 5-month performance vs AI-projected Q3 targets ($ Millions).</p>
          <div className="flex-1 min-h-0">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={MOCK_MRR} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                 <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.6 }} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.6 }} tickFormatter={(val) => `$${val}M`} />
                 <RechartsTooltip 
                    cursor={{ stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.2 }} 
                    contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                    formatter={(value: unknown) => [`$${Number(value).toFixed(2)}M`, '']}
                 />
                 <Line type="monotone" dataKey="historical" stroke="#10b981" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                 <Line type="monotone" dataKey="forecast" stroke="#10b981" strokeWidth={4} strokeDasharray="5 5" dot={{ r: 4, strokeWidth: 2 }} />
                 <ReferenceLine x="May" stroke="currentColor" strokeOpacity={0.2} strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: 'currentColor', opacity: 0.5, fontSize: 12 }} />
               </LineChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Plan Tier (Donut) */}
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow h-[400px]">
          <h3 className="text-lg font-semibold mb-2">Revenue by Plan Tier</h3>
          <p className="text-xs text-muted-foreground mb-4">Percentage breakdown of total MRR.</p>
          <div className="h-[300px]">
            <ResponsivePie
              data={MOCK_TIERS}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              innerRadius={0.6}
              padAngle={2}
              cornerRadius={8}
              activeOuterRadiusOffset={8}
              colors={['#6366f1', '#a855f7', '#64748b']}
              borderWidth={0}
              enableArcLinkLabels={false}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor="#ffffff"
              theme={{
                tooltip: {
                  container: {
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--foreground))',
                    fontSize: '12px',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* ARPU Growth (Bar Chart) */}
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow h-[300px] flex flex-col">
          <h3 className="text-lg font-semibold mb-2">ARPU Growth Trajectory</h3>
          <p className="text-xs text-muted-foreground mb-4">Tracking the steady climb of Average Revenue Per User.</p>
          <div className="flex-1 min-h-0">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={MOCK_ARPU} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                 <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.6 }} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.6 }} domain={['dataMin - 1', 'dataMax + 1']} tickFormatter={(val) => `$${val}`} />
                 <RechartsTooltip 
                    cursor={{fill: 'currentColor', opacity: 0.05}} 
                    contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                    formatter={(value: unknown) => [`$${Number(value).toFixed(2)}`, 'ARPU']}
                 />
                 <Bar dataKey="arpu" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={60} />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  )
}
