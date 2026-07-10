import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Database, Sparkles, TrendingUp } from "lucide-react"

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 border-b">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            P
          </div>
          <span className="text-xl font-bold tracking-tight">Pedro Analysis</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link to="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="px-6 py-24 md:py-32 lg:px-8 text-center max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-8">
            AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Streaming Media</span> Analytics
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto mb-10">
            Upload your streaming catalogs (Netflix, Disney+, Hulu). Instantly generate business dashboards, AI insights, forecasting, and automated recommendations.
          </p>
          <div className="flex items-center justify-center gap-x-6">
            <Link to="/register">
              <Button size="lg" className="h-12 px-8 text-base">
                Start for free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="#features" className="text-sm font-semibold leading-6">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-24 sm:py-32 bg-muted/30 border-y">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center mb-16">
              <h2 className="text-base font-semibold leading-7 text-primary">Deploy faster</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to analyze content
              </p>
            </div>
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                    <Database className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                    Data Ingestion
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                    <p className="flex-auto">Drop CSVs and Excel files. Our backend automatically cleans and normalizes your catalog.</p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                    <BarChart3 className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                    Live Dashboards
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                    <p className="flex-auto">Interactive KPIs, geographic heatmaps, and genre trend analysis in real-time.</p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                    <Sparkles className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                    AI Insights
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                    <p className="flex-auto">LLM-powered analysis generates actionable business summaries automatically.</p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                    <TrendingUp className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                    Forecasting
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                    <p className="flex-auto">Predict future releases and content gaps using Prophet forecasting models.</p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-10 text-center border-t text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Pedro Analysis. All rights reserved.
      </footer>
    </div>
  )
}
