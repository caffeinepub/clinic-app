import { useCancelAppointment } from '../hooks/useQueries';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, User, X } from 'lucide-react';
import type { Appointment, Patient } from '../backend';

interface AppointmentListProps {
  appointments: Appointment[];
  patients: Patient[];
}

export default function AppointmentList({ appointments, patients }: AppointmentListProps) {
  const cancelAppointment = useCancelAppointment();

  const upcomingAppointments = appointments
    .filter((apt) => Number(apt.appointmentTime) > Date.now() * 1000000)
    .sort((a, b) => Number(a.appointmentTime - b.appointmentTime));

  const getPatientName = (recordNumber: string) => {
    const patient = patients.find((p) => p.medicalRecordNumber === recordNumber);
    return patient?.name || 'Unknown Patient';
  };

  const handleCancel = async (appointmentId: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      await cancelAppointment.mutateAsync(appointmentId);
    }
  };

  if (upcomingAppointments.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-medical-400 mx-auto mb-3" />
        <p className="text-medical-600">No upcoming appointments</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto">
      {upcomingAppointments.map((apt) => {
        const date = new Date(Number(apt.appointmentTime) / 1000000);
        return (
          <div
            key={apt.id}
            className="p-4 bg-medical-50 rounded-lg border border-medical-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-medical-600" />
                <span className="font-medium text-medical-800">
                  {getPatientName(apt.patientRecordNumber)}
                </span>
              </div>
              <Badge variant="outline">{apt.appointmentType}</Badge>
            </div>

            <div className="space-y-2 text-sm text-medical-700">
              <div className="flex items-center gap-2">
                <User className="h-3 w-3" />
                <span>Dr. {apt.doctorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>{date.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            <Button
              variant="destructive"
              size="sm"
              className="w-full mt-3"
              onClick={() => handleCancel(apt.id)}
              disabled={cancelAppointment.isPending}
            >
              <X className="h-3 w-3 mr-1" />
              Cancel Appointment
            </Button>
          </div>
        );
      })}
    </div>
  );
}
