import { AuthProvider } from "./utils/useAuth";
import { createContext } from "react";
import { MantineProvider, AppShell, Header, Footer } from '@mantine/core';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from './components/Navbar';
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from './components/ProtectedRoute'

//doctors
import Home from './pages/Home';
import SingleDoctor from "./pages/doctors/SingleDoctor";
import Create from './pages/doctors/Create';
import Edit from './pages/doctors/Edit';

//patients
import PatientHome from './pages/patients/PatientHome';
import SinglePatient from "./pages/patients/SinglePatient";
import CreatePatient from './pages/patients/CreatePatient';
import EditPatient from './pages/patients/EditPatient';

//appointments
import AppointmentHome from './pages/appointments/AppointmentHome';
import CreateAppointment from './pages/appointments/CreateAppointment';
import EditAppointment from './pages/appointments/EditAppointment';

//diagnoses
import DiagnosesHome from "./pages/diagnoses/DiagnosesHome";
import CreateDiagnoses from "./pages/diagnoses/CreateDiagnoses";
import EditDiagnoses from "./pages/diagnoses/EditDiagnoses";

//prescriptions
import PrescriptionsHome from "./pages/prescriptions/PrescriptionsHome";
import CreatePrescription from "./pages/prescriptions/CreatePrescriptions";
import EditPrescription from "./pages/prescriptions/EditPrescriptions";

export const UserContext = createContext();

const App = () => {
    // We wrap the entire app in the auth provider
    // We no longer need to pass the auth state down from here, all our routes can get it from the context instead    

    return (
        <div>
            <AuthProvider>
                <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'dark' }}>
                    <Router>
                        {/* Creates a menu on the left and our content on the right */}
                        {/* We can pass in our own components for the navbar, header and footer */}                                            
                        <AppShell
                            padding="md"
                            navbar={<Navbar />}
                            header={<Header height={60} p="md">Clinic Manager</Header>}
                            footer={<Footer height={60} p="xs"></Footer>}
                        >
                            <Routes>
                                <Route path="/" element={<Home />} />

                                {/* Doctor routes */}                                
                                <Route path='/' element={<ProtectedRoute />}>
                                    <Route path='/doctors/create' element={<Create />} />
                                    <Route path='/doctors/:id/edit' element={<Edit />} />
                                    <Route path='/doctors/:id' element={<SingleDoctor />} />
                                </Route>

                                {/* Patient routes */}                
                                <Route path='/patients' element={<PatientHome />}/>                
                                <Route path='/patients' element={<ProtectedRoute />}>
                                    <Route path='/patients/create' element={<CreatePatient />} />
                                    <Route path='/patients/:id/edit' element={<EditPatient />} />
                                    <Route path='/patients/:id' element={<SinglePatient />} />
                                </Route>

                                {/* Appointment routes */} 
                                <Route path='/appointments' element={<ProtectedRoute />}>
                                    <Route path='/appointments' element={<AppointmentHome />}/>
                                    <Route path='/appointments/create' element={<CreateAppointment />} />
                                    <Route path='/appointments/:id/edit' element={<EditAppointment />} />
                                </Route>

                                {/* Diagonses routes */} 
                                <Route path='/diagnoses' element={<ProtectedRoute />}>
                                    <Route path='/diagnoses' element={<DiagnosesHome />}/>
                                    <Route path='/diagnoses/create' element={<CreateDiagnoses />} />
                                    <Route path='/diagnoses/:id/edit' element={<EditDiagnoses />} />
                                </Route>

                                <Route path='/prescriptions' element={<ProtectedRoute />}>
                                    <Route path='/prescriptions' element={<PrescriptionsHome />}/>
                                    <Route path='/prescriptions/create' element={<CreatePrescription />} />
                                    <Route path='/prescriptions/:id/edit' element={<EditPrescription />} />
                                </Route>

                                <Route path='/login' element={<LoginForm />} />
                                <Route path='/register' element={<RegisterForm />} />
                            </Routes>
                        </AppShell>
                    </Router>
                </MantineProvider>
            </AuthProvider>
        </div>
    );
};

export default App;