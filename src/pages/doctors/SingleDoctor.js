import { useEffect, useState } from "react";
import axios from 'axios'
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import { Flex, Space } from '@mantine/core';

const SingleDoctor = () => {
    // No longer pulling this directly from localStorage, the context does that for us, and stores it in its state
    const {token} = useAuth();

    const [doctor, setDoctor] = useState(null)

    const { id } = useParams();

    useEffect(() => {
        axios.get(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res)
                setDoctor(res.data)
            })  
            .catch((err) => {
                console.error(err)
            })
    }, [])

    if(!doctor){
        return 'Loading...'
    }

    return doctor && (
        <div>
            <Link to={`/doctors/${id}/edit`}>
                Edit doctor
            </Link>
            <Flex>
                <p >First name:</p> <Space w="md"/>
                <p>{doctor.first_name}</p>
            </Flex>
            <Flex>
                <p >Last name:</p> <Space w="md"/>
                <p>{doctor.last_name}</p>
            </Flex>
            <Flex>
                <p>Specialisation:</p> <Space w="md"/>
                <p>{doctor.specialisation}</p>
            </Flex>
        </div>
    )
}

export default SingleDoctor;