import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { FaEdit, FaEyeSlash, FaRegEye } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import instance from '../../api/AxiosInstance';

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useSearchExport } from '../../context/SearchExportContext';
import SearchInput from '../../components/search/SearchInput';


function TrafficAwarenessVideo() {
    // const [instagram, setinstgram] = useState("");
    // const [facebook, setfacebook] = useState("");
    // const [email, setemail] = useState("");
    // const [whatsapp, setwhatsapp] = useState("");
    // const [linkedin, setlinkedin] = useState("");

    const [title, settitle] = useState("");
    const [mediaurl, setmediaurl] = useState("");

    const [errors, setErrors] = useState({});
    const [showAdd, setShowAdd] = useState(true);
    const [getadmin_data, setadmin_data] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [activeStatus, setActiveStatus] = useState({});

    const { searchQuery, handleSearch } = useSearchExport();

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!title.trim()) errors.title = 'title is required';
        if (!mediaurl.trim()) errors.mediaurl = 'mediaurl is required';


        setErrors(errors);
        return isValid && Object.keys(errors).length === 0;
    };

    const handleForm = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const formData = { title, mediaurl };
            try {
                if (editMode && editId) {
                    await instance.put(`Videos/update-Videos/${editId}`, formData);
                    alert('Data updated successfully!');
                } else {
                    await instance.post('Videos/create-Videos', formData);
                    alert('Data submitted successfully!');
                }
                clearForm();
                getdata_admin();
                setShowAdd(true);
            } catch (error) {
                console.error("Error submitting data:", error);
            }
        }
    };

    const clearForm = () => {
        settitle("");
        setmediaurl("");
        setErrors({});
        setEditMode(false);
        setEditId(null);
    };

    const handleToggle = () => {
        setShowAdd(!showAdd);
        clearForm();
    };

    const getdata_admin = () => {
        instance.get('Videos/find-Videos')
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
            settitle(item.title);
            setmediaurl(title.mediaurl);
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
                            await instance.delete(`Videos/Videos-delete/${id}`);
                            getdata_admin();
                        } catch (error) {
                            console.error("Error deleting data:", error);
                        }
                    }
                },
                { label: 'No' }
            ]
        });
    };

    const toggleActiveStatus = async (id) => {
        try {
            const response = await instance.put(`Videos/Videos-status/${id}`);
            if (response.data) {
                setActiveStatus(prev => ({
                    ...prev,
                    [id]: !prev[id]
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
                                        <tr className="text-center">
                                            <th>Sr. No</th>
                                            <th>Title</th>
                                            <th>Media URL</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getadmin_data.map((a, index) => (
                                            <tr key={index} className="text-center">
                                                <td>{index + 1}</td>
                                                <td className="text-truncate" style={{ maxWidth: '120px' }}>{a.title}</td>
                                                <td className="text-truncate" style={{ maxWidth: '120px' }}>{a.mediaurl}</td>
                                                <td>
                                                    <Button variant="primary" className="m-1" onClick={() => edit(a.id)}>
                                                        <FaEdit />
                                                    </Button>
                                                    <Button variant="danger" className="m-1" onClick={() => delete_data(a.id)}>
                                                        <MdDelete />
                                                    </Button>
                                                    <Button
                                                        variant={activeStatus[a.id] ? "success" : "warning"}
                                                        className="m-1"
                                                        onClick={() => toggleActiveStatus(a.id)}
                                                    >
                                                        {activeStatus[a.id] ? <FaRegEye /> : <FaEyeSlash />}
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
                                        <Form.Label>Enter Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter title"
                                            value={title}
                                            onChange={(e) => settitle(e.target.value)}
                                        />
                                        {errors.title && <span className="error text-danger">{errors.title}</span>}
                                    </Form.Group>
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="formBasicName">
                                        <Form.Label>Enter Media URL</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter media link"
                                            value={mediaurl}
                                            onChange={(e) => setmediaurl(e.target.value)}
                                        />
                                        {errors.mediaurl && <span className="error text-danger">{errors.mediaurl}</span>}
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

export default TrafficAwarenessVideo;


