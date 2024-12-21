import { useEffect, useState } from "react";
import axios from 'axios'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, SimpleGrid, Button, Text, Flex } from "@mantine/core";
import { useAuth } from "../utils/useAuth";

const Home = () => {
    const [doctors, setDoctors] = useState([])

    const navigate = useNavigate();
    const { token } = useAuth();
    const { id } = useParams();

    const msg = useLocation()?.state?.msg || null;

    const getDoctors = async () => {
        try {
            const res = await axios.get(`https://fed-medical-clinic-api.vercel.app/doctors/`);
            setDoctors(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getDoctors();
        }

        fetchData();
    }, []);

    if (!doctors.length) {
        return <div>Loading...</div>
    }

    
    return (
        
        <div>
            
            {msg && <Text mb={10} color='red'>{msg}</Text>}
            <Button mb={10} onClick={() => navigate('/doctors/create')}>Create doctor</Button>
            <SimpleGrid cols={3}>

                {
                    doctors && doctors.map((doctor) => {
                        return (

                            <Card shadow="sm" component={Flex} justify={'space-between'} direction={'column'}>
                                <h2>Dr {doctor.first_name} {doctor.last_name}</h2>
                                <p>Specialisation: {doctor.specialisation}</p>
                                <Flex w={'100%'} justify={'space-between'}>
                                    <button onClick={() => navigate(`/doctors/${doctor.id}`)}>View</button>
                                    {/* <button onClick={deleteDoctor} >🗑️</button> */}
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