import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useScheduleAppointment, useGetAllPatients } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { AppointmentType } from '../backend';

export default function ScheduleAppointment() {
  const navigate = useNavigate();
  const scheduleAppointment = useScheduleAppointment();
  const { data: patients = [] } = useGetAllPatients();
  
  const [formData, setFormData] = useState({
    patientRecordNumber: '',
    doctorName: '',
    appointmentDate: '',
    appointmentTime: '',
    appointmentType: 'checkUp' as keyof typeof AppointmentType,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);
      const appointmentTime = BigInt(dateTime.getTime() * 1000000);

      await scheduleAppointment.mutateAsync({
        patientRecordNumber: formData.patientRecordNumber,
        doctorName: formData.doctorName,
        appointmentTime,
        appointmentType: AppointmentType[formData.appointmentType],
      });
      
      navigate({ to: '/appointments' });
    } catch (error) {
      console.error('Failed to schedule appointment:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/appointments' })}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Appointments
      </Button>

      <Card className="border-medical-200">
        <CardHeader>
          <CardTitle className="text-2xl text-medical-800">Schedule Appointment</CardTitle>
          <CardDescription>Book a new appointment for a patient</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient *</Label>
              <Select
                value={formData.patientRecordNumber}
                onValueChange={(value) => setFormData({ ...formData, patientRecordNumber: value })}
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

            <div className="space-y-2">
              <Label htmlFor="doctorName">Doctor Name *</Label>
              <Input
                id="doctorName"
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                placeholder="Enter doctor's name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appointmentDate">Date *</Label>
                <Input
                  id="appointmentDate"
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointmentTime">Time *</Label>
                <Input
                  id="appointmentTime"
                  type="time"
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointmentType">Appointment Type *</Label>
              <Select
                value={formData.appointmentType}
                onValueChange={(value) => setFormData({ ...formData, appointmentType: value as keyof typeof AppointmentType })}
              >
                <SelectTrigger id="appointmentType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checkUp">Check-up</SelectItem>
                  <SelectItem value="followUp">Follow-up</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/appointments' })}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={scheduleAppointment.isPending} className="flex-1">
                {scheduleAppointment.isPending ? 'Scheduling...' : 'Schedule Appointment'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
