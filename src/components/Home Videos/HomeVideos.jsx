import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { FaEdit, FaEyeSlash, FaRegEye } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import instance from '../../api/AxiosInstance';

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useSearchExport } from '../../context/SearchExportContext';
import DataTable from 'react-data-table-component';  // Import DataTable

function HomeVideos() {
    const [title, settitle] = useState("");
    const [mediaurl, setmediaurl] = useState("");
    const [errors, setErrors] = useState({});
    const [showAdd, setShowAdd] = useState(true);
    const [getadmin_data, setadmin_data] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [activeStatus, setActiveStatus] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);  // Default number of rows per page
    const { searchQuery, handleSearch } = useSearchExport();

    const validateForm = () => {
        let errors = {};
        let isValid = true;
        if (!title.trim()) errors.title = 'Title is required';
        if (!mediaurl.trim()) errors.mediaurl = 'Media URL is required';
        setErrors(errors);
        return isValid && Object.keys(errors).length === 0;
    };

    const handleForm = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const formData = { title, mediaurl };
            try {
                if (editMode && editId) {
                    await instance.put(`homeyoutube/update-homeyoutube/${editId}`, formData);
                    alert('Data updated successfully!');
                } else {
                    await instance.post('homeyoutube/create-homeyoutube', formData);
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
        instance.get('homeyoutube/find-homeyoutube')
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
            setmediaurl(item.mediaurl);
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
                            await instance.delete(`homeyoutube/delete-homeyoutube/${id}`);
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
            const response = await instance.put(`homeyoutube/isactive-homeyoutube/${id}`);
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

    const columns = [
        {
            name: 'Sr. No',
            selector: (row, index) => index + 1,
            sortable: false,
        },
        {
            name: 'Title',
            selector: 'title',
            sortable: true,
            cell: row => <div style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.title}</div>
        },
        {
            name: 'Media URL',
            selector: 'mediaurl',
            sortable: true,
            cell: row => <div style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.mediaurl}</div>
        },
        {
            name: 'Action',
            cell: (row) => (
                <div>
                    <Button variant="primary" className="m-1" onClick={() => edit(row.id)}>
                        <FaEdit />
                    </Button>
                    <Button variant="danger" className="m-1" onClick={() => delete_data(row.id)}>
                        <MdDelete />
                    </Button>
                    <Button
                        variant={activeStatus[row.id] ? "success" : "warning"}
                        className="m-1"
                        onClick={() => toggleActiveStatus(row.id)}
                    >
                        {activeStatus[row.id] ? <FaRegEye /> : <FaEyeSlash />}
                    </Button>
                </div>
            ),
        }
    ];

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
                            <DataTable
                                columns={columns}
                                data={getadmin_data}  // Use all data or filtered data if needed
                                pagination
                                responsive
                                striped
                                noDataComponent="No Data Available"
                                onChangePage={(page) => setCurrentPage(page)}
                                onChangeRowsPerPage={(rowsPerPage) => setRowsPerPage(rowsPerPage)}
                                paginationPerPage={rowsPerPage}
                                paginationRowsPerPageOptions={[5, 10, 15, 20]}  // Pagination options
                            />
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
                                            placeholder="Enter Title"
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
                                            placeholder="Enter Media Link"
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

export default HomeVideos;
