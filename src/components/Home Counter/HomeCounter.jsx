import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import DataTable from 'react-data-table-component';
import { FaEdit, FaRegEye, FaEyeSlash } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import instance from '../../api/AxiosInstance';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useSearchExport } from '../../context/SearchExportContext';

function HomeCounter() {
    const [training_imparted, settraining_imparted] = useState('');
    const [lives_changed, setlives_changed] = useState('');
    const [children, setchildren] = useState('');
    const [adult, setadult] = useState('');
    const [errors, setErrors] = useState({});
    const [showAdd, setShowAdd] = useState(true);
    const [getadmin_data, setadmin_data] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [activeStatus, setActiveStatus] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { searchQuery, handleSearch } = useSearchExport();

    const columns = [
        {
            name: 'Sr. No',
            selector: (row, index) => index + 1 + (currentPage - 1) * rowsPerPage,
            sortable: true,
            width: '80px'
        },
        {
            name: 'Training Imparted',
            selector: (row) => row.training_imparted,
            sortable: true
        },
        {
            name: 'Lives Changed',
            selector: (row) => row.lives_changed,
            sortable: true
        },
        {
            name: 'Children',
            selector: (row) => row.children,
            sortable: true
        },
        {
            name: 'Adult',
            selector: (row) => row.adult,
            sortable: true
        },
        {
            name: 'Action',
            cell: (row) => (
                <>
                    <Button variant="primary" className="m-2" onClick={() => edit(row.id)}>
                        <FaEdit />
                    </Button>
                    <Button variant="danger" className="m-2" onClick={() => delete_data(row.id)}>
                        <MdDelete />
                    </Button>
                    <Button
                        variant={activeStatus[row.id] ? 'success' : 'warning'}
                        className="m-2"
                        onClick={() => toggleActiveStatus(row.id)}
                    >
                        {activeStatus[row.id] ? <FaRegEye color="white" /> : <FaEyeSlash color="white" />}
                    </Button>
                </>
            ),
            width: '200px'
        }
    ];

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
                    await instance.put(`counter/update-homecounter/${editId}`, formData);
                    alert('Data updated successfully!');
                } else {
                    await instance.post('counter/create-homecounter', formData);
                    alert('Data submitted successfully!');
                }

                settraining_imparted('');
                setchildren('');
                setadult('');
                setlives_changed('');
                setErrors({});
                setEditMode(false);
                setEditId(null);
                getdata_admin();
                setShowAdd(true);
            } catch (error) {
                console.error('Error submitting data:', error);
                alert('There was an error submitting the data.');
            }
        }
    };

    const handleToggle = () => {
        setShowAdd(!showAdd);
        setEditMode(false);
        settraining_imparted('');
        setchildren('');
        setadult('');
        setlives_changed('');
        setErrors({});
    };

    const getdata_admin = () => {
        instance
            .get('counter/find-homecounter')
            .then((res) => {
                setadmin_data(res.data.responseData || []);
                const initialStatus = {};
                res.data.responseData.forEach((item) => {
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
            settraining_imparted(item.training_imparted);
            setchildren(item.children);
            setadult(item.adult);
            setlives_changed(item.lives_changed);
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
                            await instance.delete(`counter/delete-homecounter/${id}`);
                            getdata_admin();
                        } catch (error) {
                            console.error('Error deleting data:', error);
                            alert('There was an error deleting the data.');
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => {}
                }
            ]
        });
    };

    const toggleActiveStatus = async (id) => {
        try {
            const response = await instance.put(`counter/isactive-homecounter/${id}`);
            if (response.data) {
                setActiveStatus((prevStatus) => ({
                    ...prevStatus,
                    [id]: !prevStatus[id]
                }));
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <Container>
            <Card>
                <Card.Header className="d-flex justify-content-end">
                    <Button variant={editMode ? 'primary' : 'success'} onClick={handleToggle}>
                        {showAdd ? 'Add' : 'View'}
                    </Button>
                </Card.Header>
                <Card.Body>
                    {showAdd ? (
                        getadmin_data.length > 0 ? (
                            <DataTable
                                columns={columns}
                                data={getadmin_data}
                                pagination
                                responsive
                                striped
                                noDataComponent="No Data Available"
                                paginationPerPage={rowsPerPage}
                                onChangePage={(page) => setCurrentPage(page)}
                                onChangeRowsPerPage={(newRowsPerPage) => setRowsPerPage(newRowsPerPage)}
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
                            </Row>
                            <Row>
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
                            </Row>
                            <Button variant={editMode ? 'primary' : 'success'} type="submit" className="mt-3">
                                {editMode ? 'Update' : 'Submit'}
                            </Button>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default HomeCounter;
