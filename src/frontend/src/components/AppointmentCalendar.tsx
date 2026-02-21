import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Appointment, Patient } from '../backend';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  patients: Patient[];
}

export default function AppointmentCalendar({ appointments, patients }: AppointmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getAppointmentsForDay = (day: number) => {
    const dayStart = new Date(year, month, day).getTime() * 1000000;
    const dayEnd = new Date(year, month, day + 1).getTime() * 1000000;
    
    return appointments.filter((apt) => {
      const aptTime = Number(apt.appointmentTime);
      return aptTime >= dayStart && aptTime < dayEnd;
    });
  };

  const getPatientName = (recordNumber: string) => {
    const patient = patients.find((p) => p.medicalRecordNumber === recordNumber);
    return patient?.name || 'Unknown';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'checkUp':
        return 'bg-medical-100 text-medical-800';
      case 'followUp':
        return 'bg-blue-100 text-blue-800';
      case 'consultation':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const days: React.ReactElement[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayAppointments = getAppointmentsForDay(day);
    const isToday = 
      day === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear();

    days.push(
      <div
        key={day}
        className={`h-24 border border-medical-200 p-2 overflow-y-auto ${
          isToday ? 'bg-medical-50 border-medical-400' : 'bg-white'
        }`}
      >
        <div className={`text-sm font-medium mb-1 ${isToday ? 'text-medical-800' : 'text-medical-600'}`}>
          {day}
        </div>
        <div className="space-y-1">
          {dayAppointments.slice(0, 2).map((apt) => (
            <div
              key={apt.id}
              className={`text-xs p-1 rounded ${getTypeColor(apt.appointmentType)}`}
            >
              <div className="font-medium truncate">{getPatientName(apt.patientRecordNumber)}</div>
              <div className="truncate">{apt.doctorName}</div>
            </div>
          ))}
          {dayAppointments.length > 2 && (
            <div className="text-xs text-medical-600">+{dayAppointments.length - 2} more</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={previousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold text-medical-800">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <Button variant="outline" size="sm" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-medical-700 py-2">
            {day}
          </div>
        ))}
        {days}
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <Badge variant="outline" className="bg-medical-100 text-medical-800">Check-up</Badge>
        <Badge variant="outline" className="bg-blue-100 text-blue-800">Follow-up</Badge>
        <Badge variant="outline" className="bg-purple-100 text-purple-800">Consultation</Badge>
        <Badge variant="outline" className="bg-red-100 text-red-800">Emergency</Badge>
      </div>
    </div>
  );
}
