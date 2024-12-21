import { useEffect, useState } from "react";
import axios from 'axios'
import { useLocation, useNavigate } from "react-router-dom";
import { Card, SimpleGrid, Button, Text, Flex, Space } from "@mantine/core";
import { useAuth } from "../../utils/useAuth";

const DiagnosesHome = () => {
    const [diagnoses, setDiagnoses] = useState([]);
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

    useEffect(() => {
      const fetchData = async () => {
        await getPatients();
        await getDiagnoses();
      }
      fetchData();
    }, [token]);
    
    const getPatientName = (patientId) => {const patient = patients.find((patient) => patient.id === patientId);
        return patient ? `${patient.first_name} ${patient.last_name}` : "No Patient";
    };

  
    if (!diagnoses.length) {
        return <div>Loading...</div>
    }

    const dateChange = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString(); 
    };

    const handleDelete = async (diagnosisId) => {
        try {
          await axios.delete(`https://fed-medical-clinic-api.vercel.app/diagnoses/${diagnosisId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDiagnoses(diagnoses.filter((appt) => appt.id !== diagnosisId));
          alert("Diagnosis has been deleted");
        } catch (e) {
          console.error("Can't delete diagnosis:", e);
          alert("Can't delete diagnosis!");
        }
    };

    return (
        
        <div>
            
            {msg && <Text mb={10} color='red'>{msg}</Text>}
            <Button mb={10} onClick={() => navigate('/diagnoses/create')}>Create Diagnosis</Button>
            <SimpleGrid cols={3}>

                {
                    diagnoses && diagnoses.map((diagnosis) => {
                        return (
                            <Card shadow="sm" component={Flex} justify={'space-between'} direction={'column'}>
                                <Flex>                          
                                  <p>Patient: {getPatientName(diagnosis.patient_id)}</p> <Space w="xs"/>
                                </Flex>
                                <Flex>
                                  <p>Condition: {diagnosis.condition}</p> <Space w="xs"/>
                                </Flex>
                                <Flex>
                                  <p>Diagnosis Date: {dateChange(diagnosis.diagnosis_date)}</p> <Space w="xs"/>
                                </Flex>
                                <Flex w={'100%'} justify={'space-between'}>
                                    <button onClick={(e) => {e.stopPropagation();handleDelete(diagnosis.id);}}>🗑️</button>
                                    <button onClick={() => navigate(`/diagnoses/{$id}/edit`)}>Edit</button>
    
                                </Flex>
                                
                            </Card>
                        )
                    })
                }
            </SimpleGrid>
        </div>
    );
};

export default DiagnosesHome;