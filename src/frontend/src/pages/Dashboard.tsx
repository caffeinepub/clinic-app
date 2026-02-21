import { Link } from '@tanstack/react-router';
import { useGetAllPatients, useGetAllAppointments } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Users, Calendar, FileText, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Dashboard() {
  const { data: patients = [], isLoading: patientsLoading } = useGetAllPatients();
  const { data: appointments = [], isLoading: appointmentsLoading } = useGetAllAppointments();

  const upcomingAppointments = appointments.filter(
    (apt) => Number(apt.appointmentTime) > Date.now() * 1000000
  ).slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-medical-800 mb-2">Dashboard</h1>
        <p className="text-medical-600">Welcome to your clinic management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-medical-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-medical-700">Total Patients</CardTitle>
            <img 
              src="/assets/generated/patient-icon.dim_128x128.png" 
              alt="Patients" 
              className="h-8 w-8 opacity-80"
            />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-medical-800">
              {patientsLoading ? '...' : patients.length}
            </div>
            <p className="text-xs text-medical-600 mt-1">Registered patients</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-medical-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-medical-700">Appointments</CardTitle>
            <img 
              src="/assets/generated/calendar-icon.dim_128x128.png" 
              alt="Appointments" 
              className="h-8 w-8 opacity-80"
            />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-medical-800">
              {appointmentsLoading ? '...' : upcomingAppointments.length}
            </div>
            <p className="text-xs text-medical-600 mt-1">Upcoming appointments</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-medical-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-medical-700">Medical Records</CardTitle>
            <img 
              src="/assets/generated/records-icon.dim_128x128.png" 
              alt="Records" 
              className="h-8 w-8 opacity-80"
            />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-medical-800">{patients.length}</div>
            <p className="text-xs text-medical-600 mt-1">Patient records</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-medical-200">
          <CardHeader>
            <CardTitle className="text-medical-800">Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/register-patient">
              <Button className="w-full justify-between" variant="outline">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Register New Patient
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/schedule-appointment">
              <Button className="w-full justify-between" variant="outline">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Appointment
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/add-visit-note">
              <Button className="w-full justify-between" variant="outline">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Add Visit Note
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-medical-200">
          <CardHeader>
            <CardTitle className="text-medical-800">Upcoming Appointments</CardTitle>
            <CardDescription>Next scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {appointmentsLoading ? (
              <p className="text-medical-600">Loading...</p>
            ) : upcomingAppointments.length === 0 ? (
              <p className="text-medical-600">No upcoming appointments</p>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 bg-medical-50 rounded-lg">
                    <div>
                      <p className="font-medium text-medical-800">{apt.doctorName}</p>
                      <p className="text-sm text-medical-600">
                        {new Date(Number(apt.appointmentTime) / 1000000).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-medical-200 text-medical-800 rounded-full">
                      {apt.appointmentType}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
