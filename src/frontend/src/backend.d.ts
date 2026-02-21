import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface VisitNote {
    visitTime: Time;
    diagnosis: string;
    notes: string;
    appointmentId: string;
    prescriptions: Array<string>;
}
export type Time = bigint;
export interface Doctor {
    contactInfo: string;
    name: string;
    specialty: string;
}
export interface Appointment {
    id: string;
    appointmentTime: Time;
    appointmentType: AppointmentType;
    patientRecordNumber: string;
    doctorName: string;
}
export interface Patient {
    contactInfo: string;
    name: string;
    medicalRecordNumber: string;
}
export interface UserProfile {
    name: string;
    role: string;
    specialty?: string;
}
export enum AppointmentType {
    checkUp = "checkUp",
    emergency = "emergency",
    followUp = "followUp",
    consultation = "consultation"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDoctor(name: string, specialty: string, contactInfo: string): Promise<void>;
    addVisitNote(patientRecordNumber: string, appointmentId: string, notes: string, diagnosis: string, prescriptions: Array<string>, visitTime: Time): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelAppointment(appointmentId: string): Promise<void>;
    getAllDoctors(): Promise<Array<Doctor>>;
    getAllPatients(): Promise<Array<Patient>>;
    getAppointmentsForPatient(recordNumber: string): Promise<Array<Appointment>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPatient(recordNumber: string): Promise<Patient | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVisitNotes(recordNumber: string): Promise<Array<VisitNote>>;
    isCallerAdmin(): Promise<boolean>;
    registerPatient(name: string, contactInfo: string, medicalRecordNumber: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    scheduleAppointment(patientRecordNumber: string, doctorName: string, appointmentTime: Time, appointmentType: AppointmentType): Promise<string>;
}
