import { useEffect, useState } from "react";
import axios from 'axios'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, SimpleGrid, Button, Text, Flex } from "@mantine/core";
import { useAuth } from "../../utils/useAuth";

const Home = () => {
    const [patients, setPatients] = useState([])
    const { token } = useAuth();
    const { id } = useParams();

    const navigate = useNavigate();




    // We saw in a previous class how our ProtectedRoute checks for authorisation
    // if no token is found, it redirects to the '/' route, passing a 'msg' via the route state
    // if there is a message, we retrieve it here and display it
    const msg = useLocation()?.state?.msg || null;

    const getPatients = async () => {
        try {
            const res = await axios.get(`https://fed-medical-clinic-api.vercel.app/patients`);
            setPatients(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        // We can't make useEffect itself async, so we call an async function from inside it
        const fetchData = async () => {
            await getPatients();
        }

        fetchData();
    }, []);

    // const deletePatient = async () => {
    //     // if (!patientInfo) return;
    //     if (!window.confirm("Deleting will also cancel all this patient's appointments and prescriptions. Proceed?")) {
    //         return;
    //     }
    
    //     try {
    //         // Delete all appointments for the patient
    //         const patientAppointmentsIds = patientAppointments.map(appointment => appointment.id);
    //         await Promise.all(patientAppointmentsIds.map(id => axios.delete(`https://fed-medical-clinic-api.vercel.app/appointments/${id}`, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         })));
    
    //         // Delete all prescriptions for the patient
    //         const patientPrescriptionsIds = patientPrescriptions.map(prescription => prescription.id);
    //         await Promise.all(patientPrescriptionsIds.map(id => axios.delete(`https://fed-medical-clinic-api.vercel.app/prescriptions/${id}`, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         })));
    
    //         // Now delete the patient
    //         await axios.delete(`https://fed-medical-clinic-api.vercel.app/patients/${id}`, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });
            
    //         // Redirect to the /patients page after deletion
    //         navigate('/patients');
    //     } catch (error) {
    //         console.error("Error deleting patient:", error);
    //     }
    // };
    

    if (!patients.length) {
        return <div>Loading...</div>
    }

    

    return (
        
        <div>
            
            {msg && <Text mb={10} color='red'>{msg}</Text>}
            <Button mb={10} onClick={() => navigate('/patients/create')}>Create Patient</Button>
            <SimpleGrid cols={3}>

                {
                    patients && patients.map((patient) => {
                        return (
                            <Card shadow="sm" component={Flex} justify={'space-between'} direction={'column'}>
                                <h2>{patient.first_name} {patient.last_name}</h2>
                                <Flex w={'100%'} justify={'space-between'}>
                                    <button onClick={() => navigate(`/patients/${patient.id}`)}>View</button>
                                    {/* <button onClick={deletePatient} >🗑️</button> */}
                                </Flex>
                            </Card>
                        )
                    })
                }
            </SimpleGrid>
        </div>
    );
};

export default Home;