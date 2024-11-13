import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { FaEdit, FaEye, FaEyeSlash, FaRegEye } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import instance from '../../api/AxiosInstance';

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useSearchExport } from '../../context/SearchExportContext';
import SearchInput from '../search/SearchInput';

function Trainer() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [errors, setErrors] = useState({});
    const [showAdd, setShowAdd] = useState(true);
    const [getadmin_data, setadmin_data] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [activeStatus, setActiveStatus] = useState({});

    const { searchQuery, handleSearch, handleExport, setData, filteredData } = useSearchExport();

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!name.trim()) {
            errors.name = 'Name is required';
            isValid = false;
        }
        if (!email.trim()) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            errors.email = 'Enter a valid email address';
            isValid = false;
        }
        if (!mobile.trim()) {
            errors.mobile = 'Mobile number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(mobile)) {
            errors.mobile = 'Enter a valid 10-digit mobile number';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleForm = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const formData = { name, email, mobile };

            try {
                if (editMode && editId) {
                    await instance.put(`trainer/trainer/${editId}`, formData);
                    alert('Data updated successfully!');
                } else {
                    await instance.post('trainer/create-trainer', formData);
                    alert('Data submitted successfully!');
                }

                setName("");
                setEmail("");
                setMobile("");
                setErrors({});
                setEditMode(false);
                setEditId(null);
                getdata_admin();
                setShowAdd(true);
            } catch (error) {
                console.error("Error uploading data:", error);
            }
        }
    };

    const handleToggle = () => {
        setShowAdd(!showAdd);
        setEditMode(false);
        setName("");
        setEmail("");
        setMobile("");
        setErrors({});
    };

    const getdata_admin = () => {
        instance.get('trainer/get-trainers')
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

    const edit = (id) => {
        const item = getadmin_data.find((a) => a.id === id);
        if (item) {
            setName(item.name);
            setEmail(item.email);
            setMobile(item.mobile);
            setEditMode(true);
            setEditId(id);
            setShowAdd(false);
        }
    };

    const delete_data = async (id) => {
        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this item?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await instance.delete(`trainer/toggle-delete-trainer/${id}`);
                            getdata_admin();
                        } catch (error) {
                            console.error("Error deleting data:", error);
                            alert("There was an error deleting the data.");
                        }
                    }
                },
                { label: 'No', onClick: () => {} }
            ]
        });
    };

    const toggleActiveStatus = async (id) => {
        try {
            const response = await instance.put(`trainer/toggle-active-trainer/${id}`);
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
                                <SearchInput value={searchQuery} onChange={handleSearch} />
                                <Table striped bordered hover responsive="sm">
                                    <thead>
                                        <tr>
                                            <th>Sr. No</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Mobile</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getadmin_data.map((a, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{a.name}</td>
                                                <td>{a.email}</td>
                                                <td>{a.mobile}</td>
                                                <td className="p-2">
                                                    <Button variant="primary" className="m-2" onClick={() => edit(a.id)}>
                                                        <FaEdit />
                                                    </Button>
                                                    <Button variant="danger" className="m-2" onClick={() => delete_data(a.id)}><MdDelete /></Button>
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
                                    <Form.Group className="mb-3" controlId="formBasicName">
                                        <Form.Label>Enter Name</Form.Label>
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
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Enter Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        {errors.email && <span className="error text-danger">{errors.email}</span>}
                                    </Form.Group>
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="formBasicMobile">
                                        <Form.Label>Enter Mobile</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Mobile"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                        />
                                        {errors.mobile && <span className="error text-danger">{errors.mobile}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button variant={editMode ? "primary" : "success"} type="submit">
                                {editMode ? 'Update' : 'Submit'}
                            </Button>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Trainer;