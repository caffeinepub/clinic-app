import { Link } from '@tanstack/react-router';
import { useGetAllAppointments, useGetAllPatients } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import AppointmentCalendar from '../components/AppointmentCalendar';
import AppointmentList from '../components/AppointmentList';

export default function Appointments() {
  const { data: appointments = [], isLoading } = useGetAllAppointments();
  const { data: patients = [] } = useGetAllPatients();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/generated/calendar-icon.dim_128x128.png" 
            alt="Appointments" 
            className="h-12 w-12"
          />
          <div>
            <h1 className="text-3xl font-bold text-medical-800">Appointments</h1>
            <p className="text-medical-600">Manage patient appointments</p>
          </div>
        </div>
        <Link to="/schedule-appointment">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Schedule Appointment
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-medical-600">Loading appointments...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-medical-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-medical-800">
                <CalendarIcon className="h-5 w-5" />
                Calendar View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AppointmentCalendar appointments={appointments} patients={patients} />
            </CardContent>
          </Card>

          <Card className="border-medical-200">
            <CardHeader>
              <CardTitle className="text-medical-800">Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <AppointmentList appointments={appointments} patients={patients} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
