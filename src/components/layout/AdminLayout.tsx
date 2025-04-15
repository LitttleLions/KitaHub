import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card'; // Assuming Shadcn UI Card is available
import { Home, Building, Briefcase } from 'lucide-react'; // Icons for navigation

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-start gap-4 px-4 py-6">
           <Link
             to="/admin"
             className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
           >
             <Home className="h-4 w-4" />
             Dashboard
           </Link>
           <Link
             to="/admin/kitas"
             className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
           >
             <Building className="h-4 w-4" />
             Kitas / Unternehmen
           </Link>
           <Link
             to="/admin/jobs"
             className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
           >
             <Briefcase className="h-4 w-4" />
             Jobs
           </Link>
           <Link
             to="/admin/import"
             className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
           >
             {/* TODO: Find a suitable icon for Import */}
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload-cloud"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>
             Daten Import
           </Link>
           <Link
             to="/admin/knowledge"
             className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
           >
             {/* Icon: BookOpen */}
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open"><path d="M2 4h6a2 2 0 0 1 2 2v14H4a2 2 0 0 1-2-2z"/><path d="M22 4h-6a2 2 0 0 0-2 2v14h6a2 2 0 0 0 2-2z"/></svg>
             Wissen
           </Link>
           <Link
             to="/admin/knowledge-list"
             className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
           >
             {/* Icon: List */}
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
             Wissens-Beiträge
           </Link>
           {/* Add link for Allgemeine Einstellungen later */}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64 w-full"> {/* Adjust pl based on sidebar width */}
        <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card>
            <CardContent className="p-6">
              <Outlet /> {/* Child routes will render here */}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
