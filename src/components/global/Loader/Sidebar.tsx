"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  ChevronDown,
  DollarSign,
  LayoutDashboard,
  Package,
  Settings,
  Star,
  User,
  Menu,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useGetAllBusiness } from "@/utils/queries";
import { UserButton } from "@clerk/nextjs";

// Modified sidebar items without href to build them dynamically
const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "" },
  { icon: Package, label: "Products", path: "products" },
  { icon: DollarSign, label: "Sales", path: "sales" },
  { icon: FileText, label: "Create Bill", path: "create-bill" },
  { icon: Bell, label: "Notifications", path: "notifications" },
  { icon: Settings, label: "Settings", path: "settings" },
];

export function AppSidebar({ businessId }: { businessId: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const { data } = useGetAllBusiness();
  const { data: user } = data as {
    status: number;
    data: {
      business: {
        id: string;
        name: string;
        image: string | null;
      }[];
    } & {
      id: string;
      clerkId: string;
      email: string;
      premium: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  };
  const businesses = user?.business;
  const currentBusiness = businesses.find((b) => b.id === businessId);
  const [selectedBusiness, setSelectedBusiness] = useState<{
    id: string;
    image: string | null;
    name: string;
  }>(currentBusiness!);

  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Check if a menu item is active
  const isItemActive = (path: string) => {
    if (path === "" && pathname === `/${businessId}`) {
      return true;
    }
    return pathname === `/${businessId}/${path}`;
  };

  const SidebarContent = () => (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Inventix</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {selectedBusiness.name}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {businesses.map((business) => (
              <DropdownMenuItem
                key={business.id}
                onClick={() => {
                  router.push(`/${business.id}`);
                  setSelectedBusiness(business);
                }}
              >
                {business.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="flex-1">
        <nav className="space-y-1 p-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              href={`/dashboard/${businessId}/${item.path.trim()}`}
              onClick={() => setIsOpen(false)}
            >
              <Button
                variant={isItemActive(item.path) ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
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
          <UserButton />
          Profile
        </Button>
        {/* {!user.premium && (
          <div className="mt-4 p-4 bg-primary/10 rounded-lg">
            <h3 className="font-semibold flex items-center">
              <Star className="mr-2 h-4 w-4 text-yellow-400" />
              Upgrade to Premium
            </h3>
            <p className="text-sm mt-2">
              Get access to advanced features and priority support.
            </p>
            <Button
              className="mt-2 w-full"
              onClick={() => console.log("feature not added")}
            >
              Upgrade Now
            </Button>
          </div>
        )} */}
      </div>
    </>
  );

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
    );
  }

  return (
    <aside className="w-64 bg-background border-r flex flex-col h-screen">
      <SidebarContent />
    </aside>
  );
}
