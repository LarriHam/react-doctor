import { useEffect, useState } from "react";
import axios from 'axios'
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import { Flex, Space } from '@mantine/core';

const SinglePatient = () => {
    // No longer pulling this directly from localStorage, the context does that for us, and stores it in its state
    const {token} = useAuth();

    const [patient, setPatient] = useState(null)

    const { id } = useParams();

    useEffect(() => {
        axios.get(`https://fed-medical-clinic-api.vercel.app/patients/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res)
                setPatient(res.data)
            })  
            .catch((err) => {
                console.error(err)
            })
    }, [])

    if(!patient){
        return 'Loading...'
    }

    return patient && (
        <div>
            <Link to={`/patients/${id}/edit`}>
                Edit patient
            </Link>
            <Flex>
                <p >First name:</p> <Space w="md"/>
                <p>{patient.first_name}</p>
            </Flex>
            <Flex>
                <p >Last name:</p> <Space w="md"/>
                <p>{patient.last_name}</p>
            </Flex>
            <Flex>
                <p >Email:</p> <Space w="md"/>
                <p>{patient.email}</p>
            </Flex>
            <Flex>
                <p >Phone:</p> <Space w="md"/>
                <p>{patient.phone}</p>
            </Flex>
    
        </div>
    )
}

export default SinglePatient;