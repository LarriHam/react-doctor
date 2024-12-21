import { useEffect, useState } from "react";
import axios from 'axios'

const Home = () => {
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [doctorAppointments, setDoctorAppointments] = useState([])
    const [doctorPrescriptions, setDoctorPrescriptions] = useState([])

    // We make this function asynchronous, because the tasks it performs might take some time
    const deleteDoctor = async (id) => {
        // User may try to run this function after a delete has happened, in which case we don't want to do anything
        if (!doctorInfo) {
            return
        }

        // Wrapping our API calls in a try/catch block means we can handle any errors that occur
        try {
            // In this first if block, we check if the doctor has any appointments or prescriptions
            // If so, we need to delete them first
            if (doctorAppointments.length > 0) {

                // Map will return our array of promises, which we can await

                // better than using forEach, because then we'd need to create an array beforehand and push to it
                const deleteAppointmentJobs = doctorAppointments.map((appointment) => {
                    return axios.delete(`https://fed-medical-clinic-api.vercel.app/appointments/${appointment.id}`, {
                        headers: {
                            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsImVtYWlsIjoiam9lLmJsb2dnc0BlbWFpbC5jb20ifQ.0kNJGun8HEfA4JHeSy3PYSg-JkQodmi89F3cYJdzwoM`
                        }
                    });
                });

                // WAIT for all the promises to resolve before continuing
                await Promise.all(deleteAppointmentJobs);
            }

            if (doctorPrescriptions.length > 0) {
                // Once again, we iterate over the array of prescriptions, adding each delete request to an array
                // We then wait for all of them to complete before continuing
                const deletePrescriptionJobs = doctorPrescriptions.map((prescription) => {
                    return axios.delete(`https://fed-medical-clinic-api.vercel.app/prescriptions/${prescription.id}`, {
                        headers: {
                            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsImVtYWlsIjoiam9lLmJsb2dnc0BlbWFpbC5jb20ifQ.0kNJGun8HEfA4JHeSy3PYSg-JkQodmi89F3cYJdzwoM`
                        }
                    });
                });

                await Promise.all(deletePrescriptionJobs);
            }


            // With our appointments and prescriptions deleted, we can now delete the doctor
            await axios.delete(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, {
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsImVtYWlsIjoiam9lLmJsb2dnc0BlbWFpbC5jb20ifQ.0kNJGun8HEfA4JHeSy3PYSg-JkQodmi89F3cYJdzwoM`
                }
            })

            console.log('Doctor deleted')

            // Clear out all our state values
            setDoctorAppointments([])
            setDoctorPrescriptions([])
            setDoctorInfo(null)

        } catch (e) {
            console.error(e)
        }
    }

    const getDoctorById = async (id) => {
        try {
            const res = await axios.get(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, {
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsImVtYWlsIjoiam9lLmJsb2dnc0BlbWFpbC5jb20ifQ.0kNJGun8HEfA4JHeSy3PYSg-JkQodmi89F3cYJdzwoM`
                }
            });
            setDoctorInfo(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const getDoctorAppointments = async (id) => {
        try {
            const res = await axios.get(`https://fed-medical-clinic-api.vercel.app/appointments`, {
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsImVtYWlsIjoiam9lLmJsb2dnc0BlbWFpbC5jb20ifQ.0kNJGun8HEfA4JHeSy3PYSg-JkQodmi89F3cYJdzwoM`
                }
            });
            setDoctorAppointments(res.data.filter((appointment) => appointment.doctor_id === id));
        } catch (e) {
            console.error(e);
        }
    };


    const getDoctorPrescriptions = async (id) => {
        try {
            const res = await axios.get(`https://fed-medical-clinic-api.vercel.app/prescriptions`, {
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsImVtYWlsIjoiam9lLmJsb2dnc0BlbWFpbC5jb20ifQ.0kNJGun8HEfA4JHeSy3PYSg-JkQodmi89F3cYJdzwoM`
                }
            });
            setDoctorPrescriptions(res.data.filter((prescription) => prescription.doctor_id === id));
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        // We can't make useEffect itself async, so we call an async function from inside it
        const fetchData = async () => {
            await getDoctorById(45);
            await getDoctorAppointments(45);
            await getDoctorPrescriptions(45);
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Doctor Home</h1>
            <div>
                {
                    doctorInfo && (
                        <div>
                            Name: {doctorInfo.first_name} {doctorInfo.last_name}
                            <br />
                            Email: {doctorInfo.email}
                        </div>
                    )
                }
                <br />
                <h1>Appointments</h1>
                {
                    doctorAppointments ? (
                        <div>
                            {
                                doctorAppointments.map((appointment) => {
                                    return (
                                        <div>
                                            <span>ID: {appointment.id}</span>
                                            <span> With Patient: {appointment.patient_id}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    ): 'This doctor has no appointments'
                }
                <h1>Prescriptions</h1>
                {
                    doctorPrescriptions ? (
                        <div>
                            {
                                doctorPrescriptions.map((prescription) => {
                                    return (
                                        <div>
                                            <span>ID: {prescription.id}</span>
                                            <br />
                                            <span> Medication: {prescription.medication}</span>
                                            <span> Dosage: {prescription.dosage}</span>
                                            <br />
                                            <br />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    ) : 'This doctor has not written any prescriptions'
                }
            </div>
            <br />
            <button onClick={() => {
                if (window.confirm('Deleting will also cancel all this doctor\'s appointments and prescriptions? Proceed?')) {
                    deleteDoctor(45)
                }
            }}>
                Delete doctor
            </button>
        </div>
    );
};

export default Home;