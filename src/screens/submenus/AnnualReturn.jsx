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
import DataTable from 'react-data-table-component';

function AnnualReturn() {
    const [financialYear, setFinancialYear] = useState("");
    const [file, setPdf] = useState(null);
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

        if (!financialYear.trim()) {
            errors.financialYear = 'Financial Year is required';
            isValid = false;
        }
        if (!file && !editMode) { // Only validate PDF in add mode
            errors.file = 'PDF file is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleForm = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const formData = new FormData();
            formData.append('financialYear', financialYear);
            if (file) formData.append('file', file);

            try {
                if (editMode && editId) {
                    await instance.put(`AnnualReturn/update-annualReturn/${editId}`, formData);
                    alert('Data updated successfully!');
                } else {
                    await instance.post('AnnualReturn/create-annualReturn', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    alert('Data submitted successfully!');
                }

                setFinancialYear("");
                setPdf(null);
                setPreview(null);
                setErrors({});
                setEditMode(false);
                setEditId(null);
                getdata_admin();
                setShowAdd(true);
            } catch (error) {
                console.error("Error uploading PDF:", error);
            }
        }
    };

    const handlePdfChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setPdf(file);
            setPreview(URL.createObjectURL(file));
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
        setFinancialYear("");
        setPdf(null);
        setPreview(null);
        setErrors({});
    };

    const getdata_admin = () => {
        instance.get('AnnualReturn/get-active-annualReturns')
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
            setFinancialYear(item.financialYear);
            setPreview(item.pdf);
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
                            await instance.delete(`AnnualReturn/annualReturn-delete/${id}`);
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
            const response = await instance.put(`AnnualReturn/annualReturn-status/${id}`);
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


    const columns = [
        {
            name: 'Sr. No',
            selector: (row, index) => index + 1, // Show the row number
            sortable: true,
        },
        {
            name: 'Financial Year',
            selector: (row) => row.financialYear,
            sortable: true,
        },
        {
            name: 'PDF',
            selector: (row) => (
                <a href={row.file} target="_blank" rel="noopener noreferrer">
                    View PDF
                </a>
            ),
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="actions">
                    <Button variant="primary m-2" onClick={() => edit(row.id)}>
                        <FaEdit />
                    </Button>
                    <Button variant="danger m-2" onClick={() => delete_data(row.id)}>
                        <MdDelete />
                    </Button>
                    <Button
                        variant={activeStatus[row.id] ? "success" : "warning"}
                        onClick={() => toggleActiveStatus(row.id)}
                        className='m-2'
                    >
                        {activeStatus[row.id] ? <FaRegEye color="white" /> : <FaEyeSlash color="white" />}
                    </Button>
                </div>
            ),
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
                        getadmin_data.length > 0 ? (
                            <>
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
                                    <Form.Group className="mb-3" controlId="formFinancialYear">
                                        <Form.Label>Financial Year</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Financial Year"
                                            value={financialYear}
                                            onChange={(e) => setFinancialYear(e.target.value)}
                                        />
                                        {errors.financialYear && <span className="error text-danger">{errors.financialYear}</span>}
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
                                        {errors.file && <span className="error text-danger">{errors.file}</span>}
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

export default AnnualReturn;
