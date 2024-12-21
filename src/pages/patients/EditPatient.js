import { useEffect } from "react"
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import { useForm } from '@mantine/form'
import { TextInput, Text, Button } from "@mantine/core";


const EditPatient = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    // Starting off with an empty object for our form
    const form = useForm({
        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone: ''

        },
        validate: {
            first_name: (value) => value.length > 2 && value.length < 255 ? null : 'First name must be between 2 and 255 characters',
            last_name: (value) => value.length > 2 && value.length < 255 ? null : 'Last name must be between 2 and 255 characters',
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'), // regex for validating an email address
            phone: (value) => value.length === 10 ? null : 'Phone number must be 10 digits',
            
        },
    });

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const response = await axios.get(`https://fed-medical-clinic-api.vercel.app/patients/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Only update form values if the data is not already set
                if (form.values.first_name === '') {
                    form.setValues(response.data);
                }
              
            } catch (error) {
                console.error('Error fetching patient details:', error);
               
            }
        };

        fetchPatientDetails();
    }, [id, token, form]);




    const handleSubmit = () => {
        axios.patch(`https://fed-medical-clinic-api.vercel.app/patients/${id}`, form.values, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
            console.log(res.data);
            navigate(`/patients/${res.data.id}`);
        })
        .catch((err) => {
            console.error(err);

            if (err.response.status === 422) {
                let errors = err.response.data.error.issues;
                form.setErrors(Object.fromEntries(errors.map((error) => [error.path[0], error.message])));
            }

            if (err.response.data.message === 'SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: patients.email') {
                form.setFieldError('email', 'Email must be unique.');
            }

            if (err.response.data.message === 'SQLITE_CONSTRAINT: SQLITE error: UNIQUE constraint failed: patients.phone') {
                form.setFieldError('phone', 'Phone number must be unique.');
            }
        });
    }

    return (
            
        <div>
            <Text size={24} mb={5}>Edit a patient</Text>
            <form
                // mantine provides the onSubmit hook, included in our form object
                // this will run our handleSubmit function, but also run the form validation
                onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput withAsterisk label={'First name'} name='first_name' {...form.getInputProps('first_name')} />
                <TextInput withAsterisk label='Last name' name='last_name' {...form.getInputProps('last_name')} />


                {/* form.getInputProps('email') returns an object with props about the input */}
                {/* We can spread (...) this object to pass all the props to the input all at once */}
                <TextInput label={'Email'} withAsterisk name='email' {...form.getInputProps('email')} />

                <TextInput label={'Phone'} name='phone' withAsterisk {...form.getInputProps('phone')} />

                <Button mt={10} type={'submit'}>Submit</Button>
            </form>
        </div>
       
        
    )
}

export default EditPatient;