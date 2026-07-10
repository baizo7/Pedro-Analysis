import { useEffect, useState } from "react"
import { Sparkles, TrendingUp, AlertCircle } from "lucide-react"
import { api } from "@/lib/api"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"


import AIChatBox from "@/features/ai/AIChatBox"

interface ForecastData {
  year: string
  predicted_count: number
}

export default function Insights() {
  const [insights, setInsights] = useState<string[]>([])
  const [forecast, setForecast] = useState<ForecastData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [filterType, setFilterType] = useState<string>("All")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = filterType !== "All" ? `?type=${filterType}` : ""
        const [insightsRes, forecastRes] = await Promise.all([
          api.get("/ai/insights"),
          api.get(`/ai/forecast${query}`)
        ])
        setInsights(insightsRes.data.insights || [])
        setForecast(forecastRes.data.forecast || [])
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to load AI data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [filterType])

  if (loading) {
    return <div className="p-8 text-muted-foreground animate-pulse">Generating AI insights...</div>
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-destructive/10 text-destructive flex items-center gap-3">
        <AlertCircle className="h-5 w-5" />
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Insights & Forecasting</h1>
        <p className="text-muted-foreground mt-2">Automated business intelligence powered by LLMs and Machine Learning.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* LLM Insights Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Sparkles className="h-24 w-24 text-primary" />
          </div>
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-primary" />
            <h3 className="font-semibold text-xl tracking-tight">Executive Summary</h3>
          </div>
          <ul className="space-y-4 relative z-10">
            {insights.length === 0 && <p className="text-muted-foreground">No insights available. Upload a dataset first.</p>}
            {insights.map((insight, idx) => (
              <li key={idx} className="flex gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
                  {idx + 1}
                </div>
                <p className="text-base leading-relaxed">{insight}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Prophet Forecasting Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-secondary" />
              <h3 className="font-semibold text-xl tracking-tight">5-Year Release Forecast</h3>
            </div>
            
            <div className="flex bg-muted rounded-lg p-1">
              <button 
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${filterType === 'All' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setFilterType('All')}
              >
                All
              </button>
              <button 
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${filterType === 'Movie' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setFilterType('Movie')}
              >
                Movies
              </button>
              <button 
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${filterType === 'TV Show' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setFilterType('TV Show')}
              >
                TV Shows
              </button>
            </div>
          </div>
          {forecast.length === 0 ? (
            <p className="text-muted-foreground">Not enough historical data to generate a forecast.</p>
          ) : (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "currentColor", opacity: 0.5 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "currentColor", opacity: 0.5 }} />
                  <Tooltip 
                    cursor={{ fill: 'currentColor', opacity: 0.05 }} 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} 
                  />
                  <Bar dataKey="predicted_count" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Predictions generated using Facebook Prophet time-series models.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <AIChatBox />
      </div>
    </div>
  )
}
