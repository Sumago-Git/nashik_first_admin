import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { FaEdit, FaRegEye, FaEyeSlash } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import instance from '../../api/AxiosInstance';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useSearchExport } from '../../context/SearchExportContext';
import SearchInput from '../search/SearchInput';
import DataTable from 'react-data-table-component';  // Import DataTable

function FollowonUs() {
    const [instagram, setInstagram] = useState("");
    const [facebook, setFacebook] = useState("");
    const [email, setEmail] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [linkedin, setLinkedin] = useState("");

    const [errors, setErrors] = useState({});
    const [showAdd, setShowAdd] = useState(true);
    const [getAdminData, setAdminData] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [activeStatus, setActiveStatus] = useState({});

    const { searchQuery, handleSearch } = useSearchExport();
    const [filteredData, setFilteredData] = useState(getAdminData);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!instagram.trim()) errors.instagram = 'Instagram link is required';
        if (!facebook.trim()) errors.facebook = 'Facebook link is required';
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Valid email is required';
        if (!whatsapp.trim()) errors.whatsapp = 'WhatsApp link is required';
        if (!linkedin.trim()) errors.linkedin = 'LinkedIn link is required';

        setErrors(errors);
        return isValid && Object.keys(errors).length === 0;
    };

    const handleForm = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const formData = { instagram, facebook, email, whatsapp, linkedin };
            try {
                if (editMode && editId) {
                    await instance.put(`social-contact/socialcontact/${editId}`, formData);
                    alert('Data updated successfully!');
                } else {
                    await instance.post('social-contact/create-socialcontact', formData);
                    alert('Data submitted successfully!');
                }
                clearForm();
                getDataAdmin();
                setShowAdd(true);
            } catch (error) {
                console.error("Error submitting data:", error);
            }
        }
    };

    const clearForm = () => {
        setInstagram("");
        setFacebook("");
        setEmail("");
        setWhatsapp("");
        setLinkedin("");
        setErrors({});
        setEditMode(false);
        setEditId(null);
    };

    const handleToggle = () => {
        setShowAdd(!showAdd);
        clearForm();
    };

    const getDataAdmin = () => {
        instance.get('social-contact/find-socialcontacts')
            .then((res) => {
                setAdminData(res.data.responseData || []);
                const initialStatus = {};
                res.data.responseData.forEach(item => {
                    initialStatus[item.id] = item.isActive;
                });
                setActiveStatus(initialStatus);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        getDataAdmin();
    }, []);

    const edit = (id) => {
        const item = getAdminData.find((a) => a.id === id);
        if (item) {
            setInstagram(item.instagram);
            setFacebook(item.facebook);
            setEmail(item.email);
            setWhatsapp(item.whatsapp);
            setLinkedin(item.linkedin);
            setEditMode(true);
            setEditId(id);
            setShowAdd(false);
        }
    };

    const deleteData = async (id) => {
        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this item?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await instance.delete(`social-contact/isdelete-social/${id}`);
                            getDataAdmin();
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
            const response = await instance.put(`social-contact/isactive-social/${id}`);
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

    // Columns for DataTable
    const columns = [
        {
            name: 'Sr. No',
            selector: (row, index) => index + 1,
            width: '60px',
        },
        {
            name: 'Instagram',
            selector: row => row.instagram,
            width: '150px',
        },
        {
            name: 'Facebook',
            selector: row => row.facebook,
            width: '150px',
        },
        {
            name: 'Email',
            selector: row => row.email,
            width: '200px',
        },
        {
            name: 'WhatsApp',
            selector: row => row.whatsapp,
            width: '150px',
        },
        {
            name: 'LinkedIn',
            selector: row => row.linkedin,
            width: '150px',
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="d-flex">
                    <Button variant="primary" className="m-1" onClick={() => edit(row.id)}>
                        <FaEdit />
                    </Button>
                    <Button variant="danger" className="m-1" onClick={() => deleteData(row.id)}>
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
            width: '200px',
        },
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
                        getAdminData.length > 0 ? (
                            <>
                                {/* <SearchInput value={searchQuery} onChange={handleSearch} /> */}
                                <DataTable
                                    columns={columns}
                                    data={filteredData.length > 0 ? filteredData : getAdminData}
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
                                {/* Form fields */}
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="instagram">
                                        <Form.Label>Instagram</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Instagram link"
                                            value={instagram}
                                            onChange={(e) => setInstagram(e.target.value)}
                                        />
                                        {errors.instagram && <span className="error text-danger">{errors.instagram}</span>}
                                    </Form.Group>
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="facebook">
                                        <Form.Label>Facebook</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Facebook link"
                                            value={facebook}
                                            onChange={(e) => setFacebook(e.target.value)}
                                        />
                                        {errors.facebook && <span className="error text-danger">{errors.facebook}</span>}
                                    </Form.Group>
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="email">
                                        <Form.Label>Email</Form.Label>
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
                                    <Form.Group className="mb-3" controlId="whatsapp">
                                        <Form.Label>WhatsApp</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter WhatsApp link"
                                            value={whatsapp}
                                            onChange={(e) => setWhatsapp(e.target.value)}
                                        />
                                        {errors.whatsapp && <span className="error text-danger">{errors.whatsapp}</span>}
                                    </Form.Group>
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="linkedin">
                                        <Form.Label>LinkedIn</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter LinkedIn link"
                                            value={linkedin}
                                            onChange={(e) => setLinkedin(e.target.value)}
                                        />
                                        {errors.linkedin && <span className="error text-danger">{errors.linkedin}</span>}
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

export default FollowonUs;
