"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Bell, ChevronDown, DollarSign, LayoutDashboard, Package, Settings, Star, User, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Package, label: "Products", href: "/products" },
  { icon: DollarSign, label: "Sales", href: "/sales" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

const businesses = [
  { id: "1", name: "Business A" },
  { id: "2", name: "Business B" },
  { id: "3", name: "Business C" },
]

export function AppSidebar() {
  const [selectedBusiness, setSelectedBusiness] = useState(businesses[0])
  const pathname = usePathname()
  const [isPremium, setIsPremium] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  const SidebarContent = () => (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">InventoryPro</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {selectedBusiness.name}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {businesses.map((business) => (
              <DropdownMenuItem key={business.id} onClick={() => setSelectedBusiness(business)}>
                {business.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="flex-1">
        <nav className="space-y-1 p-4">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
              <Button variant={pathname === item.href ? "secondary" : "ghost"} className="w-full justify-start">
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4">
        <Separator className="my-4" />
        <Button variant="ghost" className="w-full justify-start">
          <User className="mr-2 h-4 w-4" />
          Profile
        </Button>
        {!isPremium && (
          <div className="mt-4 p-4 bg-primary/10 rounded-lg">
            <h3 className="font-semibold flex items-center">
              <Star className="mr-2 h-4 w-4 text-yellow-400" />
              Upgrade to Premium
            </h3>
            <p className="text-sm mt-2">Get access to advanced features and priority support.</p>
            <Button className="mt-2 w-full" onClick={() => setIsPremium(true)}>
              Upgrade Now
            </Button>
          </div>
        )}
      </div>
    </>
  )

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside className="w-64 bg-background border-r flex flex-col h-screen">
      <SidebarContent />
    </aside>
  )
}

