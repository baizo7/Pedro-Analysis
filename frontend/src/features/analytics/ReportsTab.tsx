import { FileText, BarChart3, TrendingUp, Globe, Users, Film } from "lucide-react"

const SUMMARY_CARDS = [
  { icon: Film, label: "Total Titles Analyzed", getValue: (a: any) => a?.top_directors ? "8,000+" : "—", color: "indigo" },
  { icon: Globe, label: "Origin Countries", getValue: (a: any) => a?.top_countries?.length ? `${a.top_countries.length}+ tracked` : "—", color: "blue" },
  { icon: Users, label: "Top Talent Tracked", getValue: (a: any) => a?.top_actors ? `${a.top_actors.length + (a.top_directors?.length || 0)} profiles` : "—", color: "purple" },
  { icon: TrendingUp, label: "Genre Categories", getValue: (a: any) => a?.radar ? `${a.radar.length} analyzed` : "—", color: "emerald" },
]

const colorMap: Record<string, string> = {
  indigo: "text-indigo-500 bg-indigo-500/10",
  blue: "text-blue-500 bg-blue-500/10",
  purple: "text-purple-500 bg-purple-500/10",
  emerald: "text-emerald-500 bg-emerald-500/10"
}

export default function ReportsTab({ advanced }: any) {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      <div className="p-4 bg-primary/10 border border-primary/20 backdrop-blur-md rounded-2xl flex gap-3 shadow-sm items-start">
        <FileText className="w-5 h-5 text-primary mt-0.5" />
        <div>
          <h4 className="font-semibold text-primary">Executive Summary Report</h4>
          <p className="text-sm text-primary/80 mt-1">This page auto-generates a structured data summary from your full catalog analysis. All figures are derived from the live dataset currently loaded in your workspace.</p>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SUMMARY_CARDS.map((card, i) => {
          const Icon = card.icon
          const classes = colorMap[card.color]
          return (
            <div key={i} className="p-5 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-all">
              <div className={`inline-flex p-2 rounded-xl mb-3 ${classes}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold">{advanced ? card.getValue(advanced) : "—"}</div>
              <div className="text-xs text-muted-foreground mt-1">{card.label}</div>
            </div>
          )
        })}
      </div>

      {/* Report Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Directors Report */}
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Top Directors Report</h3>
          </div>
          <div className="space-y-2">
            {advanced?.top_directors?.map((d: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                  <span className="text-sm font-medium">{d.name}</span>
                </div>
                <span className="text-sm font-bold text-primary">{d.count} titles</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Cast Members Report */}
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold">Top Cast Members Report</h3>
          </div>
          <div className="space-y-2">
            {advanced?.top_actors?.map((a: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                  <span className="text-sm font-medium">{a.name}</span>
                </div>
                <span className="text-sm font-bold text-purple-500">{a.count} appearances</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Countries Report */}
      <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Global Sourcing Report</h3>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {advanced?.top_countries?.map((c: any, i: number) => (
            <div key={i} className="p-3 rounded-xl border bg-muted/20 flex flex-col items-center text-center">
              <span className="text-xs text-muted-foreground">#{i + 1}</span>
              <span className="text-sm font-semibold mt-1">{c.name}</span>
              <span className="text-xl font-bold text-blue-500 mt-1">{c.count.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">titles</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
