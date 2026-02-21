import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/assets/generated/stethoscope-icon.dim_128x128.png" 
              alt="Clinic" 
              className="h-20 w-20"
            />
          </div>
          <CardTitle className="text-3xl text-medical-800">Mannosalva Clinic App</CardTitle>
          <CardDescription className="text-base">
            Secure patient management system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleLogin}
            disabled={loginStatus === 'logging-in'}
            className="w-full h-12 text-lg"
          >
            {loginStatus === 'logging-in' ? 'Connecting...' : 'Login with Internet Identity'}
          </Button>
          <p className="text-xs text-center text-medical-600">
            Secure authentication powered by Internet Computer
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
