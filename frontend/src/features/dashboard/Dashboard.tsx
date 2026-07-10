import { useEffect, useState } from "react"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { Clapperboard, MonitorPlay, Film } from "lucide-react"
import { api } from "@/lib/api"

interface KPIs {
  total_titles: number
  type_distribution: { name: string, value: number }[]
  yearly_trends: { year: string, count: number }[]
}

const COLORS = ['hsl(243, 75%, 59%)', 'hsl(189, 94%, 43%)', 'hsl(38, 92%, 50%)', 'hsl(340, 82%, 52%)']

export default function Dashboard() {
  const [data, setData] = useState<KPIs | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/analytics/kpis")
        setData(res.data)
      } catch (err) {
        console.error("Failed to load KPIs", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="flex h-full items-center justify-center p-8 text-muted-foreground animate-pulse">Loading analytics...</div>
  }

  if (!data) {
    return <div className="p-8 text-destructive">Failed to load analytics data.</div>
  }

  const moviesCount = data.type_distribution.find(d => d.name === 'Movie')?.value || 0
  const tvCount = data.type_distribution.find(d => d.name === 'TV Show')?.value || 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your streaming media catalog performance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Titles</h3>
            <Film className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{data.total_titles.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Across all datasets</p>
        </div>
        
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">Movies</h3>
            <Clapperboard className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold">{moviesCount.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Feature length films</p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">TV Shows</h3>
            <MonitorPlay className="h-4 w-4 text-secondary" />
          </div>
          <div className="text-2xl font-bold">{tvCount.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Series and episodes</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Bar Chart: Release Trends */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm col-span-4 p-6">
          <div className="mb-4">
            <h3 className="font-semibold leading-none tracking-tight">Release Year Trends</h3>
            <p className="text-sm text-muted-foreground mt-2">Content volume over the last 15 years.</p>
          </div>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.yearly_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted))' }} 
                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} 
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Content Type Distribution */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm col-span-3 p-6 flex flex-col">
          <div className="mb-4">
            <h3 className="font-semibold leading-none tracking-tight">Content Distribution</h3>
            <p className="text-sm text-muted-foreground mt-2">Movies vs TV Shows ratio.</p>
          </div>
          <div className="h-[300px] w-full flex-1 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.type_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.type_distribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} 
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  )
}
