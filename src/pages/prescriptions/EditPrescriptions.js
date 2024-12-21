import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { useForm } from '@mantine/form';
import { Select, TextInput, Text, Button } from "@mantine/core";

const CreateDiagnoses = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    const [diagnoses, setDiagnoses] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);

    const form = useForm({
        initialValues: {
            patient_id: '',
            doctor_id: '', 
            diagnosis_id: '',
            medication: '',
            dosage: '',
            start_date: '',
            end_date: '',
        },

        validate: {
            patient_id: (value) => value ? null : 'Please select a patient',
            doctor_id: (value) => value ? null : 'Please select a doctor', 
            diagnosis_id: (value) => value ? null : 'Please select a diagnosis',
            medication: (value) => value ? null : 'Required',
            dosage: (value) => value ? null : 'Required',
            start_date: (value) => value ? null : 'Required',
            end_date: (value) => value ? null : 'Required'       
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

        const fetchDiagnoses = async () => {
            try {
                const res = await axios.get(`https://fed-medical-clinic-api.vercel.app/diagnoses`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDiagnoses(res.data);
            } catch (e) {
                console.error(e);
            }
        };

        const fetchPrescription = async () => {
            try {
                const res = await axios.get(`https://fed-medical-clinic-api.vercel.app/prescriptions/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const prescription = res.data;
                
                form.setValues({
                    doctor_id: prescription.doctor_id || '',
                    patient_id: prescription.patient_id || '',
                    diagnosis_id: prescription.diagnosis_id || '',
                    medication: prescription.medication || '',
                    dosage: prescription.dosage || '',
                    start_date: prescription.start_date
                        ? new Date(prescription.start_date).toISOString().split('T')[0]
                        : '',
                    end_date: prescription.end_date
                        ? new Date(prescription.end_date).toISOString().split('T')[0]
                        : '',
                });
            } catch (e) {
                console.error(e);
                if (e.response && e.response.status === 404) {
                    navigate('/prescriptions', { state: { msg: 'No Prescription' } });
                }
            }
        };

        fetchDiagnoses();
        fetchDoctors();
        fetchPatients();  
        fetchPrescription();             
    }, [id, token, navigate]);

    const handleSubmit = () => {
        const formattedStartDate = new Date(form.values.start_date).toISOString().split("T")[0];
        const formattedEndDate = new Date(form.values.end_date).toISOString().split("T")[0];

        const prescriptionData = {
            id: id,
            doctor_id: parseInt(form.values.doctor_id, 10),
            patient_id: parseInt(form.values.patient_id, 10),
            diagnosis_id: parseInt(form.values.diagnosis_id, 10),
            medication: form.values.medication,
            dosage: form.values.dosage,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
          };
        axios.post(`https://fed-medical-clinic-api.vercel.app/prescriptions`, prescriptionData, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            navigate('/prescriptions', { state: { msg: 'Prescription created' } });
        })
        .catch((err) => {
            console.error("Error:", err.response ? err.response.data : err.message);
            if (err.response && err.response.status === 422) {
                const errors = err.response.data.error.issues;
                form.setErrors(Object.fromEntries(errors.map((error) => [error.path[0], error.message])));
            }
        });
    }


    return (
        <div>
            <Text size={24} mb={5}>Edit a Prescription</Text>
            <form
                onSubmit={form.onSubmit(handleSubmit)}>
                    <Select
                        withAsterisk
                        label="Pick a doctor"
                        placeholder="Pick a doctor"
                        data={doctors.map((doctor) => ({
                        value: doctor.id,
                        label: `${doctor.first_name} ${doctor.last_name}`,
                        }))}
                        {...form.getInputProps("doctor_id")}
                        />
                    <Select
                        withAsterisk
                        label="Pick a patient"
                        placeholder="Pick a patient"
                        data={patients.map((patient) => ({
                        value: patient.id,
                        label: `${patient.first_name} ${patient.last_name}`,
                        }))}
                        {...form.getInputProps("patient_id")}
                    />
                    <Select
                        withAsterisk
                        label="Pick a diagnosis"
                        placeholder="Pick a diagnosis"
                        data={diagnoses.map((diagnosis) => ({
                        value: diagnosis.id,
                        label: diagnosis.condition, 
                        }))}
                        {...form.getInputProps("diagnosis_id")}
                    />
                    <TextInput withAsterisk label="Medication" placeholder="Enter medication name" {...form.getInputProps("medication")}/>
                    <TextInput withAsterisk label="Dosage" placeholder="Enter dosage" {...form.getInputProps("dosage")}/>
                    <TextInput withAsterisk label="Start Date" type="date" {...form.getInputProps("start_date")}/>
                    <TextInput withAsterisk label="End Date" type="date" {...form.getInputProps("end_date")} />
                <Button mt={10} type={'submit'}>Submit</Button>
            </form>
        </div>
    )
}

export default CreateDiagnoses;