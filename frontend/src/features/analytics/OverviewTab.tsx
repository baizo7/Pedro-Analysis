import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from "recharts"
import { Globe, Clock, TrendingUp, MonitorPlay } from "lucide-react"

const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444', '#10b981']

export default function OverviewTab({ data, advanced, genres }: any) {
  if (!data || !advanced) return null

  return (
    <div className="space-y-6">
      {/* Top Row: KPIs with Premium Micro-animations */}
      <div className="grid gap-6 md:grid-cols-4">
        
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <MonitorPlay className="w-24 h-24 text-primary" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <MonitorPlay className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Total Titles</h3>
          </div>
          <div className="text-4xl font-bold text-foreground">
            {data.total_titles.toLocaleString()}
          </div>
        </div>

        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Globe className="w-24 h-24 text-secondary" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Globe className="w-4 h-4 text-secondary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Global Markets</h3>
          </div>
          <div className="text-4xl font-bold text-foreground">
            {data.global_markets?.toLocaleString() || 0}
          </div>
        </div>

        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Clock className="w-24 h-24 text-accent" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Clock className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Avg Runtime</h3>
          </div>
          <div className="text-4xl font-bold text-foreground">
            {data.avg_runtime || 0} <span className="text-xl text-muted-foreground font-normal">min</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="w-24 h-24 text-emerald-500" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">YoY Growth</h3>
          </div>
          <div className="text-4xl font-bold text-foreground">
            +{data.yoy_growth || 0}%
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cumulative Growth (Area Chart) */}
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-6">Cumulative Content Growth</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={advanced.time_series} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.5 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.5 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="cumulative" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCum)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Yearly Releases by Type (Stacked Bar) */}
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-6">Releases by Content Type</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={advanced.time_series} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.5 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.5 }} />
                <Tooltip cursor={{fill: 'currentColor', opacity: 0.05}} contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="Movie" stackId="a" fill="#ec4899" radius={[0, 0, 4, 4]} />
                <Bar dataKey="TV Show" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Rating Distribution (Donut) */}
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm lg:col-span-1 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-6">Age Ratings</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={advanced.ratings}
                  cx="50%" cy="50%"
                  innerRadius={80} outerRadius={110}
                  paddingAngle={3} dataKey="value"
                  stroke="none"
                >
                  {advanced.ratings.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Categories (Horizontal Bar) */}
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm lg:col-span-2 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-6">Top Performing Categories</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genres} layout="vertical" margin={{ top: 0, right: 20, left: 80, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="currentColor" className="opacity-10" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.5 }} />
                <YAxis dataKey="genre" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.8, fill: "currentColor" }} />
                <Tooltip cursor={{fill: 'currentColor', opacity: 0.05}} contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#14b8a6" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
