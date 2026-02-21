import Map "mo:core/Map";
import List "mo:core/List";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public type UserProfile = {
    name : Text;
    role : Text; // "doctor", "staff", "admin"
    specialty : ?Text; // For doctors
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Patient Management
  public type Patient = {
    name : Text;
    contactInfo : Text;
    medicalRecordNumber : Text;
  };

  module Patient {
    public func compare(patient1 : Patient, patient2 : Patient) : Order.Order {
      switch (Text.compare(patient1.name, patient2.name)) {
        case (#equal) { Text.compare(patient1.medicalRecordNumber, patient2.medicalRecordNumber) };
        case (order) { order };
      };
    };
  };

  let patients = Map.empty<Text, Patient>();

  // Doctor Management
  public type Doctor = {
    name : Text;
    specialty : Text;
    contactInfo : Text;
  };

  let doctors = List.empty<Doctor>();

  module Doctor {
    public func compareByName(doctor1 : Doctor, doctor2 : Doctor) : Order.Order {
      Text.compare(doctor1.name, doctor2.name);
    };
  };

  // Appointment Management
  public type AppointmentType = {
    #checkUp;
    #followUp;
    #consultation;
    #emergency;
  };

  public type Appointment = {
    id : Text;
    patientRecordNumber : Text;
    doctorName : Text;
    appointmentTime : Time.Time;
    appointmentType : AppointmentType;
  };

  let appointments = Map.empty<Text, Appointment>();

  // Medical Record Management
  public type VisitNote = {
    appointmentId : Text;
    notes : Text;
    diagnosis : Text;
    prescriptions : [Text];
    visitTime : Time.Time;
  };

  let medicalRecords = Map.empty<Text, List.List<VisitNote>>();

  ////////////////////////////////////////////////////////////////////////////
  // Patient Operations

  public shared ({ caller }) func registerPatient(name : Text, contactInfo : Text, medicalRecordNumber : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated staff can register patients");
    };
    if (contactInfo.size() < 10) {
      Runtime.trap("Contact information must be at least 10 characters");
    };
    let newPatient : Patient = {
      name;
      contactInfo;
      medicalRecordNumber;
    };
    patients.add(medicalRecordNumber, newPatient);
  };

  public query ({ caller }) func getPatient(recordNumber : Text) : async ?Patient {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated staff can view patient data");
    };
    patients.get(recordNumber);
  };

  public query ({ caller }) func getAllPatients() : async [Patient] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated staff can view patient list");
    };
    patients.values().toArray().sort();
  };

  ////////////////////////////////////////////////////////////////////////////
  // Doctor Operations

  public shared ({ caller }) func addDoctor(name : Text, specialty : Text, contactInfo : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add doctors");
    };
    let newDoctor : Doctor = {
      name;
      specialty;
      contactInfo;
    };
    doctors.add(newDoctor);
  };

  public query ({ caller }) func getAllDoctors() : async [Doctor] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated staff can view doctor list");
    };
    doctors.toArray().sort(Doctor.compareByName);
  };

  ////////////////////////////////////////////////////////////////////////////
  // Appointment Operations

  public shared ({ caller }) func scheduleAppointment(
    patientRecordNumber : Text,
    doctorName : Text,
    appointmentTime : Time.Time,
    appointmentType : AppointmentType,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated staff can schedule appointments");
    };
    let appointmentId = patientRecordNumber.concat("_").concat(doctorName).concat("_").concat(appointmentTime.toNat().toText());
    switch (patients.get(patientRecordNumber)) {
      case (null) { Runtime.trap("Patient does not exist") };
      case (?_) {};
    };

    let newAppointment : Appointment = {
      id = appointmentId;
      patientRecordNumber;
      doctorName;
      appointmentTime;
      appointmentType;
    };

    appointments.add(appointmentId, newAppointment);
    appointmentId;
  };

  public query ({ caller }) func getAppointmentsForPatient(recordNumber : Text) : async [Appointment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated staff can view appointments");
    };
    appointments.entries().toArray().filter(func((_, appt)) { appt.patientRecordNumber == recordNumber }).map(func((_, appt)) { appt });
  };

  public shared ({ caller }) func cancelAppointment(appointmentId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated staff can cancel appointments");
    };
    switch (appointments.get(appointmentId)) {
      case (null) { Runtime.trap("Appointment does not exist") };
      case (?_) {
        appointments.remove(appointmentId);
      };
    };
  };

  ////////////////////////////////////////////////////////////////////////////
  // Medical Record Operations

  public shared ({ caller }) func addVisitNote(
    patientRecordNumber : Text,
    appointmentId : Text,
    notes : Text,
    diagnosis : Text,
    prescriptions : [Text],
    visitTime : Time.Time,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated medical staff can add visit notes");
    };
    switch (patients.get(patientRecordNumber)) {
      case (null) { Runtime.trap("Patient does not exist") };
      case (?_) {};
    };

    let newNote : VisitNote = {
      appointmentId;
      notes;
      diagnosis;
      prescriptions;
      visitTime;
    };

    let existingNotes = switch (medicalRecords.get(patientRecordNumber)) {
      case (null) { List.empty<VisitNote>() };
      case (?notesList) { notesList };
    };

    existingNotes.add(newNote);
    medicalRecords.add(patientRecordNumber, existingNotes);
  };

  public query ({ caller }) func getVisitNotes(recordNumber : Text) : async [VisitNote] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated staff can view medical records");
    };
    switch (medicalRecords.get(recordNumber)) {
      case (null) { [] };
      case (?notesList) { notesList.toArray() };
    };
  };
};
