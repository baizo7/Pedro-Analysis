import { ShieldCheck, CheckCircle, AlertTriangle, XCircle } from "lucide-react"

export default function DataQualityTab({ advanced }: any) {
  if (!advanced) return null

  // Compute data quality metrics from advanced payload
  const totalDirectors = advanced.top_directors?.length || 0
  const totalActors = advanced.top_actors?.length || 0
  const totalCountries = advanced.top_countries?.length || 0
  const totalGenres = advanced.radar?.length || 0
  const totalRatings = advanced.ratings?.length || 0
  const scatterPoints = advanced.scatter?.length || 0

  const checks = [
    {
      name: "Director Data Completeness",
      status: totalDirectors >= 10 ? "pass" : "warn",
      detail: `${totalDirectors} unique directors found across top 10 catalog entries.`,
    },
    {
      name: "Cast Member Records",
      status: totalActors >= 10 ? "pass" : "warn",
      detail: `${totalActors} unique cast members profiled in top 10.`,
    },
    {
      name: "Country Attribution",
      status: totalCountries >= 8 ? "pass" : "warn",
      detail: `${totalCountries} origin countries identified.`,
    },
    {
      name: "Genre Taxonomy Coverage",
      status: totalGenres >= 5 ? "pass" : "fail",
      detail: `${totalGenres} unique genre categories in the taxonomy.`,
    },
    {
      name: "Age Rating Classification",
      status: totalRatings >= 4 ? "pass" : "warn",
      detail: `${totalRatings} distinct rating classifications found.`,
    },
    {
      name: "Movie Duration Records",
      status: scatterPoints >= 50 ? "pass" : "warn",
      detail: `${scatterPoints} movie runtime records successfully parsed.`,
    },
    {
      name: "Time Series Completeness",
      status: advanced.time_series?.length >= 10 ? "pass" : "fail",
      detail: `${advanced.time_series?.length || 0} years of historical release data available.`,
    },
    {
      name: "Runtime Distribution Buckets",
      status: advanced.runtime_dist?.filter((d: any) => d.count > 0).length >= 5 ? "pass" : "warn",
      detail: `${advanced.runtime_dist?.filter((d: any) => d.count > 0).length || 0} of 11 duration buckets populated.`,
    },
  ]

  const passed = checks.filter(c => c.status === "pass").length
  const warned = checks.filter(c => c.status === "warn").length
  const failed = checks.filter(c => c.status === "fail").length
  const score = Math.round((passed / checks.length) * 100)

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* Overall Score */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="sm:col-span-1 p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm flex flex-col items-center justify-center text-center">
          <div className={`text-5xl font-black mb-2 ${score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>{score}%</div>
          <div className="text-sm font-semibold">Data Quality Score</div>
          <div className="text-xs text-muted-foreground mt-1">Based on {checks.length} automated checks</div>
        </div>
        <div className="p-5 rounded-2xl border bg-emerald-500/10 border-emerald-500/20 flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
          <div className="text-3xl font-bold text-emerald-500">{passed}</div>
          <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Checks Passed</div>
        </div>
        <div className="p-5 rounded-2xl border bg-amber-500/10 border-amber-500/20 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
          <div className="text-3xl font-bold text-amber-500">{warned}</div>
          <div className="text-sm font-medium text-amber-600 dark:text-amber-400">Warnings</div>
        </div>
        <div className="p-5 rounded-2xl border bg-rose-500/10 border-rose-500/20 flex flex-col items-center justify-center text-center">
          <XCircle className="w-8 h-8 text-rose-500 mb-2" />
          <div className="text-3xl font-bold text-rose-500">{failed}</div>
          <div className="text-sm font-medium text-rose-600 dark:text-rose-400">Failed Checks</div>
        </div>
      </div>

      {/* Check List */}
      <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Automated Data Quality Checks</h3>
        </div>
        <div className="space-y-3">
          {checks.map((check, i) => {
            const statusConfig = ({
              pass: { icon: CheckCircle, classes: "text-emerald-500", label: "PASS", bg: "bg-emerald-500/10" },
              warn: { icon: AlertTriangle, classes: "text-amber-500", label: "WARN", bg: "bg-amber-500/10" },
              fail: { icon: XCircle, classes: "text-rose-500", label: "FAIL", bg: "bg-rose-500/10" }
            } as const)[check.status as "pass" | "warn" | "fail"]!
            const StatusIcon = statusConfig.icon
            return (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className={`p-2 rounded-lg ${statusConfig.bg}`}>
                  <StatusIcon className={`w-4 h-4 ${statusConfig.classes}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{check.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{check.detail}</div>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusConfig.bg} ${statusConfig.classes}`}>
                  {statusConfig.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
