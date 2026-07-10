import { Bell, Search, User } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { Button } from "./ui/button"

export default function Header() {
  const { user, logout } = useAuthStore()

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-foreground placeholder:text-muted-foreground focus:ring-0 sm:text-sm"
            placeholder="Search datasets, insights, or reports... (Command + K)"
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />

          {/* Profile dropdown (Simplified for now) */}
          <div className="flex items-center gap-x-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden lg:flex lg:flex-col text-sm font-medium leading-6 text-foreground">
                <span aria-hidden="true">{user?.first_name} {user?.last_name}</span>
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground text-xs">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
