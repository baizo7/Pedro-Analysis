import { useEffect, useState } from "react"
import { Check, CreditCard, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

interface SubStatus {
  tier: string
  is_active: boolean
  features: string[]
}

export default function Billing() {
  const [status, setStatus] = useState<SubStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get("/subscriptions/status")
        setStatus(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
  }, [])

  const handleUpgrade = async (tier: string) => {
    try {
      const res = await api.post(`/subscriptions/checkout?tier=${tier}`)
      // In a real app, this redirects to Stripe Checkout
      window.location.href = res.data.checkout_url
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return <div className="p-8 text-muted-foreground animate-pulse">Loading billing details...</div>
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Billing & Subscriptions</h1>
        <p className="text-muted-foreground mt-2">Manage your workspace plan and unlock powerful AI features.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Free Tier */}
        <div className={`rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col ${status?.tier === 'free' ? 'ring-2 ring-primary' : ''}`}>
          <div className="mb-4">
            <h3 className="text-lg font-bold">Starter</h3>
            <div className="mt-4 flex items-baseline text-3xl font-extrabold">
              $0
              <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Perfect for evaluating the platform.</p>
          </div>
          <ul className="space-y-3 mb-8 flex-1 text-sm">
            <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Up to 5 Datasets</li>
            <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Basic Analytics</li>
            <li className="flex items-center gap-3 opacity-50"><Check className="h-4 w-4" /> No AI Insights</li>
          </ul>
          <Button variant={status?.tier === 'free' ? 'outline' : 'secondary'} disabled={status?.tier === 'free'}>
            {status?.tier === 'free' ? 'Current Plan' : 'Downgrade'}
          </Button>
        </div>

        {/* Pro Tier */}
        <div className={`rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col relative ${status?.tier === 'pro' ? 'ring-2 ring-primary' : ''}`}>
          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
            <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Popular
            </span>
          </div>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">Pro</h3>
            </div>
            <div className="mt-4 flex items-baseline text-3xl font-extrabold">
              $49
              <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">For growing streaming networks.</p>
          </div>
          <ul className="space-y-3 mb-8 flex-1 text-sm">
            <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Unlimited Datasets</li>
            <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> AI Business Insights</li>
            <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> PDF & Excel Exports</li>
          </ul>
          <Button 
            className="w-full" 
            variant={status?.tier === 'pro' ? 'outline' : 'default'}
            onClick={() => handleUpgrade('pro')}
            disabled={status?.tier === 'pro'}
          >
            {status?.tier === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
          </Button>
        </div>

        {/* Enterprise Tier */}
        <div className={`rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col ${status?.tier === 'enterprise' ? 'ring-2 ring-primary' : ''}`}>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-secondary" />
              <h3 className="text-lg font-bold">Enterprise</h3>
            </div>
            <div className="mt-4 flex items-baseline text-3xl font-extrabold">
              $199
              <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Maximum power and ML forecasting.</p>
          </div>
          <ul className="space-y-3 mb-8 flex-1 text-sm">
            <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Everything in Pro</li>
            <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Prophet ML Forecasting</li>
            <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Dedicated Support</li>
          </ul>
          <Button 
            className="w-full" 
            variant={status?.tier === 'enterprise' ? 'outline' : 'default'}
            onClick={() => handleUpgrade('enterprise')}
            disabled={status?.tier === 'enterprise'}
          >
             {status?.tier === 'enterprise' ? 'Current Plan' : 'Contact Sales'}
          </Button>
        </div>
      </div>
      
      <div className="mt-12 p-6 rounded-xl border bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <CreditCard className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="font-semibold">Payment Methods</p>
            <p className="text-sm text-muted-foreground">Manage your credit cards and billing history via Stripe.</p>
          </div>
        </div>
        <Button variant="outline">Manage Billing Portal</Button>
      </div>
    </div>
  )
}
