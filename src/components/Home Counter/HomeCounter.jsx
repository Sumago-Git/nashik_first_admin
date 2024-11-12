import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { FaEdit, FaRegEye, FaEyeSlash } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import instance from '../../api/AxiosInstance';

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useSearchExport } from '../../context/SearchExportContext';
import SearchInput from '../search/SearchInput';

function HomeCounter() {
    const [training_imparted, settraining_imparted] = useState("");
    const [lives_changed, setlives_changed] = useState("");
    const [children, setchildren] = useState("");
    const [adult, setadult] = useState("");
    const [errors, setErrors] = useState({});
    const [showAdd, setShowAdd] = useState(true);
    const [getadmin_data, setadmin_data] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [activeStatus, setActiveStatus] = useState({});

    const { searchQuery, handleSearch } = useSearchExport();

    // Validate Form
    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!training_imparted.trim()) {
            errors.training_imparted = 'Training imparted is required';
            isValid = false;
        }
        if (!lives_changed.trim()) {
            errors.lives_changed = 'Lives changed is required';
            isValid = false;
        }
        if (!children.trim()) {
            errors.children = 'Children count is required';
            isValid = false;
        }
        if (!adult.trim()) {
            errors.adult = 'Adult count is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    // Form submission
    const handleForm = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const formData = {
                training_imparted,
                lives_changed,
                children,
                adult
            };

            try {
                if (editMode && editId) {
                    // PUT request to update the data
                    await instance.put(`counter/update-homecounter/${editId}`, formData);
                    alert('Data updated successfully!');
                } else {
                    // POST request to create new data
                    await instance.post('counter/create-homecounter', formData);
                    alert('Data submitted successfully!');
                }

                // Clear form fields after submission
                settraining_imparted("");
                setchildren("");
                setadult("");
                setlives_changed("");
                setErrors({});
                setEditMode(false);
                setEditId(null);
                getdata_admin(); // Refresh data after submit
                setShowAdd(true); // Show table again after submission
            } catch (error) {
                console.error("Error submitting data:", error);
                alert("There was an error submitting the data.");
            }
        }
    };

    // Toggle add/view form
    const handleToggle = () => {
        setShowAdd(!showAdd);
        setEditMode(false);
        settraining_imparted("");
        setchildren("");
        setadult("");
        setlives_changed("");
        setErrors({});
    };

    // Fetch admin data
    const getdata_admin = () => {
        instance.get('counter/find-homecounter')
            .then((res) => {
                setadmin_data(res.data.responseData || []);
                const initialStatus = {};
                res.data.responseData.forEach(item => {
                    initialStatus[item.id] = item.isActive;
                });
                setActiveStatus(initialStatus);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        getdata_admin();
    }, []);

    // Edit data
    const edit = (id) => {
        const item = getadmin_data.find((a) => a.id === id);
        if (item) {
            settraining_imparted(item.training_imparted);
            setchildren(item.children);
            setadult(item.adult);
            setlives_changed(item.lives_changed);
            setEditMode(true);
            setEditId(id);
            setShowAdd(false);
        }
    };

    // Delete data
    const delete_data = async (id) => {
        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this item?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await instance.delete(`counter/delete-homecounter/${id}`);
                            getdata_admin(); // Refresh data after deletion
                        } catch (error) {
                            console.error("Error deleting data:", error);
                            alert("There was an error deleting the data.");
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => {} // Do nothing if user clicks "No"
                }
            ]
        });
    };

    // Toggle active status
    const toggleActiveStatus = async (id) => {
        try {
            const response = await instance.put(`counter/isactive-homecounter/${id}`);
            if (response.data) {
                setActiveStatus(prevStatus => ({
                    ...prevStatus,
                    [id]: !prevStatus[id]
                }));
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <Container>
            <Card>
                <Card.Header className="d-flex justify-content-end">
                    <Button variant={editMode ? "primary" : "success"} onClick={handleToggle}>
                        {showAdd ? 'Add' : 'View'}
                    </Button>
                </Card.Header>
                <Card.Body>
                    {showAdd ? (
                        getadmin_data.length > 0 ? (
                            <>
                                {/* <SearchInput value={searchQuery} onChange={handleSearch} /> */}
                                <Table striped bordered hover responsive="sm">
                                    <thead>
                                        <tr>
                                            <th>Sr. No</th>
                                            <th>Training Imparted</th>
                                            <th>Lives Changed</th>
                                            <th>Children</th>
                                            <th>Adult</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getadmin_data.map((a, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{a.training_imparted}</td>
                                                <td>{a.lives_changed}</td>
                                                <td>{a.children}</td>
                                                <td>{a.adult}</td>
                                                <td className="p-2">
                                                    <Button variant="primary" className="m-2" onClick={() => edit(a.id)}>
                                                        <FaEdit />
                                                    </Button>
                                                    <Button variant="danger" className="m-2" onClick={() => delete_data(a.id)}>
                                                        <MdDelete />
                                                    </Button>
                                                    <Button
                                                        variant={activeStatus[a.id] ? "success" : "warning"}
                                                        className="m-2"
                                                        onClick={() => toggleActiveStatus(a.id)}
                                                    >
                                                        {activeStatus[a.id] ? <FaRegEye color="white" /> : <FaEyeSlash color="white" />}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </>
                        ) : (
                            <Alert variant="warning" className="text-center">
                                No data found
                            </Alert>
                        )
                    ) : (
                        <Form onSubmit={handleForm}>
                            <Row>
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="formBasicTrainingImparted">
                                        <Form.Label>Enter Training Imparted</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter Training Imparted"
                                            value={training_imparted}
                                            onChange={(e) => settraining_imparted(e.target.value)}
                                        />
                                        {errors.training_imparted && <span className="error text-danger">{errors.training_imparted}</span>}
                                    </Form.Group>
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="formBasicLivesChanged">
                                        <Form.Label>Enter Lives Changed</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter Lives Changed"
                                            value={lives_changed}
                                            onChange={(e) => setlives_changed(e.target.value)}
                                        />
                                        {errors.lives_changed && <span className="error text-danger">{errors.lives_changed}</span>}
                                    </Form.Group>
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="formBasicChildren">
                                        <Form.Label>Enter Children</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter Children"
                                            value={children}
                                            onChange={(e) => setchildren(e.target.value)}
                                        />
                                        {errors.children && <span className="error text-danger">{errors.children}</span>}
                                    </Form.Group>
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="formBasicAdult">
                                        <Form.Label>Enter Adult</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter Adult"
                                            value={adult}
                                            onChange={(e) => setadult(e.target.value)}
                                        />
                                        {errors.adult && <span className="error text-danger">{errors.adult}</span>}
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={12} sm={12} className="text-center">
                                    <Button type="submit" variant="primary">
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default HomeCounter;
