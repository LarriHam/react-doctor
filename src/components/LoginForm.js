import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
import { Flex, Avatar } from '@mantine/core';

const LoginForm = () => {
    const navigate = useNavigate();
    const {login} = useAuth();

    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const handleSubmit = (e) => {
        // The form will cause a refresh by default. We don't want that, because our state will disappear.
        e.preventDefault();        

        login(form.email, form.password)
           
        navigate('/')
    }

    const handleChange = (e) => {
        setForm(({
            ...form,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <Flex justify="flex-end" direction="column">
        <form>
            <Flex gap="xs" justify="flex-end" align="center" direction="column">
            <Avatar size={120} radius={120} mx="auto" />           
            <div>
                <p >Email:</p>
                <input onChange={handleChange} value={form.email} type='email' name='email' placeholder='joe.bloggs@email.com'></input>
            </div>
            <div>
                <p>Password:</p>
                <input onChange={handleChange} value={form.password} type='password' name='password'></input>
            </div>
            
            <button onClick={handleSubmit}>Submit</button>
            <a href='/Register'> Don't have an account? Register here</a>
            </Flex>            
            
        </form>
        
        </Flex>
    )
}

export default LoginForm