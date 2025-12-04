import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  UserCheck, 
  ClipboardCheck, 
  BookOpen,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/', label: 'Editorial Worklist', icon: FileText },
  { path: '/editor-assignment', label: 'Editor Assignment', icon: Users },
  { path: '/ee-workspace', label: 'EE Workspace', icon: UserCheck },
  { path: '/manuscript-review', label: 'Manuscript Review', icon: BookOpen },
  { path: '/post-ee-worklist', label: 'Post-EE Worklist', icon: ClipboardCheck },
  { path: '/peer-reviewer-assignment', label: 'Reviewer Assignment', icon: Users },
];

function SidebarContent({ collapsed = false, onItemClick }: { collapsed?: boolean; onItemClick?: () => void }) {
  const location = useLocation();

  return (
    <>
      <div className={cn("p-4 border-b border-sidebar-border", collapsed && "px-2")}>
        {collapsed ? (
          <div className="flex items-center justify-center">
            <span className="text-lg font-bold text-sidebar-foreground">SF</span>
          </div>
        ) : (
          <>
            <h1 className="text-lg font-bold text-sidebar-foreground">ScholarFlow</h1>
            <p className="text-xs text-sidebar-foreground/60">Manuscript Management</p>
          </>
        )}
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onItemClick}
              className={cn(
                'nav-link',
                isActive ? 'nav-link-active' : 'nav-link-inactive',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </>
              )}
            </Link>
          );
        })}
      </nav>
      <div className={cn("p-4 border-t border-sidebar-border", collapsed && "px-2")}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground text-sm font-medium shrink-0">
            EA
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">Editorial Assistant</p>
              <p className="text-xs text-sidebar-foreground/60">Office Staff</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex w-full">
      {/* Mobile Sidebar (Sheet) */}
      {isMobile && (
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border">
            <SidebarContent onItemClick={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside 
          className={cn(
            "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
            collapsed ? "w-16" : "w-64"
          )}
        >
          <SidebarContent collapsed={collapsed} />
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with toggle */}
        <header className="h-12 border-b border-border flex items-center px-4 bg-background shrink-0">
          {isMobile ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <PanelLeft className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
