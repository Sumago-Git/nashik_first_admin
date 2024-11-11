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
import SearchInput from '../search/SearchInput';

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

    // const handleForm = async (e) => {
    //     e.preventDefault();

    //     if (validateForm()) {
    //         const formData = new FormData();
    //         formData.append('fullName', fullName);
    //         formData.append('email', email);
    //         formData.append('contact', contact);
    //         formData.append('age', age);
    //         formData.append('subject', subject);
    //         formData.append('profession', profession);
    //         formData.append('suggestions', suggestions);

    //         try {
    //             if (editMode && editId) {
    //                 await instance.put(`thanksto/update-ThanksTo/${editId}`, formData);
    //                 alert('Data updated successfully!');
    //             } else {
    //                 await instance.post('contactform/create-contactform', formData, {
    //                     headers: { 'Content-Type': 'multipart/form-data' }
    //                 });
    //                 alert('Data submitted successfully!');
    //             }

    //             setFullName("");
    //             setEmail("");
    //             setContact("");
    //             setAge("");
    //             setSubject("");
    //             setProfession("");
    //             setSuggestions("");
    //             setErrors({});
    //             setEditMode(false);
    //             setEditId(null);
    //             getdata_admin();
    //             setShowAdd(true);
    //         } catch (error) {
    //             console.error("Error submitting form:", error);
    //         }
    //     }
    // };

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
                          // alert("Data deleted successfully!");
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
                  <b>Detials</b>
                    {/* <Button variant={editMode ? "primary" : "success"} onClick={handleToggle}>
                        {showAdd ? 'Add' : 'View'}
                    </Button> */}
                </Card.Header>
                <Card.Body>
                    {showAdd ? (
                        getAdminData.length > 0 ? (
                            <>
                                <SearchInput value={searchQuery} onChange={handleSearch} />
                                <Table striped bordered hover responsive="sm">
                                    <thead>
                                        <tr>
                                            <th>Sr. No</th>
                                            <th>Full Name</th>
                                            <th>Email</th>
                                            <th>Contact</th>
                                            <th>Age</th>
                                            <th>Subject</th>
                                            <th>Profession</th>
                                            <th>Suggestions</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getAdminData.map((a, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{a.firstName}</td>
                                                <td>{a.email}</td>
                                                <td>{a.contact}</td>
                                                <td>{a.age}</td>
                                                <td>{a.subject}</td>
                                                <td>{a.profession}</td>
                                                <td>{a.suggestions}</td>
                                                <td className="p-2">
                                                    {/* <Button variant="primary" className="m-2">
                                                        <FaEdit />
                                                    </Button> */}
                                                    <Button variant="danger" className="m-2" onClick={()=> handleDelete(a.id)}>
                                                        <MdDelete />
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
                                <Col lg={6}>
                                    <Form.Group className="mb-3" controlId="formFullName">
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                        />
                                        {errors.fullName && <span className="text-danger">{errors.fullName}</span>}
                                    </Form.Group>
                                </Col>
                                <Col lg={6}>
                                    <Form.Group className="mb-3" controlId="formEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        {errors.email && <span className="text-danger">{errors.email}</span>}
                                    </Form.Group>
                                </Col>
                                <Col lg={6}>
                                    <Form.Group className="mb-3" controlId="formContact">
                                        <Form.Label>Contact</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={contact}
                                            onChange={(e) => setContact(e.target.value)}
                                        />
                                        {errors.contact && <span className="text-danger">{errors.contact}</span>}
                                    </Form.Group>
                                </Col>
                                <Col lg={6}>
                                    <Form.Group className="mb-3" controlId="formAge">
                                        <Form.Label>Age</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                        />
                                        {errors.age && <span className="text-danger">{errors.age}</span>}
                                    </Form.Group>
                                </Col>
                                <Col lg={6}>
                                    <Form.Group className="mb-3" controlId="formSubject">
                                        <Form.Label>Subject</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                        />
                                        {errors.subject && <span className="text-danger">{errors.subject}</span>}
                                    </Form.Group>
                                </Col>
                                <Col lg={6}>
                                    <Form.Group className="mb-3" controlId="formProfession">
                                        <Form.Label>Profession</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={profession}
                                            onChange={(e) => setProfession(e.target.value)}
                                        />
                                        {errors.profession && <span className="text-danger">{errors.profession}</span>}
                                    </Form.Group>
                                </Col>
                                <Col lg={12}>
                                    <Form.Group className="mb-3" controlId="formSuggestions">
                                        <Form.Label>Suggestions</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={suggestions}
                                            onChange={(e) => setSuggestions(e.target.value)}
                                        />
                                        {errors.suggestions && <span className="text-danger">{errors.suggestions}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>
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
