import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { FaEdit, FaEye, FaEyeSlash, FaRegEye } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import instance from '../../api/AxiosInstance';

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useSearchExport } from '../../context/SearchExportContext';
import SearchInput from '../search/SearchInput';
import DataTable from 'react-data-table-component';  // Import DataTable component

import "../../assets/contactform.css";

function ContactForm() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [age, setAge] = useState("");
    const [subject, setSubject] = useState("");
    const [profession, setProfession] = useState("");
    const [suggestions, setSuggestions] = useState("");
    const [errors, setErrors] = useState({});
    const [showAdd, setShowAdd] = useState(true);
    const [getAdminData, setAdminData] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [activeStatus, setActiveStatus] = useState({});

    const { searchQuery, handleSearch, handleExport, setData, filteredData } = useSearchExport();

    const columns = [
        {
            name: 'Sr. No',
            selector: (row, index) => index + 1,
            sortable: true,
        },
        {
            name: 'Full Name',
            selector: row => row.firstName,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Contact',
            selector: row => row.contact,
            sortable: true,
        },
        {
            name: 'Age',
            selector: row => row.age,
            sortable: true,
        },
        {
            name: 'Subject',
            selector: row => row.subject,
            sortable: true,
        },
        {
            name: 'Profession',
            selector: row => row.profession,
            sortable: true,
        },
        {
            name: 'Suggestions',
            selector: row => row.suggestions,
            sortable: true,
            cell: row => <div className="ellipsis">{row.suggestions}</div>,
        },
        {
            name: 'Suggestion File',
            selector: row => row.suggestionfile,
            sortable: true,
            cell: row => <div className="ellipsis">{row.suggestionfile}</div>,
        },
        {
            name: 'Action',
            button: true,
            cell: (row) => (
                <>
                    <Button variant="danger" className="m-2" onClick={() => handleDelete(row.id)}>
                        <MdDelete />
                    </Button>
                </>
            ),
        },
    ];

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!fullName.trim()) {
            errors.fullName = 'Full name is required';
            isValid = false;
        }
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'A valid email is required';
            isValid = false;
        }
        if (!contact.trim() || !/^\d{10}$/.test(contact)) {
            errors.contact = 'A valid 10-digit contact number is required';
            isValid = false;
        }
        if (!age.trim() || isNaN(age) || age < 1) {
            errors.age = 'A valid age is required';
            isValid = false;
        }
        if (!subject.trim()) {
            errors.subject = 'Subject is required';
            isValid = false;
        }
        if (!profession.trim()) {
            errors.profession = 'Profession is required';
            isValid = false;
        }
        if (!suggestions.trim()) {
            errors.suggestions = 'Suggestions are required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleToggle = () => {
        setShowAdd(!showAdd);
        setEditMode(false);
        setFullName("");
        setEmail("");
        setContact("");
        setAge("");
        setSubject("");
        setProfession("");
        setSuggestions("");
        setErrors({});
    };

    const getdata_admin = () => {
        instance.get('contactform/get-contactforms')
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
        getdata_admin();
    }, []);

    const handleDelete = (id) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this entry?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await instance.delete(`contactform/delete-contactform/${id}`);
                            getdata_admin(); // Refresh data after deletion
                        } catch (error) {
                            console.error("Error deleting data:", error);
                        }
                    }
                },
                {
                    label: 'No'
                }
            ]
        });
    };

    return (
        <Container>
            <Card>
                <Card.Header className="d-flex justify-content-end">
                    <b>Details</b>
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
                            {/* Form Fields Here */}
                            <Button type="submit" variant="success">
                                {editMode ? 'Update' : 'Submit'}
                            </Button>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default ContactForm;
