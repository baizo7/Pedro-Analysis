import { useState } from "react"
import { FileText, FileSpreadsheet, Download, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Reports() {
  const [downloading, setDownloading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async (type: "pdf" | "excel") => {
    setDownloading(type)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/v1/reports/export/${type}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (!response.ok) {
        throw new Error("Failed to generate report")
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Pedro_Analysis_Report.${type === "excel" ? "xlsx" : "pdf"}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Exports</h1>
        <p className="text-muted-foreground mt-2">Generate downloadable executive summaries and raw data dumps.</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* PDF Report Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col items-center p-8 text-center">
          <div className="h-16 w-16 bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold mb-2">Executive PDF Report</h3>
          <p className="text-sm text-muted-foreground mb-6 flex-1">
            A highly-formatted C-Level PDF summary containing total catalog metrics and insights.
          </p>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => handleDownload("pdf")}
            disabled={downloading !== null}
          >
            {downloading === "pdf" ? "Generating..." : (
              <><Download className="h-4 w-4 mr-2" /> Download PDF</>
            )}
          </Button>
        </div>

        {/* Excel Report Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col items-center p-8 text-center">
          <div className="h-16 w-16 bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
            <FileSpreadsheet className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold mb-2">Data Dump (Excel)</h3>
          <p className="text-sm text-muted-foreground mb-6 flex-1">
            Raw CSV/Excel export of your normalized database, perfect for further offline analysis in BI tools.
          </p>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => handleDownload("excel")}
            disabled={downloading !== null}
          >
            {downloading === "excel" ? "Generating..." : (
              <><Download className="h-4 w-4 mr-2" /> Download Excel</>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
