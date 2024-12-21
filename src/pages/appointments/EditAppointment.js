import { useEffect, useState, useParams } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { useForm } from '@mantine/form';
import { Select, TextInput, Text, Button } from "@mantine/core";

const EditAppointment = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    

    const form = useForm({
        initialValues: {
            doctor_id: '',
            patient_id: '',
            appointment_date: ''

        },

        validate: {
            doctor_id: (value) => value ? null : 'Pick a doctor',
            patient_id: (value) => value ? null : 'Pick a patient',
            appointment_date: (value) => value ? null : 'Date is required',
                    
        },
    })

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await axios.get(`https://fed-medical-clinic-api.vercel.app/patients`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPatients(res.data);
            } catch (e) {
                console.error(e);
            }
        };

        const fetchDoctors = async () => {
            try {
                const res = await axios.get(`https://fed-medical-clinic-api.vercel.app/doctors`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDoctors(res.data);
            } catch (e) {
                console.error(e);
            }
        };

        const fetchAppointment = async () => {
            try {
                const res = await axios.get(`https://fed-medical-clinic-api.vercel.app/appointments/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const appointment = res.data;
                
                form.setValues({
                    doctor_id: appointment.doctor_id || '',
                    patient_id: appointment.patient_id || '',
                    appointment_date: appointment.appointment_date
                        ? new Date(appointment.appointment_date).toISOString().split('T')[0]
                        : '',
                });
                
            } catch (e) {
                console.error("no appointment:", e);
                if (e.response && e.response.status === 404) {
                    navigate('/appointments', { state: { msg: 'no Appointment' } });
                }       
            }              
        };

        fetchAppointment();
        fetchPatients();
        fetchDoctors();       
    }, [id, token, navigate]);

    const handleSubmit = () => {
        const formattedDate = new Date(form.values.appointment_date).toISOString().split('T')[0];
        const appointmentData = {
            doctor_id: parseInt(form.values.doctor_id, 10),
            patient_id: parseInt(form.values.patient_id, 10),
            appointment_date: formattedDate, 
        }; 
        axios.patch(`https://fed-medical-clinic-api.vercel.app/appointment/${id}`, appointmentData, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
            navigate('/appointments', { state: { msg: 'Appointment updated' } });
        })
        .catch((err) => {
            console.error("Can't update appointment:", err.response ? err.response.data : err.message);
            if (err.response && err.response.status === 422) {
                const errors = err.response.data.error.issues;
                form.setErrors(Object.fromEntries(errors.map((error) => [error.path[0], error.message])));
            } else if (err.response && err.response.status === 404) {
                navigate('/appointments', { state: { msg: 'no Appointment' } });
            }
        });
    }


    return (
        <div>
            <Text size={24} mb={5}>Update Appointment</Text>
            <form
                onSubmit={form.onSubmit(handleSubmit)}>
                    <Select
                        withAsterisk
                        label="Pick a doctor"
                        placeholder="Pick a doctor"
                        data={doctors.map(doctor => ({value: doctor.id, label: `${doctor.first_name} ${doctor.last_name}`}))}
                        {...form.getInputProps('doctor_id')}
                    />
                    <Select
                        withAsterisk
                        label="Pick a patient"
                        placeholder="Pick a patient"
                        data={patients.map(patient => ({value: patient.id, label: `${patient.first_name} ${patient.last_name}`}))}
                        {...form.getInputProps('patient_id')}
                    /> 
                    <TextInput withAsterisk label="Date" type="date" {...form.getInputProps('appointment_date')}/>
               
                <Button mt={10} type={'submit'}>Submit</Button>
            </form>
        </div>
    )
}

export default EditAppointment;