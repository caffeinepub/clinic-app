import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, FileText, Pill } from 'lucide-react';
import type { VisitNote } from '../backend';

interface VisitNoteCardProps {
  note: VisitNote;
}

export default function VisitNoteCard({ note }: VisitNoteCardProps) {
  const visitDate = new Date(Number(note.visitTime) / 1000000);

  return (
    <Card className="border-medical-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg text-medical-800 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Visit Note
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-medical-600">
            <Calendar className="h-4 w-4" />
            {visitDate.toLocaleDateString()} {visitDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-medical-700 mb-1">Diagnosis</h4>
          <Badge variant="outline" className="bg-medical-100 text-medical-800">
            {note.diagnosis}
          </Badge>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-medical-700 mb-2">Clinical Notes</h4>
          <p className="text-sm text-medical-800 whitespace-pre-wrap bg-medical-50 p-3 rounded-lg">
            {note.notes}
          </p>
        </div>

        {note.prescriptions.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-medical-700 mb-2 flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Prescriptions
            </h4>
            <ul className="space-y-2">
              {note.prescriptions.map((prescription, index) => (
                <li key={index} className="text-sm text-medical-800 bg-medical-50 p-2 rounded">
                  {prescription}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-xs text-medical-600 pt-2 border-t border-medical-200">
          Appointment ID: {note.appointmentId}
        </div>
      </CardContent>
    </Card>
  );
}
