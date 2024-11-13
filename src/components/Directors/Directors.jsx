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

function Directors() {
    const [designation, setdesignation] = useState("");
    const [name, setname] = useState("");


    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [showAdd, setShowAdd] = useState(true);
    const [getadmin_data, setadmin_data] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [activeStatus, setActiveStatus] = useState({}); // Track isActive status

    const { searchQuery, handleSearch, handleExport, setData, filteredData } =
        useSearchExport();

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!designation.trim()) {
            errors.designation = 'designation is required';
            isValid = false;
        }
        if (!name.trim()) {
            errors.name = 'Name is required';
            isValid = false;
        }


        setErrors(errors);
        return isValid;
    };

    const handleForm = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const formData = new FormData();
            formData.append('designation', designation);
            formData.append('name', name);


            try {
                if (editMode && editId) {
                    await instance.put(`Directors/update-Directors/${editId}`, formData);
                    alert('Data updated successfully!');
                } else {
                    await instance.post('Directors/create-Directors', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    alert('Data submitted successfully!');
                }

                setdesignation('')
                setname('')

                setPreview(null);
                setErrors({});
                setEditMode(false);
                setEditId(null);
                getdata_admin();
                setShowAdd(true); // Show table after form submission
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }
    };

    // const handleImageChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file && file.type.startsWith("image/")) {
    //         setImage(file);
    //         setPreview(URL.createObjectURL(file));
    //         setErrors({});
    //     } else {
    //         setErrors({ img: "Only image files are allowed." });
    //         setImage(null);
    //         setPreview(null);
    //     }
    // };

    const handleToggle = () => {
        setShowAdd(!showAdd);
        setEditMode(false);
        setdesignation("");
        setname("");
        setPreview(null);
        setErrors({});
    };

    const getdata_admin = () => {
        instance.get('Directors/find-Directors')
            .then((res) => {
                setadmin_data(res.data.responseData || []);
                const initialStatus = {};
                res.data.responseData.forEach(item => {
                    initialStatus[item.id] = item.isActive; // Set the initial status for each item
                });
                setActiveStatus(initialStatus); // Set active status state
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        getdata_admin();
    }, []);

    const edit = (id) => {
        const item = getadmin_data.find((a) => a.id === id);
        if (item) {
            setdesignation(item.designation);
            setname(item.name)
            setEditMode(true);
            setEditId(id);
            setShowAdd(false); // Show form for editing
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
                            await instance.delete(`Directors/Directors-delete/${id}`);
                            getdata_admin(); // Refresh the data after deletion
                        } catch (error) {
                            console.error("Error deleting data:", error);
                            alert("There was an error deleting the data.");
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => { } // Do nothing if user clicks "No"
                }
            ]
        });
    };

    const toggleActiveStatus = async (id) => {
        try {
            const response = await instance.put(`Directors/Directors-status/${id}`);
            if (response.data) {
                setActiveStatus(prevStatus => ({
                    ...prevStatus,
                    [id]: !prevStatus[id] // Toggle the isActive status
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
                                            <th>Designation</th>
                                            <th>Name</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getadmin_data.map((a, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{a.designation}</td>
                                                <td>{a.name}</td>

                                                <td className="p-2">
                                                    <Button variant="primary" className="m-2" onClick={() => edit(a.id)}>
                                                        <FaEdit />
                                                    </Button>
                                                    <Button variant="danger" className="m-2" onClick={() => delete_data(a.id)}><MdDelete /></Button>
                                                    <Button
                                                        variant={activeStatus[a.id] ? "success" : "warning"} // Button color based on isActive
                                                        className="m-2"
                                                        onClick={() => toggleActiveStatus(a.id)}
                                                    >
                                                        {/* Conditionally render the icon based on isActive status */}
                                                        {activeStatus[a.id] ? (
                                                            <FaRegEye color="white" />  // Green Eye when isActive is true
                                                        ) : (
                                                            <FaEyeSlash color="white" />  // Red Eye-slash when isActive is false
                                                        )}
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
                                        <Form.Label>Enter Destination</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter destination"
                                            value={designation}
                                            onChange={(e) => setdesignation(e.target.value)}
                                        />
                                        {errors.designation && <span className="error text-danger">{errors.designation}</span>}
                                    </Form.Group>
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="formBasicName">
                                        <Form.Label>Enter Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Name"
                                            value={name}
                                            onChange={(e) => setname(e.target.value)}
                                        />
                                        {errors.designation && <span className="error text-danger">{errors.designation}</span>}
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

export default Directors;