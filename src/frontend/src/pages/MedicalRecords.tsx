import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { useGetPatient, useGetVisitNotes } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Plus } from 'lucide-react';
import VisitNoteCard from '../components/VisitNoteCard';

export default function MedicalRecords() {
  const { recordNumber } = useParams({ from: '/medical-records/$recordNumber' });
  const navigate = useNavigate();
  const { data: patient, isLoading: patientLoading } = useGetPatient(recordNumber);
  const { data: visitNotes = [], isLoading: notesLoading } = useGetVisitNotes(recordNumber);

  const sortedNotes = [...visitNotes].sort((a, b) => Number(b.visitTime - a.visitTime));

  if (patientLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-medical-600">Loading medical records...</p>
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
        onClick={() => navigate({ to: '/patients/$recordNumber', params: { recordNumber } })}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Patient Details
      </Button>

      <Card className="border-medical-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-medical-800">Medical Records</CardTitle>
              <p className="text-sm text-medical-600 mt-1">
                {patient.name} - MRN: {patient.medicalRecordNumber}
              </p>
            </div>
            <Link to="/add-visit-note" search={{ patientRecordNumber: recordNumber }}>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Visit Note
              </Button>
            </Link>
          </div>
        </CardHeader>
      </Card>

      {notesLoading ? (
        <div className="text-center py-12">
          <p className="text-medical-600">Loading visit notes...</p>
        </div>
      ) : sortedNotes.length === 0 ? (
        <Card className="border-medical-200">
          <CardContent className="py-12 text-center">
            <p className="text-medical-600 mb-4">No visit notes recorded yet</p>
            <Link to="/add-visit-note" search={{ patientRecordNumber: recordNumber }}>
              <Button>Add First Visit Note</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedNotes.map((note, index) => (
            <VisitNoteCard key={index} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
