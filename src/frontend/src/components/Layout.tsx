import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Users, Calendar, FileText, LayoutDashboard, LogOut } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100">
      <header className="bg-white border-b border-medical-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/assets/generated/stethoscope-icon.dim_128x128.png" 
                alt="Clinic" 
                className="h-10 w-10"
              />
              <h1 className="text-2xl font-bold text-medical-800">Mannosalva Clinic App</h1>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 text-medical-700 hover:text-medical-900 transition-colors"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link 
                to="/patients" 
                className="flex items-center gap-2 text-medical-700 hover:text-medical-900 transition-colors"
              >
                <Users className="h-5 w-5" />
                <span className="font-medium">Patients</span>
              </Link>
              <Link 
                to="/appointments" 
                className="flex items-center gap-2 text-medical-700 hover:text-medical-900 transition-colors"
              >
                <Calendar className="h-5 w-5" />
                <span className="font-medium">Appointments</span>
              </Link>
            </nav>

            {identity && (
              <Button 
                onClick={handleLogout} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-medical-200 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-medical-600">
            <p>© {new Date().getFullYear()} Mannosalva Clinic App. Built with ❤️ using{' '}
              <a 
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-medical-700 hover:text-medical-900 font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
