import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toast, ToastContainer } from 'react-bootstrap';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        country: '',
        state: '',
        msg: ''
    });

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [errors, setErrors] = useState({});
    const [submittedData, setSubmittedData] = useState(null);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        axios.get('https://countriesnow.space/api/v0.1/countries')
            .then(response => setCountries(response.data.data))
            .catch(error => console.error('Error fetching countries:', error));
    }, []);

    useEffect(() => {
        if (formData.country) {
            axios.get(`https://countriesnow.space/api/v0.1/countries/states/q?country=${formData.country}`)
                .then(response => setStates(response.data.data.states || []))
                .catch(error => console.error('Error fetching states:', error));
        } else {
            setStates([]);
        }
    }, [formData.country]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.country) newErrors.country = 'Country is required';
        if (!formData.state) newErrors.state = 'State is required';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length === 0) {
            setSubmittedData(formData);
            setErrors({});
            setShowToast(true); 
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className="container" style={{ backgroundColor: 'black', height: '150vh' }}>
            <h1 className="text-center mb-4 text-white">Contact Form</h1>
            <form className="p-4 border rounded shadow" onSubmit={handleSubmit} style={{ backgroundColor: 'black' }}>
                <div className="mb-3">
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className={`form-control ${errors.name ? 'is-invalid' : ''} mb-2`}
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''} mb-2`}
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>

                <div className="mb-3">
                    <textarea
                        id="address"
                        name="address"
                        className={`form-control ${errors.address ? 'is-invalid' : ''} mb-2`}
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                    ></textarea>
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>

                <div className="mb-3">
                    <select
                        id="country"
                        name="country"
                        className={`form-select ${errors.country ? 'is-invalid' : ''} mb-2`}
                        value={formData.country}
                        onChange={handleChange}
                    >
                        <option value="">Select a country</option>
                        {countries.map((country, index) => (
                            <option key={index} value={country.country}>{country.country}</option>
                        ))}
                    </select>
                    {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                </div>

                <div className="mb-3">
                    <select
                        id="state"
                        name="state"
                        className={`form-select ${errors.state ? 'is-invalid' : ''} mb-2`}
                        value={formData.state}
                        onChange={handleChange}
                        disabled={!states.length}
                    >
                        <option value="">Select a state</option>
                        {states.map((state, index) => (
                            <option key={index} value={state.name}>{state.name}</option>
                        ))}
                    </select>
                    {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        id="msg"
                        name="msg"
                        className="form-control mb-2"
                        placeholder="Msg (Optional)"
                        value={formData.msg}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">Submit</button>
            </form>

            {/* Submitted Data Section */}
            {submittedData && (
                <div className="mt-5 p-4 border rounded shadow" style={{ backgroundColor: 'black' }}>
                    <h3 className="text-center text-white">Submitted Data</h3>
                    <pre className="bg-light p-3 rounded border">{JSON.stringify(submittedData, null, 2)}</pre>
                </div>
            )}

            {/* Toast Container for Success Notification */}
            <ToastContainer position="bottom-center" className="p-3">
                <Toast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={3000}
                    autohide
                    style={{ backgroundColor: '#28a745', color: 'white' }} 
                >
                    <Toast.Body>Form submitted successfully!</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default ContactForm;
