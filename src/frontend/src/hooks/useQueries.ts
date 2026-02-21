import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Patient, Appointment, VisitNote, UserProfile, AppointmentType } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Patient Queries
export function useGetAllPatients() {
  const { actor, isFetching } = useActor();

  return useQuery<Patient[]>({
    queryKey: ['patients'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPatients();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPatient(recordNumber: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Patient | null>({
    queryKey: ['patient', recordNumber],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPatient(recordNumber);
    },
    enabled: !!actor && !isFetching && !!recordNumber,
  });
}

export function useRegisterPatient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; contactInfo: string; medicalRecordNumber: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerPatient(data.name, data.contactInfo, data.medicalRecordNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}

// Appointment Queries
export function useGetAppointmentsForPatient(recordNumber: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Appointment[]>({
    queryKey: ['appointments', recordNumber],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAppointmentsForPatient(recordNumber);
    },
    enabled: !!actor && !isFetching && !!recordNumber,
  });
}

export function useGetAllAppointments() {
  const { actor, isFetching } = useActor();
  const { data: patients } = useGetAllPatients();

  return useQuery<Appointment[]>({
    queryKey: ['allAppointments'],
    queryFn: async () => {
      if (!actor || !patients) return [];
      const allAppointments: Appointment[] = [];
      for (const patient of patients) {
        const appointments = await actor.getAppointmentsForPatient(patient.medicalRecordNumber);
        allAppointments.push(...appointments);
      }
      return allAppointments.sort((a, b) => Number(a.appointmentTime - b.appointmentTime));
    },
    enabled: !!actor && !isFetching && !!patients,
  });
}

export function useScheduleAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      patientRecordNumber: string;
      doctorName: string;
      appointmentTime: bigint;
      appointmentType: AppointmentType;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.scheduleAppointment(
        data.patientRecordNumber,
        data.doctorName,
        data.appointmentTime,
        data.appointmentType
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['allAppointments'] });
    },
  });
}

export function useCancelAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.cancelAppointment(appointmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['allAppointments'] });
    },
  });
}

// Medical Records Queries
export function useGetVisitNotes(recordNumber: string) {
  const { actor, isFetching } = useActor();

  return useQuery<VisitNote[]>({
    queryKey: ['visitNotes', recordNumber],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVisitNotes(recordNumber);
    },
    enabled: !!actor && !isFetching && !!recordNumber,
  });
}

export function useAddVisitNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      patientRecordNumber: string;
      appointmentId: string;
      notes: string;
      diagnosis: string;
      prescriptions: string[];
      visitTime: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addVisitNote(
        data.patientRecordNumber,
        data.appointmentId,
        data.notes,
        data.diagnosis,
        data.prescriptions,
        data.visitTime
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitNotes'] });
    },
  });
}
