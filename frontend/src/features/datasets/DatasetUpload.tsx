import { useState, useRef } from "react"
import { UploadCloud, FileType, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

export default function DatasetUpload({ onUploadComplete }: { onUploadComplete?: () => void }) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.name.endsWith(".csv")) {
      setStatus("error")
      setMessage("Please select a valid CSV file.")
      return
    }
    setFile(selectedFile)
    setStatus("idle")
    setMessage("")
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setStatus("idle")
    
    const formData = new FormData()
    formData.append("file", file)

    try {
      await api.post("/datasets/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setStatus("success")
      setMessage("Dataset uploaded successfully! It is now being processed in the background.")
      setFile(null)
      if (onUploadComplete) onUploadComplete()
    } catch (error: any) {
      setStatus("error")
      setMessage(error.response?.data?.detail || "Failed to upload dataset.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div 
        className={cn(
          "relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl transition-colors bg-card",
          dragActive ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleChange}
        />
        
        {file ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <FileType className="h-8 w-8" />
            </div>
            <div>
              <p className="text-lg font-semibold">{file.name}</p>
              <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <div className="flex gap-4 mt-4">
              <Button variant="outline" onClick={() => setFile(null)} disabled={uploading}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload Dataset"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="h-16 w-16 bg-muted text-muted-foreground rounded-full flex items-center justify-center mb-2">
              <UploadCloud className="h-8 w-8" />
            </div>
            <p className="text-lg font-semibold">Drag & drop your dataset here</p>
            <p className="text-sm text-muted-foreground mb-4">Supports CSV files containing streaming titles (Netflix, Disney+, etc.)</p>
            <Button onClick={() => inputRef.current?.click()}>
              Browse Files
            </Button>
          </div>
        )}
      </div>

      {status === "success" && (
        <div className="mt-4 p-4 rounded-lg bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 p-4 rounded-lg bg-destructive/10 text-destructive flex items-center gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}
    </div>
  )
}
