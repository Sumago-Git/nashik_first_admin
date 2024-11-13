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
import SearchInput from '../../components/search/SearchInput';
import { useSearchExport } from '../../context/SearchExportContext';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import DataTable from 'react-data-table-component';

function PastEvenets() {
    const [title, setTitle] = useState("");
    const [img, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [showAdd, setShowAdd] = useState(true);
    const [getadmin_data, setadmin_data] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [activeStatus, setActiveStatus] = useState({}); // Track isActive status

    const [eventgallery_data, seteventgallery] = useState([]);

    const [key, setKey] = useState('home');

    const { searchQuery, handleSearch, handleExport, setData, filteredData } =
        useSearchExport();

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!title.trim()) {
            errors.title = 'Title is required';
            isValid = false;
        }
        if (!img && !editMode) { // Only validate image in add mode
            errors.img = 'Image is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleForm = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const formData = new FormData();
            formData.append('title', title);
            if (img) formData.append('img', img);

            try {
                if (editMode && editId) {
                    await instance.put(`PostEvents/update-PostEvents/${editId}`, formData);
                    alert('Data updated successfully!');
                } else {
                    await instance.post('PostEvents/create-PostEvents', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    alert('Data submitted successfully!');
                }

                setTitle("");
                setImage(null);
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setErrors({});
        } else {
            setErrors({ img: "Only image files are allowed." });
            setImage(null);
            setPreview(null);
        }
    };

    const handleToggle = () => {
        setShowAdd(!showAdd);
        setEditMode(false);
        setTitle("");
        setImage(null);
        setPreview(null);
        setErrors({});
    };

    const getdata_admin = () => {
        instance.get('PostEvents/get-PostEvents')
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
        eventgallrydata();
    }, []);

    const edit = (id) => {
        const item = getadmin_data.find((a) => a.id === id);
        if (item) {
            setTitle(item.title);
            setPreview(item.img); // Assuming 'img' contains the URL for preview
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
                            await instance.delete(`PostEvents/PostEvents-delete/${id}`);
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
            const response = await instance.put(`PostEvents/PostEvents-status/${id}`);
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


    //Event Gallery start
    const eventgallrydata = () => {
        instance.get('EventGallary/find-EventGallary')
            .then((res) => {
                seteventgallery(res.data.responseData)
            })
            .catch((err) => {
                console.log(err);
            })
    }


    const handleForm_eventsgallery = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const formData = new FormData();
            formData.append('title', title);
            if (img) formData.append('img', img);

            try {
                if (editMode && editId) {
                    await instance.put(`EventGallary/update-EventGallary/${editId}`, formData);
                    alert('Data updated successfully!');
                } else {
                    await instance.post('EventGallary/create-EventGallary', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    alert('Data submitted successfully!');
                }

                setTitle("");
                setImage(null);
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


    const delete_data_eventgallry = async (id) => {
        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this item?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await instance.delete(`EventGallary/EventGallary-delete/${id}`);
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

    const toggleActiveStatus_eventgalley = async (id) => {
        try {
            const response = await instance.put(`EventGallary/EventGallary-status/${id}`);
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

    const edit_eventgallery = (id) => {
        const item = eventgallery_data.find((a) => a.id === id);
        if (item) {
            setTitle(item.title);
            setPreview(item.img); // Assuming 'img' contains the URL for preview
            setEditMode(true);
            setEditId(id);
            setShowAdd(false); // Show form for editing
        }
    };


    // Special Events -

    const columns = [
        {
            name: 'Sr. No',
            selector: (row, index) => index + 1, // For Sr. No based on the index
            sortable: true,
        },
        {
            name: 'Title',
            selector: (row) => row.title,
            sortable: true,
        },
        {
            name: 'Image',
            selector: (row) => (
                <img
                    src={row.img}
                    className="trademark img-fluid"
                    alt={row.title}
                    height="40"
                    width="120"
                />
            ),
            sortable: false,
        },
        {
            name: 'Action',
            cell: (row) => (
                <div className="p-2">
                    <Button variant="primary" className="m-2" onClick={() => edit(row.id)}>
                        <FaEdit />
                    </Button>
                    <Button variant="danger" className="m-2" onClick={() => delete_data(row.id)}>
                        <MdDelete />
                    </Button>
                    <Button
                        variant={activeStatus[row.id] ? "success" : "warning"} // Button color based on isActive
                        className="m-2"
                        onClick={() => toggleActiveStatus(row.id)}
                    >
                        {/* Conditionally render the icon based on isActive status */}
                        {activeStatus[row.id] ? (
                            <FaRegEye color="white" />  // Green Eye when isActive is true
                        ) : (
                            <FaEyeSlash color="white" />  // Red Eye-slash when isActive is false
                        )}
                    </Button>
                </div>
            ),
            ignoreRowClick: true, // To avoid row click issues with the button
            sortable: false,
        },
    ];

    // Event Gallery

    const columns_eventgallery = [
        {
            name: 'Sr. No',
            selector: (row, index) => index + 1, // For Sr. No based on the index
            sortable: true,
        },
        {
            name: 'Title',
            selector: (row) => row.title,
            sortable: true,
        },
        {
            name: 'Image',
            selector: (row) => (
                <img
                    src={row.img}
                    className="trademark img-fluid"
                    alt={row.title}
                    height="40"
                    width="120"
                />
            ),
            sortable: false,
        },
        {
            name: 'Action',
            cell: (row) => (
                <div className="p-2">
                    <Button variant="primary" className="m-2" onClick={() => edit_eventgallery(row.id)}>
                        <FaEdit />
                    </Button>
                    <Button variant="danger" className="m-2" onClick={() => delete_data_eventgallry(row.id)}>
                        <MdDelete />
                    </Button>
                    <Button
                        variant={activeStatus[row.id] ? "warning" : "success"} // Button color based on isActive
                        className="m-2"
                        onClick={() => toggleActiveStatus_eventgalley(row.id)}
                    >
                        {/* Conditionally render the icon based on isActive status */}
                        {activeStatus[row.id] ? (
                            <FaEyeSlash color="white" />  // Green Eye when isActive is true
                        ) : (
                            <FaRegEye color="white" /> // Red Eye-slash when isActive is false
                        )}
                    </Button>
                </div>
            ),
            ignoreRowClick: true, // To avoid row click issues with the button
            sortable: false,
        },
    ];
    return (
        <>
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
            >
                <Tab eventKey="home" title="Special Events">
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

                                        <DataTable
                                            columns={columns}
                                            data={filteredData.length > 0 ? filteredData : getadmin_data}
                                            pagination
                                            responsive
                                            striped
                                            noDataComponent="No Data Available"
                                            onChangePage={(page) => setCurrentPage(page)}
                                            onChangeRowsPerPage={(rowsPerPage) => setRowsPerPage(rowsPerPage)}
                                        />
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
                                                    placeholder="Enter Name"
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                />
                                                {errors.title && <span className="error text-danger">{errors.title}</span>}
                                            </Form.Group>
                                        </Col>
                                        <Col lg={6} md={6} sm={12}>
                                            <Form.Group className="mb-3" controlId="formBasicImage">
                                                <Form.Label>Upload Image</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                                {errors.img && <span className="error text-danger">{errors.img}</span>}
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
                </Tab>


                <Tab eventKey="profile" title="Event Gallary">
                    <Card>
                        <Card.Header className="d-flex justify-content-end">
                            <Button variant={editMode ? "primary" : "success"} onClick={handleToggle}>
                                {showAdd ? 'Add' : 'View'}
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            {/* <Card.Title>Special title treatment</Card.Title> */}
                            <Card.Text>
                                {showAdd ? (
                                    eventgallery_data.length > 0 ? (
                                        <>
                                            {/* <SearchInput value={searchQuery} onChange={handleSearch} /> */}

                                            <DataTable
                                                columns={columns_eventgallery}
                                                data={filteredData.length > 0 ? filteredData : eventgallery_data}
                                                pagination
                                                responsive
                                                striped
                                                noDataComponent="No Data Available"
                                                onChangePage={(page) => setCurrentPage(page)}
                                                onChangeRowsPerPage={(rowsPerPage) => setRowsPerPage(rowsPerPage)}
                                            />
                                        </>
                                    ) : (
                                        <Alert variant="warning" className="text-center">
                                            No data found
                                        </Alert>
                                    )
                                ) : (
                                    <Form onSubmit={handleForm_eventsgallery}>
                                        <Row>
                                            <Col lg={6} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formBasicName">
                                                    <Form.Label>Enter Title</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter Name"
                                                        value={title}
                                                        onChange={(e) => setTitle(e.target.value)}
                                                    />
                                                    {errors.title && <span className="error text-danger">{errors.title}</span>}
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6} md={6} sm={12}>
                                                <Form.Group className="mb-3" controlId="formBasicImage">
                                                    <Form.Label>Upload Image</Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />
                                                    {errors.img && <span className="error text-danger">{errors.img}</span>}
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Button variant={editMode ? "primary" : "success"} type="submit">
                                            {editMode ? 'Update' : 'Submit'}
                                        </Button>
                                    </Form>
                                )}
                            </Card.Text>

                        </Card.Body>
                    </Card>
                </Tab>

            </Tabs>

        </>
    );
}

export default PastEvenets;
