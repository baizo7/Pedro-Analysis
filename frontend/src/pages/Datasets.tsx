import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Trash2 } from "lucide-react"
import { api } from "@/lib/api"
import DatasetUpload from "@/features/datasets/DatasetUpload"

interface Dataset {
  id: string
  name: string
  status: string
  rows_count: number
  created_at: string
}

export default function Datasets() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDatasets = async () => {
    try {
      const res = await api.get("/datasets")
      setDatasets(res.data)
    } catch (error) {
      console.error("Failed to fetch datasets", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/datasets/${id}`)
      fetchDatasets()
    } catch (error) {
      console.error("Failed to delete dataset", error)
    }
  }

  useEffect(() => {
    fetchDatasets()
    // Simple polling for MVP to update status
    const interval = setInterval(fetchDatasets, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Datasets</h1>
        <p className="text-muted-foreground mt-2">Upload and manage your streaming media catalogs.</p>
      </div>

      <DatasetUpload onUploadComplete={fetchDatasets} />

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Your Datasets</h2>
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Rows</th>
                <th className="px-6 py-3 font-medium">Uploaded</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && datasets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading...</td>
                </tr>
              ) : datasets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No datasets uploaded yet.</td>
                </tr>
              ) : (
                datasets.map((ds) => (
                  <tr key={ds.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{ds.name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                        ${ds.status === 'ready' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                        ${ds.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                        ${ds.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                        ${ds.status === 'pending' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' : ''}
                      `}>
                        {ds.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{ds.rows_count.toLocaleString()}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {format(new Date(ds.created_at), "MMM d, yyyy h:mm a")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(ds.id)}
                        className="text-muted-foreground hover:text-red-600 transition-colors p-2"
                        title="Delete Dataset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
