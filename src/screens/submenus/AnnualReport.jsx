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
import SearchInput from '../../components/search/SearchInput';

function AnnualReport() {
    const [title, setTitle] = useState("");
    const [pdf, setPdf] = useState(null);
    const [preview, setPreview] = useState(null);
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

        if (!title.trim()) {
            errors.title = 'Title is required';
            isValid = false;
        }
        if (!pdf && !editMode) { // Only validate PDF in add mode
            errors.pdf = 'PDF file is required';
            isValid = false;
        } else if (pdf && pdf.type !== 'application/pdf') {
            errors.pdf = 'Only PDF files are allowed';
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
            if (pdf) formData.append('pdf', pdf);

            // Debug: Log the FormData content
            console.log("Form Data Title:", title);
            console.log("Form Data PDF:", pdf);

            try {
                if (editMode && editId) {
                    await instance.put(`thanksto/update-ThanksTo/${editId}`, formData);
                    alert('Data updated successfully!');
                } else {
                    await instance.post('thanksto/create-ThanksTo', formData); // No need for explicit Content-Type header
                    alert('Data submitted successfully!');
                }

                // Clear form and reset state after successful submission
                setTitle("");
                setPdf(null);
                setPreview(null);
                setErrors({});
                setEditMode(false);
                setEditId(null);
                getdata_admin();
                setShowAdd(true); // Show table after form submission
            } catch (error) {
                console.error("Error uploading data:", error.response ? error.response.data : error.message);
            }
        }
    };

    const handlePdfChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setPdf(file);
            setPreview(URL.createObjectURL(file)); // Set preview for PDF (showing file name)
            setErrors({});
        } else {
            setErrors({ pdf: "Only PDF files are allowed." });
            setPdf(null);
            setPreview(null);
        }
    };

    const handleToggle = () => {
        setShowAdd(!showAdd);
        setEditMode(false);
        setTitle("");
        setPdf(null);
        setPreview(null);
        setErrors({});
    };

    const getdata_admin = () => {
        instance.get('thanksto/find-ThanksTo')
            .then((res) => {
                setadmin_data(res.data.responseData || []);
                const initialStatus = {};
                res.data.responseData.forEach(item => {
                    initialStatus[item.id] = item.isActive; // Set initial active status
                });
                setActiveStatus(initialStatus);
            })
            .catch((err) => {
                console.error("Error fetching admin data:", err.response ? err.response.data : err.message);
            });
    };

    useEffect(() => {
        getdata_admin();
    }, []);

    const edit = (id) => {
        const item = getadmin_data.find((a) => a.id === id);
        if (item) {
            setTitle(item.title);
            setPreview(item.pdf); // Assuming 'pdf' contains the file URL or name for preview
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
                            await instance.delete(`thanksto/ThanksTo-delete/${id}`);
                            getdata_admin(); // Refresh the data after deletion
                        } catch (error) {
                            console.error("Error deleting data:", error.response ? error.response.data : error.message);
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

    const toggleActiveStatus = async (id) => {
        try {
            const response = await instance.put(`thanksto/ThanksTo-status/${id}`);
            if (response.data) {
                setActiveStatus(prevStatus => ({
                    ...prevStatus,
                    [id]: !prevStatus[id] // Toggle the isActive status
                }));
            }
        } catch (error) {
            console.error("Error updating status:", error.response ? error.response.data : error.message);
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
                                            <th>Title</th>
                                            <th>PDF</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getadmin_data.map((a, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{a.title}</td>
                                                <td>
                                                    <a href={a.pdf} target="_blank" rel="noopener noreferrer">
                                                        View PDF
                                                    </a>
                                                </td>
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
                                                        {activeStatus[a.id] ? (
                                                            <FaRegEye color="white" />
                                                        ) : (
                                                            <FaEyeSlash color="white" />
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
                                    <Form.Group className="mb-3" controlId="formBasicPdf">
                                        <Form.Label>Upload PDF</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="application/pdf"
                                            onChange={handlePdfChange}
                                        />
                                        {preview && <span>{pdf.name}</span>}
                                        {errors.pdf && <span className="error text-danger">{errors.pdf}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button variant={editMode ? "primary" : "success"} type="submit">
                                {editMode ? "Update" : "Submit"} 
                            </Button>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default AnnualReport;
