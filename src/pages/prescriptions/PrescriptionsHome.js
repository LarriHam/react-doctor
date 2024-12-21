import { useEffect, useState } from "react";
import axios from 'axios'
import { useLocation, useNavigate } from "react-router-dom";
import { Card, SimpleGrid, Button, Text, Flex, Space } from "@mantine/core";
import { useAuth } from "../../utils/useAuth";

const PrescriptionsHome = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [diagnoses, setDiagnoses] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
   
    const navigate = useNavigate();
    const { token } = useAuth();
    const msg = useLocation()?.state?.msg || null;

    const getPrescriptions = async () => {
      try {
        const res = await axios.get(`https://fed-medical-clinic-api.vercel.app/prescriptions/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPrescriptions(res.data);
      } catch (e) {
        console.error(e);
      }
    };

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

    const getDiagnoses = async () => {
    try {
      const res = await axios.get(`https://fed-medical-clinic-api.vercel.app/diagnoses/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiagnoses(res.data);
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
        await getDiagnoses();
        await getDoctors();
        await getPatients();
        await getPrescriptions();
      }
      fetchData();
    }, [token]);

    const getDoctorName = (doctorId) => {const doctor = doctors.find((doctor) => doctor.id === doctorId);      
      return doctor ? `${doctor.first_name} ${doctor.last_name}` : "No Doctor";
    };
    
    const getPatientName = (patientId) => {const patient = patients.find((patient) => patient.id === patientId);
        return patient ? `${patient.first_name} ${patient.last_name}` : "No Patient";
    };

    const getDiagnosisName = (diagnosisId) => {const diagnosis = diagnoses.find((diagnosis) => diagnosis.id === diagnosisId);
      return diagnosis ? `${diagnosis.condition}` : "No Diagnosis";
    };

  
    if (!prescriptions.length) {
        return <div>Loading...</div>
    }

    const dateChange = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString(); 
    };

    const handleDelete = async (prescriptionId) => {
      try {
        await axios.delete(`https://fed-medical-clinic-api.vercel.app/prescriptions/${prescriptionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPrescriptions(prescriptions.filter((appt) => appt.id !== prescriptionId));
        alert("Prescription deleted");
      } catch (e) {
        console.error("Can't delete prescription:", e);
        alert("Can't delete prescription!");
      }
    };

    return (
        
        <div>
            
            {msg && <Text mb={10} color='red'>{msg}</Text>}
            <Button mb={10} onClick={() => navigate('/prescriptions/create')}>Create Prescription</Button>
            <SimpleGrid cols={3}>

                {
                    prescriptions && prescriptions.map((prescription) => {
                        return (
                            <Card shadow="sm" component={Flex} justify={'space-between'} direction={'column'}>
                                <Flex>                          
                                  <p>Patient: {getPatientName(prescription.patient_id)}</p> <Space w="xs"/>
                                </Flex>
                                <Flex>
                                  <p>Doctor: {getDoctorName(prescription.doctor_id)}</p> <Space w="xs"/>
                                </Flex>
                                <Flex>
                                  <p>Diagnosis: {getDiagnosisName(prescription.diagnosis_id)}</p> <Space w="xs"/>
                                </Flex>
                                <Flex>
                                  <p>Medication: {prescription.medication}</p> <Space w="xs"/>
                                </Flex>
                                <Flex>
                                  <p>Dosage: {prescription.dosage}</p> <Space w="xs"/>
                                </Flex>
                                <Flex>
                                  <p>Prescription Start Date: {dateChange(prescription.start_date)}</p> <Space w="xs"/>
                                </Flex>
                                <Flex>
                                  <p>Prescription End Date: {dateChange(prescription.end_date)}</p> <Space w="xs"/>
                                </Flex>
                                <Flex w={'100%'} justify={'space-between'}>
                                    <button onClick={(e) => {e.stopPropagation();handleDelete(prescription.id);}}>🗑️</button>
                                    <button onClick={() => navigate(`/prescriptions/{$id}/edit`)}>Edit</button>
    
                                </Flex>
                                
                            </Card>
                        )
                    })
                }
            </SimpleGrid>
        </div>
    );
};

export default PrescriptionsHome;