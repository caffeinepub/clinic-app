import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useRegisterPatient } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function RegisterPatient() {
  const navigate = useNavigate();
  const registerPatient = useRegisterPatient();
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
    medicalRecordNumber: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerPatient.mutateAsync(formData);
      navigate({ to: '/patients' });
    } catch (error) {
      console.error('Failed to register patient:', error);
    }
  };

  const generateRecordNumber = () => {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setFormData({ ...formData, medicalRecordNumber: `MRN${timestamp}${random}` });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/patients' })}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Patients
      </Button>

      <Card className="border-medical-200">
        <CardHeader>
          <CardTitle className="text-2xl text-medical-800">Register New Patient</CardTitle>
          <CardDescription>Enter patient information to create a new medical record</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter patient's full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo">Contact Information *</Label>
              <Input
                id="contactInfo"
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                placeholder="Phone number or email (min 10 characters)"
                required
                minLength={10}
              />
              <p className="text-xs text-medical-600">
                Enter phone number or email address
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalRecordNumber">Medical Record Number *</Label>
              <div className="flex gap-2">
                <Input
                  id="medicalRecordNumber"
                  value={formData.medicalRecordNumber}
                  onChange={(e) => setFormData({ ...formData, medicalRecordNumber: e.target.value })}
                  placeholder="Enter or generate record number"
                  required
                />
                <Button type="button" variant="outline" onClick={generateRecordNumber}>
                  Generate
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/patients' })}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={registerPatient.isPending} className="flex-1">
                {registerPatient.isPending ? 'Registering...' : 'Register Patient'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
