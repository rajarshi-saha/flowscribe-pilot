import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  UserCheck, 
  ClipboardCheck, 
  BookOpen,
  ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <h1 className="text-lg font-bold text-sidebar-foreground">ScholarFlow</h1>
          <p className="text-xs text-sidebar-foreground/60">Manuscript Management</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'nav-link',
                  isActive ? 'nav-link-active' : 'nav-link-inactive'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="h-4 w-4" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground text-sm font-medium">
              EA
            </div>
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">Editorial Assistant</p>
              <p className="text-xs text-sidebar-foreground/60">Office Staff</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
