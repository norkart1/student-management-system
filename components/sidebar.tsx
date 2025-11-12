"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { clearAuthToken } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Students", href: "/dashboard/students", icon: "👨‍🎓" },
  { name: "Teachers", href: "/dashboard/teachers", icon: "👨‍🏫" },
  { name: "Books", href: "/dashboard/books", icon: "📖" },
  { name: "Leave Records", href: "/dashboard/leaves", icon: "📅" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    clearAuthToken()
    router.push("/login")
  }

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex flex-col h-screen">
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center text-lg">📚</div>
            {!collapsed && (
              <div>
                <h1 className="font-bold text-sidebar-foreground">SMS</h1>
                <p className="text-xs text-sidebar-foreground/60">Management</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                pathname === item.href
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
              title={collapsed ? item.name : ""}
            >
              <span className="text-xl">{item.icon}</span>
              {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-transparent"
            onClick={() => setCollapsed(!collapsed)}
            title="Toggle sidebar"
          >
            {collapsed ? "→" : "←"}
          </Button>
          <Button variant="destructive" size="sm" className="w-full" onClick={handleLogout}>
            {collapsed ? "🚪" : "Logout"}
          </Button>
        </div>
      </div>
    </aside>
  )
}
