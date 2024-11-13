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
import SearchInput from '../../components/search/SearchInput';
import DataTable from 'react-data-table-component';

function ContactInfo() {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [errors, setErrors] = useState({});
    const [showAdd, setShowAdd] = useState(true);
    const [getadmin_data, setadmin_data] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [activeStatus, setActiveStatus] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { searchQuery, handleSearch, handleExport, setData, filteredData } = useSearchExport();

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!email.trim()) {
            errors.email = 'Email is required';
            isValid = false;
        }
        if (!phone.trim()) {
            errors.phone = 'Phone number is required';
            isValid = false;
        }
        if (!address.trim()) {
            errors.address = 'Address is required';
            isValid = false;
        }
        if (!whatsapp.trim()) {
            errors.whatsapp = 'Whatsapp number is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleForm = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const formData = {
                email,
                phone,
                address,
                whatsapp
            };

            try {
                if (editMode && editId) {
                    await instance.put(`contact-detail/update-contactdetails/${editId}`, formData);
                    alert('Data updated successfully!');
                } else {
                    await instance.post('contact-detail/create-contactdetails', formData);
                    alert('Data submitted successfully!');
                }

                setEmail("");
                setPhone("");
                setAddress("");
                setWhatsapp("");
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
        setEmail("");
        setPhone("");
        setAddress("");
        setWhatsapp("");
        setErrors({});
    };

    const getdata_admin = () => {
        instance.get('contact-detail/find-contactdetails')
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
            setEmail(item.email);
            setPhone(item.phone);
            setAddress(item.address);
            setWhatsapp(item.whatsapp);
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
                            await instance.delete(`contact-detail/isdelete-contact/${id}`);
                            getdata_admin();
                        } catch (error) {
                            console.error("Error deleting data:", error);
                            alert("There was an error deleting the data.");
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    };

    const toggleActiveStatus = async (id) => {
        try {
            const response = await instance.put(`contact-detail/isactive-contact/${id}`);
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

    // Define columns for the DataTable
    const columns = [
        {
            name: 'Sr. No',
            selector: (row, index) => index + 1,
            sortable: true
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true
        },
        {
            name: 'Phone',
            selector: row => row.phone,
            sortable: true
        },
        {
            name: 'Address',
            selector: row => row.address,
            sortable: true
        },
        {
            name: 'Whatsapp',
            selector: row => row.whatsapp,
            sortable: true
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
                        {activeStatus[row.id] ? <FaRegEye color="white" /> : <FaEyeSlash color="white" />}
                    </Button>
                </div>
            )
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
                                    paginationServer
                                    paginationPerPage={rowsPerPage}
                                    paginationTotalRows={getadmin_data.length}
                                    currentPage={currentPage}
                                />
                            </>
                        ) : (
                            <Alert variant="warning" className="text-center">No data found</Alert>
                        )
                    ) : (
                        <Form onSubmit={handleForm}>
                            <Row>
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
                                    </Form.Group>
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="phone">
                                        <Form.Label>Phone</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                        {errors.phone && <Form.Text className="text-danger">{errors.phone}</Form.Text>}
                                    </Form.Group>
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="address">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                        {errors.address && <Form.Text className="text-danger">{errors.address}</Form.Text>}
                                    </Form.Group>
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="whatsapp">
                                        <Form.Label>Whatsapp</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={whatsapp}
                                            onChange={(e) => setWhatsapp(e.target.value)}
                                        />
                                        {errors.whatsapp && <Form.Text className="text-danger">{errors.whatsapp}</Form.Text>}
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button type="submit" variant="primary">
                                {editMode ? 'Update' : 'Submit'}
                            </Button>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default ContactInfo;
