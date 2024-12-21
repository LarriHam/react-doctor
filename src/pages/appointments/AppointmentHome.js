import { useEffect, useState } from "react";
import axios from 'axios'
import { useLocation, useNavigate } from "react-router-dom";
import { Card, SimpleGrid, Button, Text, Flex, Space, Link } from "@mantine/core";
import { useAuth } from "../../utils/useAuth";

const AppointmentHome = () => {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);

    
    const navigate = useNavigate();
    const { token } = useAuth();
    const msg = useLocation()?.state?.msg || null;

    const getPatients = async () => {
        try {
          const res = await axios.get(`https://fed-medical-clinic-api.vercel.app/patients/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPatients(res.data);
        } catch (e) {
          console.error(e);
        }
    };

    const getAppointments = async () => {
        try {
          const res = await axios.get(`https://fed-medical-clinic-api.vercel.app/appointments/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAppointments(res.data);
        } catch (e) {
          console.error(e);
        }
    };

    const getDoctors = async () => {
        try {
          const res = await axios.get(`https://fed-medical-clinic-api.vercel.app/doctors/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDoctors(res.data);
        } catch (e) {
          console.error(e);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getPatients();
            await getAppointments();
            await getDoctors();
        }
        fetchData();
    }, [token]);

    const getDoctorName = (doctorId) => {
        const doctor = doctors.find((doctor) => doctor.id === doctorId);
        return doctor ? `${doctor.first_name} ${doctor.last_name}` : "No Doctor";
    };
    
    const getPatientName = (patientId) => {const patient = patients.find((patient) => patient.id === patientId);
        return patient ? `${patient.first_name} ${patient.last_name}` : "No Patient";
    };
    
    

    if (!appointments.length) {
        return <div>Loading...</div>
    }

    const handleDelete = async (appointmentId) => {
        try {
          await axios.delete(`https://fed-medical-clinic-api.vercel.app/appointments/${appointmentId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAppointments(appointments.filter((appt) => appt.id !== appointmentId));
          alert("Appointment deleted successfully!");
        } catch (e) {
          console.error("Error deleting appointment:", e);
          alert("Can't delete appointment!");
        }
    };
    

    return (
        
        <div>
            
            {msg && <Text mb={10} color='red'>{msg}</Text>}
            <Button mb={10} onClick={() => navigate('/appointments/create')}>Create Appointment</Button>
            <SimpleGrid cols={3}>

                {
                    appointments && appointments.map((appointment) => {
                        return (
                            <Card shadow="sm" component={Flex} justify={'space-between'} direction={'column'}>
                                <Flex>
                                    <p>Doctor:</p> <Space w="xs"/>
                                    <p>{getDoctorName(appointment.doctor_id)}</p>
                                </Flex>
                                <Flex>
                                    <p>Patient:</p> <Space w="xs"/>
                                    <p>{getPatientName(appointment.patient_id)}</p>
                                </Flex>
                                <Flex w={'100%'} justify={'space-between'}>
                                    <button onClick={(e) => {e.stopPropagation();handleDelete(appointment.id);}}>🗑️</button>
                                    <button onClick={(appointmentId) => navigate(`/appointments/${appointmentId}/edit`)}>Edit</button>
    
                                </Flex>
                                
                            </Card>
                        )
                    })
                }
            </SimpleGrid>
        </div>
    );
};

export default AppointmentHome;