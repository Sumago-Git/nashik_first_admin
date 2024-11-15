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

import DataTable from 'react-data-table-component';


function UpcommingEvents() {
    // const [title, setTitle] = useState("");
    const [img, setImage] = useState(null);

    const [purpose, setpurpose] = useState('');
    const [fromdate, setfromdate] = useState('');
    const [todate, settodate] = useState('');
    const [area, setarea] = useState('');




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

        if (!purpose.trim()) {
            errors.purpose = 'purpose is required';
            isValid = false;
        }
        if (!fromdate.trim()) {
            errors.fromdate = 'fromdate is required';
            isValid = false;
        }
        if (!todate.trim()) {
            errors.todate = 'todate is required';
            isValid = false;
        }
        if (!area.trim()) {
            errors.area = 'area is required';
            isValid = false;
        }
        if (!img && !editMode) { // Only validate image in add mode
            errors.img = 'Image is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    // const handleForm = async (e) => {
    //     e.preventDefault();

    //     if (validateForm()) {
    //         const formData = new FormData();
    //         formData.append('purpose', purpose);
    //         formData.append('area', area);
    //         formData.append('fromdate', fromdate);
    //         formData.append('todate', todate);
    //         if (img) formData.append('img', img);

    //         try {
    //             if (editMode && editId) {
    //                 await instance.put(`Upcomming/update-Upcomming/${editId}`, formData);
    //                 alert('Data updated successfully!');
    //             } else {
    //                 await instance.post('Upcomming/create-Upcomming', formData, {
    //                     headers: { 'Content-Type': 'multipart/form-data' }
    //                 });
    //                 alert('Data submitted successfully!');
    //             }

    //             setTitle("");
    //             setImage(null);
    //             setPreview(null);
    //             setErrors({});
    //             setEditMode(false);
    //             setEditId(null);
    //             getdata_admin();
    //             setShowAdd(true); // Show table after form submission
               
    //         } catch (error) {
    //             console.error("Error uploading image:", error);
    //         }
    //     }
    // };

    const handleForm = async (e) => {
        e.preventDefault();
    
        if (validateForm()) {
            const formData = new FormData();
            formData.append('purpose', purpose);
            formData.append('area', area);
            formData.append('fromdate', fromdate);
            formData.append('todate', todate);
            if (img) formData.append('img', img);
    
            try {
                if (editMode && editId) {
                    await instance.put(`Upcomming/update-Upcomming/${editId}`, formData);
                    alert('Data updated successfully!');
                } else {
                    await instance.post('Upcomming/create-Upcomming', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    alert('Data submitted successfully!');
                }
    
                // Clear form fields
                setpurpose("");
                setarea("");
                setfromdate("");
                settodate("");
                setImage(null);
                setPreview(null);
                setErrors({});
    
                // Reset edit mode and ID
                setEditMode(false);
                setEditId(null);
    
                // Fetch updated data and switch to table view
                getdata_admin();
                setShowAdd(true); // Switch to table view after form submission
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
        instance.get('Upcomming/find-Upcomming')
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
            setpurpose(item.purpose);
            setarea(item.area);
            setfromdate(item.fromdate);
            settodate(item.todate);
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
                            await instance.delete(`Upcomming/Upcomming-delete/${id}`);
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
            const response = await instance.put(`Upcomming/Upcomming-status/${id}`);
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

    const columns = [
        {
            name: 'Sr. No',
            selector: (row, index) => index + 1,
            sortable: true
        },
        {
            name: 'Area',
            selector: row => row.area,
            sortable: true
        },
        {
            name: 'Time Duration',
            selector: row => `${row.fromdate} To ${row.todate}`,
            sortable: true
        },
        {
            name: 'Purpose of the Campaign',
            selector: row => row.purpose,
            sortable: true
        },
        {
            name: 'Image',
            cell: row => (
                <img
                    src={row.img}
                    className="trademark img-fluid"
                    alt={row.title}
                    height="40"
                    width="120"
                />
            ),
            sortable: false
        },
        {
            name: 'Action',
            cell: row => (
                <div>
                    <Button variant="primary" className="m-2" onClick={() => edit(row.id)}>
                        <FaEdit />
                    </Button>
                    <Button variant="danger" className="m-2" onClick={() => delete_data(row.id)}>
                        <MdDelete />
                    </Button>
                    <Button
                        variant={activeStatus[row.id] ? "success" : "warning"}
                        className="m-2"
                        onClick={() => toggleActiveStatus(row.id)}
                    >
                        {activeStatus[row.id] ? (
                            <FaRegEye color="white" />
                        ) : (
                            <FaEyeSlash color="white" />
                        )}
                    </Button>
                </div>
            ),
            sortable: false
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
                                        <Form.Label>Select From Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            placeholder="Enter date"
                                            value={fromdate}
                                            onChange={(e) => setfromdate(e.target.value)}
                                        />
                                        {errors.fromdate && <span className="error text-danger">{errors.fromdate}</span>}
                                    </Form.Group>
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="formBasicImage">
                                        <Form.Label>Select To Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={todate}
                                            onChange={(e) => settodate(e.target.value)}
                                        />
                                        {errors.todate && <span className="error text-danger">{errors.todate}</span>}
                                    </Form.Group>
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="formBasicName">
                                        <Form.Label>Enter Purpose</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Purpose"
                                            value={purpose}
                                            onChange={(e) => setpurpose(e.target.value)}
                                        />
                                        {errors.purpose && <span className="error text-danger">{errors.purpose}</span>}
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
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="formBasicName">
                                        <Form.Label>Enter Area</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter area"
                                            value={area}
                                            onChange={(e) => setarea(e.target.value)}
                                        />
                                        {errors.area && <span className="error text-danger">{errors.area}</span>}
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

export default UpcommingEvents;
