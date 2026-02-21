import { Link, useParams, useNavigate } from '@tanstack/react-router';
import { useGetPatient, useGetAppointmentsForPatient, useGetVisitNotes } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Calendar, FileText, User } from 'lucide-react';

export default function PatientDetail() {
  const { recordNumber } = useParams({ from: '/patients/$recordNumber' });
  const navigate = useNavigate();
  const { data: patient, isLoading: patientLoading } = useGetPatient(recordNumber);
  const { data: appointments = [], isLoading: appointmentsLoading } = useGetAppointmentsForPatient(recordNumber);
  const { data: visitNotes = [], isLoading: notesLoading } = useGetVisitNotes(recordNumber);

  if (patientLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-medical-600">Loading patient details...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-medical-600 mb-4">Patient not found</p>
        <Button onClick={() => navigate({ to: '/patients' })}>Back to Patients</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-medical-600" />
              <div>
                <CardTitle className="text-2xl text-medical-800">{patient.name}</CardTitle>
                <p className="text-sm text-medical-600">MRN: {patient.medicalRecordNumber}</p>
              </div>
            </div>
            <Link to="/medical-records/$recordNumber" params={{ recordNumber }}>
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                View Medical Records
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-medical-600">Contact Information:</span>
              <p className="text-medical-800 font-medium">{patient.contactInfo}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-medical-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-medical-800">
              <Calendar className="h-5 w-5" />
              Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointmentsLoading ? (
              <p className="text-medical-600">Loading...</p>
            ) : appointments.length === 0 ? (
              <p className="text-medical-600">No appointments scheduled</p>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div key={apt.id} className="p-3 bg-medical-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-medical-800">{apt.doctorName}</p>
                      <Badge variant="outline">{apt.appointmentType}</Badge>
                    </div>
                    <p className="text-sm text-medical-600">
                      {new Date(Number(apt.appointmentTime) / 1000000).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-medical-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-medical-800">
              <FileText className="h-5 w-5" />
              Recent Visit Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notesLoading ? (
              <p className="text-medical-600">Loading...</p>
            ) : visitNotes.length === 0 ? (
              <p className="text-medical-600">No visit notes recorded</p>
            ) : (
              <div className="space-y-3">
                {visitNotes.slice(0, 3).map((note, index) => (
                  <div key={index} className="p-3 bg-medical-50 rounded-lg">
                    <p className="text-sm font-medium text-medical-800 mb-1">{note.diagnosis}</p>
                    <p className="text-xs text-medical-600">
                      {new Date(Number(note.visitTime) / 1000000).toLocaleDateString()}
                    </p>
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
