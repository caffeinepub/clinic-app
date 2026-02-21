import { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useAddVisitNote, useGetAllPatients, useGetAllAppointments } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Plus, X } from 'lucide-react';

export default function AddVisitNote() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { patientRecordNumber?: string };
  const addVisitNote = useAddVisitNote();
  const { data: patients = [] } = useGetAllPatients();
  const { data: allAppointments = [] } = useGetAllAppointments();

  const [formData, setFormData] = useState({
    patientRecordNumber: search.patientRecordNumber || '',
    appointmentId: '',
    notes: '',
    diagnosis: '',
  });
  const [prescriptions, setPrescriptions] = useState<string[]>(['']);

  const patientAppointments = allAppointments.filter(
    (apt) => apt.patientRecordNumber === formData.patientRecordNumber
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const visitTime = BigInt(Date.now() * 1000000);
      const filteredPrescriptions = prescriptions.filter((p) => p.trim() !== '');

      await addVisitNote.mutateAsync({
        patientRecordNumber: formData.patientRecordNumber,
        appointmentId: formData.appointmentId,
        notes: formData.notes,
        diagnosis: formData.diagnosis,
        prescriptions: filteredPrescriptions,
        visitTime,
      });

      navigate({ to: `/medical-records/${formData.patientRecordNumber}` });
    } catch (error) {
      console.error('Failed to add visit note:', error);
    }
  };

  const addPrescription = () => {
    setPrescriptions([...prescriptions, '']);
  };

  const removePrescription = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const updatePrescription = (index: number, value: string) => {
    const updated = [...prescriptions];
    updated[index] = value;
    setPrescriptions(updated);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/dashboard' })}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      <Card className="border-medical-200">
        <CardHeader>
          <CardTitle className="text-2xl text-medical-800">Add Visit Note</CardTitle>
          <CardDescription>Record patient visit details and medical notes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient *</Label>
              <Select
                value={formData.patientRecordNumber}
                onValueChange={(value) => setFormData({ ...formData, patientRecordNumber: value, appointmentId: '' })}
              >
                <SelectTrigger id="patient">
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.medicalRecordNumber} value={patient.medicalRecordNumber}>
                      {patient.name} ({patient.medicalRecordNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.patientRecordNumber && (
              <div className="space-y-2">
                <Label htmlFor="appointment">Appointment *</Label>
                <Select
                  value={formData.appointmentId}
                  onValueChange={(value) => setFormData({ ...formData, appointmentId: value })}
                >
                  <SelectTrigger id="appointment">
                    <SelectValue placeholder="Select an appointment" />
                  </SelectTrigger>
                  <SelectContent>
                    {patientAppointments.map((apt) => (
                      <SelectItem key={apt.id} value={apt.id}>
                        {apt.doctorName} - {new Date(Number(apt.appointmentTime) / 1000000).toLocaleDateString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis *</Label>
              <Input
                id="diagnosis"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                placeholder="Enter diagnosis"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Visit Notes *</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Enter detailed visit notes..."
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Prescriptions</Label>
                <Button type="button" variant="outline" size="sm" onClick={addPrescription}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Prescription
                </Button>
              </div>
              <div className="space-y-2">
                {prescriptions.map((prescription, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={prescription}
                      onChange={(e) => updatePrescription(index, e.target.value)}
                      placeholder="Enter medication and dosage"
                    />
                    {prescriptions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePrescription(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/dashboard' })}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={addVisitNote.isPending} className="flex-1">
                {addVisitNote.isPending ? 'Saving...' : 'Save Visit Note'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
