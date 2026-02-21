import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import RegisterPatient from './pages/RegisterPatient';
import PatientDetail from './pages/PatientDetail';
import Appointments from './pages/Appointments';
import ScheduleAppointment from './pages/ScheduleAppointment';
import MedicalRecords from './pages/MedicalRecords';
import AddVisitNote from './pages/AddVisitNote';
import ProfileSetup from './components/ProfileSetup';
import LoginPage from './pages/LoginPage';

function RootComponent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  
  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (showProfileSetup) {
    return <ProfileSetup />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
});

const patientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patients',
  component: Patients,
});

const registerPatientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register-patient',
  component: RegisterPatient,
});

const patientDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patients/$recordNumber',
  component: PatientDetail,
});

const appointmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/appointments',
  component: Appointments,
});

const scheduleAppointmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/schedule-appointment',
  component: ScheduleAppointment,
});

const medicalRecordsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/medical-records/$recordNumber',
  component: MedicalRecords,
});

const addVisitNoteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/add-visit-note',
  component: AddVisitNote,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  patientsRoute,
  registerPatientRoute,
  patientDetailRoute,
  appointmentsRoute,
  scheduleAppointmentRoute,
  medicalRecordsRoute,
  addVisitNoteRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
