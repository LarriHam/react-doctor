import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { useForm } from '@mantine/form';
import { TextInput, Text, Button } from "@mantine/core";

const CreatePatient = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    // This hook comes from mantine
    // This is similar to how we previously handled form state
    // We used a simple useState to store the form data
    // Along with our 'handleChange' function to update the form state
    // Mantine can handle that for us, as well as provide form validation
    const form = useForm({
        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            date_of_birth: '', 
            address: ''

        },
        // before mantine allows us to submit the form, we can run our own validation
        validate: {
            first_name: (value) => value.length > 2 && value.length < 255 ? null : 'First name must be between 2 and 255 characters',
            last_name: (value) => value.length > 2 && value.length < 255 ? null : 'Last name must be between 2 and 255 characters',
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'), // regex for validating an email address
            phone: (value) => value.length === 10 ? null : 'Phone number must be 10 digits',
            date_of_birth: (value) => value && value.length > 0 ? null : 'Date of birth is required',
            address: (value) => value && value.length > 0 ? null : 'Address is required'
                    
        },
    })

    const handleSubmit = () => {
        axios.post(`https://fed-medical-clinic-api.vercel.app/patients`, form.values, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res.data)
                navigate(`/patients/${res.data.id}`);
            })
            .catch((err) => {
                console.error(err)

                // if our client side validation fails to catch something, we can catch it here
                // we get errors from the server, so we retrieve them here and set them to show the user
                if (err.response.status === 422) {
                    // this is an array, we want an object so have to loop through and get entries
                    let errors = err.response.data.error.issues;
                    form.setErrors(Object.fromEntries(errors.map((error) => [error.path[0], error.message])))
                }

                if (err.response.data.message == 'SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: patients.email') {
                    console.log('Saw a unique constraint error')
                    form.setFieldError('email', 'Email must be unique.');
                }

                if (err.response.data.message == 'SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: patients.phone') {
                    form.setFieldError('phone', 'Phone number must be unique.');
                }
            })
    }

    return (
        <div>
            <Text size={24} mb={5}>Create a patient</Text>
            <form
                onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput withAsterisk label={'First name'} name='first_name' {...form.getInputProps('first_name')} />
                <TextInput withAsterisk label='Last name' name='last_name' {...form.getInputProps('last_name')} />
                <TextInput label={'Email'} withAsterisk name='email' {...form.getInputProps('email')} />
                <TextInput label={'Phone'} name='phone' withAsterisk {...form.getInputProps('phone')} />
                <TextInput withAsterisk label={'Date of Birth'} name='date_of_birth' {...form.getInputProps('date_of_birth')} />
                <TextInput withAsterisk label={'Address'} name='address' {...form.getInputProps('address')} />
                <Button mt={10} type={'submit'}>Submit</Button>
            </form>
        </div>
    )
}

export default CreatePatient;