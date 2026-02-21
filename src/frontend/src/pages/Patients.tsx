import { Link } from '@tanstack/react-router';
import { useGetAllPatients } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Plus, Search, User } from 'lucide-react';
import { useState } from 'react';

export default function Patients() {
  const { data: patients = [], isLoading } = useGetAllPatients();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.medicalRecordNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/generated/patient-icon.dim_128x128.png" 
            alt="Patients" 
            className="h-12 w-12"
          />
          <div>
            <h1 className="text-3xl font-bold text-medical-800">Patients</h1>
            <p className="text-medical-600">Manage patient records</p>
          </div>
        </div>
        <Link to="/register-patient">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Register Patient
          </Button>
        </Link>
      </div>

      <Card className="border-medical-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-medical-600" />
            <Input
              placeholder="Search by name or record number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-medical-600">Loading patients...</p>
        </div>
      ) : filteredPatients.length === 0 ? (
        <Card className="border-medical-200">
          <CardContent className="py-12 text-center">
            <User className="h-12 w-12 text-medical-400 mx-auto mb-4" />
            <p className="text-medical-600 mb-4">
              {searchTerm ? 'No patients found matching your search' : 'No patients registered yet'}
            </p>
            {!searchTerm && (
              <Link to="/register-patient">
                <Button>Register First Patient</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <Link
              key={patient.medicalRecordNumber}
              to="/patients/$recordNumber"
              params={{ recordNumber: patient.medicalRecordNumber }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-medical-200 h-full">
                <CardHeader>
                  <CardTitle className="text-medical-800 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {patient.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-medical-600">Record #:</span>
                      <span className="ml-2 font-medium text-medical-800">
                        {patient.medicalRecordNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-medical-600">Contact:</span>
                      <span className="ml-2 text-medical-800">{patient.contactInfo}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
