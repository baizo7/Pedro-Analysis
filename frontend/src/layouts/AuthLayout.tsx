import { Outlet } from "react-router-dom"

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <Outlet />
        </div>
      </div>
      <div className="hidden md:flex flex-col items-center justify-center bg-primary p-12 text-primary-foreground">
        <div className="max-w-lg space-y-6 text-center">
          <h1 className="text-4xl font-bold">Pedro Analysis</h1>
          <p className="text-lg opacity-90">
            AI-Powered Streaming Media Analytics Platform for Enterprise.
          </p>
        </div>
      </div>
    </div>
  )
}
