import { useEffect, useState, useRef } from "react"
import { api } from "@/lib/api"
import { 
  Download, LayoutDashboard, Film, Users, Globe, Clapperboard, 
  Clock, LineChart, BrainCircuit, FileText, ShieldCheck 
} from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import OverviewTab from "@/features/analytics/OverviewTab"
import ContentLibraryTab from "@/features/analytics/ContentLibraryTab"
import AudienceRetentionTab from "@/features/analytics/AudienceRetentionTab"
import GeographicalTab from "@/features/analytics/GeographicalTab"
import BusinessIntelligenceTab from "@/features/analytics/BusinessIntelligenceTab"
import QualityMetricsTab from "@/features/analytics/QualityMetricsTab"
import FinancialAnalyticsTab from "@/features/analytics/FinancialAnalyticsTab"
import AIInsightsTab from "@/features/analytics/AIInsightsTab"
import ReportsTab from "@/features/analytics/ReportsTab"
import DataQualityTab from "@/features/analytics/DataQualityTab"

const TABS = [
  { id: "executive", label: "Executive Overview", icon: LayoutDashboard },
  { id: "content", label: "Content Intelligence", icon: Film },
  { id: "audience", label: "Audience Intelligence", icon: Users },
  { id: "geo", label: "Geographic Intelligence", icon: Globe },
  { id: "bi", label: "Business Intelligence", icon: Clapperboard },
  { id: "quality", label: "Quality Metrics", icon: Clock },
  { id: "financial", label: "Financial Analytics", icon: LineChart },
  { id: "ai", label: "AI Insights", icon: BrainCircuit },
  { id: "reports", label: "Reports & Export", icon: FileText },
  { id: "data", label: "Data Quality", icon: ShieldCheck }
]

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("executive")
  const [data, setData] = useState<any>(null)
  const [advanced, setAdvanced] = useState<any>(null)
  const [genres, setGenres] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [filterType, setFilterType] = useState<string>("All")
  const [filterCountry, setFilterCountry] = useState<string>("All")
  const [filterYear, setFilterYear] = useState<string>("")
  const [exporting, setExporting] = useState(false)
  const dashboardRef = useRef<HTMLDivElement>(null)

  const handleExport = async () => {
    if (!dashboardRef.current) return
    setExporting(true)
    try {
      const canvas = await html2canvas(dashboardRef.current, { scale: 2 })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 10, imgWidth, imgHeight)
      pdf.save('Pedro-Analysis-Executive-Overview.pdf')
    } catch (error) {
      console.error("Export failed", error)
    } finally {
      setExporting(false)
    }
  }

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams()
      if (filterType !== "All") query.append("type", filterType)
      if (filterCountry !== "All") query.append("country", filterCountry)
      if (filterYear) query.append("start_year", filterYear)

      const [kpiRes, genreRes, advRes] = await Promise.all([
        api.get(`/analytics/kpis?${query.toString()}`),
        api.get(`/analytics/genres?${query.toString()}`),
        api.get(`/analytics/advanced?${query.toString()}`)
      ])
      
      setData(kpiRes.data)
      setGenres(genreRes.data.genres)
      setAdvanced(advRes.data)
    } catch (error) {
      console.error("Failed to fetch analytics", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [filterType, filterCountry, filterYear])

  if (loading) {
    return <div className="text-muted-foreground animate-pulse p-8">Loading advanced BI dashboard...</div>
  }

  if (!data || data.total_titles === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Business Intelligence</h1>
        <div className="p-12 text-center border border-dashed rounded-lg bg-card text-muted-foreground">
          No data available. Please upload a dataset to enable advanced analytics.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Business Intelligence</h1>
          <p className="text-muted-foreground mt-2">Enterprise analytics suite for your streaming catalog.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium shadow-sm hover:bg-secondary/80 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {exporting ? "Generating PDF..." : "Export PDF"}
          </button>
        </div>
      </div>

      {/* Global Filters */}
      <div className="flex flex-wrap gap-4 items-center bg-card/50 p-2 rounded-xl border backdrop-blur-sm shadow-sm">
        <select 
          className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer"
          value={filterType} onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All">All Formats</option>
          <option value="Movie">Movies</option>
          <option value="TV Show">TV Shows</option>
        </select>
        <div className="h-4 w-px bg-border"></div>
        <select 
          className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer"
          value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)}
        >
          <option value="All">Global Market</option>
          <option value="United States">United States</option>
          <option value="India">India</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="South Korea">South Korea</option>
        </select>
        <div className="h-4 w-px bg-border"></div>
        <select 
          className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer"
          value={filterYear} onChange={(e) => setFilterYear(e.target.value)}
        >
          <option value="">All Time</option>
          <option value="2020">Since 2020</option>
          <option value="2015">Since 2015</option>
          <option value="2010">Since 2010</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="border-b flex gap-4 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-muted">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 text-sm font-medium transition-colors flex gap-2 items-center border-b-2 whitespace-nowrap ${isActive ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'}`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content Printable Area */}
      <div ref={dashboardRef} className="bg-background pt-2">
        {activeTab === 'executive' && <OverviewTab data={data} advanced={advanced} genres={genres} />}
        {activeTab === 'content' && <ContentLibraryTab advanced={advanced} />}
        {activeTab === 'audience' && <AudienceRetentionTab />}
        {activeTab === 'geo' && <GeographicalTab advanced={advanced} />}
        {activeTab === 'bi' && <BusinessIntelligenceTab />}
        {activeTab === 'quality' && <QualityMetricsTab advanced={advanced} />}
        {activeTab === 'financial' && <FinancialAnalyticsTab />}
        {activeTab === 'ai' && <AIInsightsTab />}
        {activeTab === 'reports' && <ReportsTab advanced={advanced} />}
        {activeTab === 'data' && <DataQualityTab advanced={advanced} />}
        {activeTab !== 'executive' && activeTab !== 'content' && activeTab !== 'audience' && activeTab !== 'geo' && activeTab !== 'bi' && activeTab !== 'quality' && activeTab !== 'financial' && activeTab !== 'ai' && activeTab !== 'reports' && activeTab !== 'data' && (
          <div className="h-[400px] flex flex-col items-center justify-center border border-dashed rounded-xl bg-card/20 text-muted-foreground">
            <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon: {TABS.find(t => t.id === activeTab)?.label}</h3>
            <p className="text-sm">This intelligence vertical is queued for the next development iteration.</p>
          </div>
        )}
      </div>

    </div>
  )
}
