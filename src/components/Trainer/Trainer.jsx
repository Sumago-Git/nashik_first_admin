import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

function Trainer() {
    const [name, setName] = useState("");
    const [emailId, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [isFormVisible, setIsFormVisible] = useState(false); // State to toggle form visibility
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        // Validate Name
        if (!name.trim()) {
            errors.name = 'Name is required';
            isValid = false;
        }

        // Validate Email
        if (!emailId.trim()) {
            errors.emailId = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(emailId)) {
            errors.emailId = 'Invalid email address';
            isValid = false;
        }

        // Validate Mobile Number
        if (!mobileNumber) {
            errors.mobileNumber = 'Mobile number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(mobileNumber)) {
            errors.mobileNumber = 'Mobile number must be exactly 10 digits';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleForm = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const formData = {
                name,
                emailId,
                mobileNumber
            };

            console.log("Form Data:", formData);
            alert("Data Submitted Successfully");

            // Reset the form fields
            setName('');
            setEmail('');
            setMobileNumber('');
            setIsFormVisible(false); // Hide form after successful submission
        }
    };

    return (
        <Card>
            <Card.Header className="d-flex justify-content-end">
                <Button variant="primary" onClick={() => setIsFormVisible(!isFormVisible)}>
                    {isFormVisible ? 'View' : 'Add'} {/* Toggle between 'Add' and 'View' */}
                </Button>
            </Card.Header>

            <Card.Body>
                {isFormVisible ? ( // Check if form should be visible
                    <Card.Text>
                        <Form onSubmit={handleForm}>
                            <Row>
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="formBasicName">
                                        <Form.Label>Trainer Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        {errors.name && <span className="error text-danger">{errors.name}</span>}
                                    </Form.Group>
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="formBasicMobile">
                                        <Form.Label>Mobile Number</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter mobile number"
                                            value={mobileNumber}
                                            onChange={(e) => setMobileNumber(e.target.value)}
                                        />
                                        {errors.mobileNumber && <span className="error text-danger">{errors.mobileNumber}</span>}
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={12} sm={12}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Email ID</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="name@example.com"
                                            value={emailId}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        {errors.emailId && <span className="error text-danger">{errors.emailId}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button variant="primary" type="submit">Submit</Button>
                        </Form>
                    </Card.Text>
                ) : (
                    // Display the "View" button or message when form is not visible
                    <Card.Text>
                        <Alert variant="info">
                            Trainer details are currently hidden. Click 'Add' to view or add information.
                        </Alert>
                    </Card.Text>
                )}
            </Card.Body>
        </Card>
    );
}

export default Trainer;
