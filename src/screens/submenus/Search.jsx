import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash } from "react-icons/fa";
import instance from "../../api/AxiosInstance";
import InputMask from 'react-input-mask';
import Bookpackagesmodal from "../Booking Packages/Bookpackagesmodal";
const Search = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [user, setUser] = useState([])
    const handleShow1 = () => setShow1(true);
    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);
    const [selectedBooking, setSelectedBooking] = useState(null); // New state for selected booking
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null); // This will hold the selected date
    const [dateforslot, setdateforslote] = useState("")

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const formatDateForInput = (dateString) => {
        if (!dateString) return ''; // Handle empty or undefined values

        const [month, day, year] = dateString.split('/'); // Split by "/"
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // Reformat to YYYY-MM-DD
    };


    const selectCategory = (e) => {
        setSelectedCategory(e.target.value)
        instance.post("bookingform/get-bookingentries-by-category", { category: e.target.value }).then((result) => {
            setUser(result.data.responseData)
            console.log("result setUser", result.data.responseData);

        }).catch((err) => {
            console.log("err", err);

        })
    }
    const EditSubmissionDate = (e) => {
        let value = e.target.value
        const date = new Date(value);

        // Set the desired time (17:22:33.000)
        date.setHours(17, 22, 33, 0);

        // Convert to ISO string format
        const isoString = date.toISOString();

        setSelectedBooking({ ...selectedBooking, submission_date: isoString })


    }
    const handleEdit = (row) => {
        console.log("row", row);
        setShow1(true)
        setSelectedBooking(row)

    }
    const handleSave = () => {
        // Here you can add logic to save changes to your state or backend
        if (sessions.length !== 0 && !selectedBooking.slotsession) {
            // If no session is selected, show an error or prevent submission
            alert('Please select a session.'); // You can replace this with more user-friendly UI feedback
            return;
        }

        if (!selectedBooking.slotdate) {
            // If no slotdate is selected, show an error or prevent submission
            alert('Please select a booking date.'); // You can replace this with more user-friendly UI feedback
            return;
        }

        let updatedBooking = { ...selectedBooking, slotdate: dateforslot};
        console.log("selectedBooking==========>", selectedBooking);

        if (updatedBooking.submission_date) {
            const date = new Date(updatedBooking.submission_date); // `submission_date` from input (yyyy-MM-dd)
            updatedBooking.submission_date = date.toISOString();  // Convert to ISO format (yyyy-MM-ddTHH:mm:ss.sssZ)
        }
        alert("inside update")
        console.log("updatedBooking", updatedBooking)
        instance.put(`bookingform/bookingform/${updatedBooking.id}`, updatedBooking).then((resp) => {
            setShow1(false)
            instance.post("bookingform/get-bookingentries-by-category", { category: selectedCategory }).then((result) => {
                setUser(result.data.responseData)
                alert("true")
                console.log("result", result.data.responseData);

            }).catch((err) => {
                alert("flase")
                console.log("err", err);

            })
        }).catch((err) => {
            console.log("err", err);

        })
    };
    function convertDateFormat(date) {
        // Split the input date by "/"
        const [month, day, year] = date.split('/');

        // Return the formatted date in MM/DD/YYYY format
        return `${day}/${month}/${year}`;
    }
    const customStyles = {
        headCells: {
            style: {
                whiteSpace: 'normal !important',         // Prevents word-wrap in header cells
                overflow: 'hidden !important',             // Hides overflowing text in headers
                textOverflow: 'ellipsis !important',        // Adds ellipsis if text overflows
                padding: '8px !important',                 // Adjusts cell padding
                textAlign: 'left !important',               // Aligns text inside header cells
                fontSize: '14px !important',                // Sets the font size
            },
        },
        cells: {
            style: {
                whiteSpace: 'normal !important',           // Prevents word-wrap in data cells
                overflow: 'hidden !important',              // Hides overflowing text in cells
                textOverflow: 'ellipsis !important',         // Adds ellipsis if text overflows
                padding: '8px !important',                  // Adjusts cell padding
                textAlign: 'left !important',               // Aligns text inside cells
                fontSize: '14px !important',                // Sets the font size
            },
        },
        table: {
            style: {
                width: '100% !important',                   // Ensures the table stretches as needed
                borderCollapse: 'collapse !important',       // Collapses table borders
            },
        },
        rows: {
            style: {
                whiteSpace: 'normal !important',             // Prevents word-wrap across entire table
                borderBottom: '1px solid #ddd !important',     // Adds a bottom border between rows
            },
        },
    };
    // Columns definition
    const tableColumns = [
        {
            name: "Sr. No.",
            selector: (row, index) => index + 1,
        },
        {
            name: 'Full Name',
            selector: row => `${row.fname}   ${row.lname}`,
            sortable: true,
        },
        {
            name: "Learning No",
            selector: (row) => row.learningNo,
        },
        {
            name: "Email",
            selector: (row) => row.email,
        },
        {
            name: "Phone",
            selector: (row) => row.phone,
        },
        {
            name: "Slot Date",
            selector: (row) => convertDateFormat(row.slotdate),
        },

        // {
        //     name: "Submission Date",
        //     selector: (row) => new Date(row.submission_date).toLocaleString(),
        // },
        {
            name: "Training Status",
            selector: (row) => row.training_status,
        },
        // Conditional columns
        {
            name: "Institution Name",
            selector: (row) => row.institution_name,
            omit: (row) =>
                row.category === "School Students Training – Group" ||
                row.category === "College/Organization Training – Group",
        },
        {
            name: "Institution Email",
            selector: (row) => row.institution_email,
            omit: (row) =>
                row.category === "School Students Training – Group" ||
                row.category === "College/Organization Training – Group",
        },
        {
            name: "Institution Phone",
            selector: (row) => row.institution_phone,
            omit: (row) =>
                row.category === "School Students Training – Group" ||
                row.category === "College/Organization Training – Group",
        },
        {
            name: "HM/Principal/Manager Name",
            selector: (row) => row.hm_principal_manager_name,
            omit: (row) =>
                row.category === "School Students Training – Group" ||
                row.category === "College/Organization Training – Group",
        },
        {
            name: "HM/Principal/Manager Mobile",
            selector: (row) => row.hm_principal_manager_mobile,
            omit: (row) =>
                row.category === "School Students Training – Group" ||
                row.category === "College/Organization Training – Group",
        },
        {
            name: "Coordinator Name",
            selector: (row) => row.coordinator_name,
            omit: (row) =>
                row.category === "School Students Training – Group" ||
                row.category === "College/Organization Training – Group",
        },
        {
            name: "Coordinator Mobile",
            selector: (row) => row.coordinator_mobile,
            omit: (row) =>
                row.category === "School Students Training – Group" ||
                row.category === "College/Organization Training – Group",
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="d-flex">
                    <Button className="ms-1" onClick={() => handleEdit(row)}>
                        <FaEdit />
                    </Button>
                </div>
            ),
        },
    ];



    // Filter data based on search query and selected category
    const filteredData = user.filter((row) => {
        return (
            row.fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.lname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.mname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.learningNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.slotdate.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.slotsession.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.submission_date.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.training_status.toLowerCase().includes(searchQuery.toLowerCase())
        );

    });
    const [sessions, setSessions] = useState([]);

    const handleDateSelected = (date) => {

        setSelectedDate(date);
        console.log("Selected Date:", date);
        const selectedDate = new Date(date);

        const formattedDate = selectedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });

        console.log("Formatted Selected Date:", formattedDate);
        const formattedDate2 = selectedDate.toLocaleDateString();
        setdateforslote(formattedDate2)
        setSelectedBooking({ ...selectedBooking, slotdate: formattedDate, tempdate: selectedDate })
        setSelectedBooking({ ...selectedBooking, slotsession: "" })
    };
    useEffect(() => {


        const data = { slotdate: dateforslot, category: selectedCategory };
        instance.post(`/Sessionslot/get-getSessionbySessionslot`, data, {
            headers: { "Content-Type": "application/json" }
        })
            .then((result) => {
                setSessions(result.data.responseData);
                console.log("slotdata:", result.data.responseData);

            })
            .catch((err) => {
                console.log("Error fetching sessions:", err);
            });

    }, [selectedDate]);

    const EditDate = (e) => {

        setSelectedBooking({ ...selectedBooking, slotdate: dateforslot, tempdate: selectedDate })

    }
    const formatTimeTo12Hour = (time) => {
        const [hour, minute] = time.split(':');
        const hours = parseInt(hour, 10);
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHour = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
        return `${formattedHour}:${minute} ${period}`;
    };

    // Example usage:
    // Output: "05/12/2024"

    return (
        <Container fluid>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Row className="d-flex justify-content-between align-items-center">
                                <Col>
                                    <h5>User Data</h5>
                                </Col>
                                <Col className="d-flex justify-content-end align-items-center">
                                    {/* Dropdown for category selection */}
                                    <Form.Select
                                        value={selectedCategory}
                                        onChange={selectCategory}
                                        className="me-3"
                                    >
                                        <option value="Select Option">Select Option</option>
                                        <option value="RTO – Learner Driving License Holder Training">RTO – Learner Driving License Holder Training</option>
                                        <option value="RTO – Suspended Driving License Holders Training">RTO – Suspended Driving License Holders Training</option>
                                        <option value="RTO – Training for School Bus Driver">RTO – Training for School Bus Driver</option>
                                        <option value="School Students Training – Group">School Students Training – Group</option>
                                        <option value="College/Organization Training – Group">College/Organization Training – Group</option>
                                    </Form.Select>

                                    {/* Search input */}
                                    <Form.Control
                                        type="text"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    // className="mb-3"
                                    />
                                </Col>
                            </Row>
                        </Card.Header>

                        <Card.Body>
                            <DataTable
                                columns={tableColumns}
                                data={filteredData}
                                pagination
                                responsive
                                customStyles={customStyles}
                                striped
                                noDataComponent="No Data Available"
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={show1} onHide={handleClose1} size="lg" className="modaldetail">
                <Modal.Header closeButton>
                    <Modal.Title>Candidate Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBooking && (
                        <div>
                            <Row>
                                <Col lg={6} md={6} sm={12} className="">
                                    <b>User Id</b><br />
                                    {selectedBooking.id}<br />
                                </Col>
                                <Col lg={6} md={6} sm={12} className="">
                                    <b>Certificate Number</b><br />
                                    {selectedBooking.certificate_no}
                                </Col>

                                <Col lg={6} md={6} sm={12} className="">
                                    {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label><b>Booking Date</b></Form.Label><br />
                                        <Form.Control
                                            type="date"
                                            value={selectedBooking.slotdate ? formatDateForInput(selectedBooking.slotdate) : ''} // Convert MM/DD/YYYY to YYYY-MM-DD
                                            onChange={(e) => {
                                                if (selectedBooking.category !== "School Students Training – Group" && selectedBooking.category !== "College/Organization Training – Group") {
                                                    EditDate(e);
                                                }
                                            }}
                                            disabled={selectedBooking.category === "School Students Training – Group" || selectedBooking.category === "College/Organization Training – Group"}
                                        />
                                    </Form.Group> */}
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label><b>Booking Date</b></Form.Label><br />

                                        {sessions && sessions.length === 0 ? (
                                            // If sessions array is empty, show a date input field for booking date
                                            <Form.Control
                                                type="date"
                                                value={selectedDate ? selectedDate : selectedBooking.slotdate ? formatDateForInput(selectedBooking.slotdate) : ''}
                                                onChange={(e) => {
                                                    if (selectedBooking.category !== "School Students Training – Group" && selectedBooking.category !== "College/Organization Training – Group") {
                                                        EditDate(e);
                                                        // setSelectedBooking({ ...selectedBooking, slotdate: dateforslot, tempdate: selectedDate });

                                                    }
                                                }}
                                                disabled={selectedBooking.category === "School Students Training – Group" || selectedBooking.category === "College/Organization Training – Group"}
                                            />
                                        ) : (
                                            // If sessions array is not empty, you could handle it differently (maybe pre-selecting a date from session data)
                                            <Form.Control
                                                type="date"
                                                value={selectedDate ? selectedDate : selectedBooking.slotdate ? formatDateForInput(selectedBooking.slotdate) : ''}

                                                onChange={(e) => {
                                                    if (selectedBooking.category !== "School Students Training – Group" && selectedBooking.category !== "College/Organization Training – Group") {
                                                        EditDate(e);
                                                        setSelectedBooking({ ...selectedBooking, slotdate: dateforslot, tempdate: selectedDate });
                                                    }
                                                }}
                                                disabled={selectedBooking.category === "School Students Training – Group" || selectedBooking.category === "College/Organization Training – Group"}
                                            />
                                        )}
                                    </Form.Group>
                                    <Button onClick={handleShow}>Open Calendar</Button>

                                    <Bookpackagesmodal showModal={showModal} handleClose={handleClose} savedCategory={selectedCategory} passSelectedDate={handleDateSelected} // Pass the function to handle date selection
                                    />
                                </Col>
                                <Col lg={6} md={6} sm={12} className="">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label><b>Slot Session</b></Form.Label><br />

                                        {sessions && sessions.length === 0 ? (
                                            // If sessions array is empty, show the text input
                                            <Form.Control
                                                type="text"
                                                value={selectedBooking.slotsession}
                                                onChange={(e) => {
                                                    if (selectedBooking.category !== "School Students Training – Group" && selectedBooking.category !== "College/Organization Training – Group") {
                                                        setSelectedBooking({ ...selectedBooking, slotsession: e.target.value });
                                                    }
                                                }}
                                                disabled={selectedBooking.category === "School Students Training – Group" || selectedBooking.category === "College/Organization Training – Group"}
                                            />
                                        ) : (
                                            // If sessions array is not empty, show the dropdown
                                            <Form.Select
                                                value={selectedBooking.slotsession}
                                                onChange={(e) => {
                                                    // Find the selected session object based on the title and set its ID as sessionSlotId
                                                    const selectedSession = sessions.find((session) => session.title === e.target.value);
                                                    setSelectedBooking({
                                                        ...selectedBooking,
                                                        slotsession: e.target.value,
                                                        sessionSlotId: selectedSession ? selectedSession.id : null, // Store the session ID
                                                    });
                                                }}
                                                disabled={selectedBooking.category === "School Students Training – Group" || selectedBooking.category === "College/Organization Training – Group"}
                                            >
                                                <option value="">Select a Session</option>
                                                {sessions.map((session, index) => (
                                                    <option key={index} value={session.title}>{session.title}--{formatTimeTo12Hour(session.time)}</option>
                                                ))}
                                            </Form.Select>

                                        )}
                                    </Form.Group>
                                </Col>

                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label><b>License No.</b></Form.Label><br />
                                        {selectedBooking.category === "RTO – Suspended Driving License Holders Training" ? (
                                            <InputMask
                                                mask="**** ***********"
                                                value={selectedBooking.learningNo || ""}
                                                onChange={(e) => {
                                                    const inputValue = e.target.value.toUpperCase();
                                                    setSelectedBooking({ ...selectedBooking, learningNo: inputValue });
                                                }}
                                                placeholder="xxxx xxxxxxxxxxx"
                                                className="form-control"
                                            />
                                        ) : (
                                            <InputMask
                                                mask="****/*******/****"
                                                value={selectedBooking.learningNo || ""}
                                                onChange={(e) => {
                                                    const inputValue = e.target.value.toUpperCase();
                                                    setSelectedBooking({ ...selectedBooking, learningNo: inputValue });
                                                }}
                                                placeholder="XXXX/XXXXXXX/XXXX"
                                                className="form-control"
                                            />
                                        )}
                                    </Form.Group>
                                </Col>

                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <b>First Name:</b><br />
                                        <Form.Control type="text" defaultValue={selectedBooking.fname} onChange={(e) => setSelectedBooking({ ...selectedBooking, fname: e.target.value })} />
                                    </Form.Group>
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <b>Middle Name:</b><br />
                                        <Form.Control type="text" defaultValue={selectedBooking.mname} onChange={(e) => setSelectedBooking({ ...selectedBooking, mname: e.target.value })} />
                                    </Form.Group>
                                </Col>

                                <Col lg={6} md={6} sm={12} className="">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <b>Last Name</b><br />
                                        <Form.Control type="text" defaultValue={selectedBooking.lname} onChange={(e) => setSelectedBooking({ ...selectedBooking, lname: e.target.value })} />
                                    </Form.Group>
                                </Col>

                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        {/* <b>Email</b><br /> */}
                                        <Form.Label><b>Email</b></Form.Label><br />
                                        <Form.Control type="text" defaultValue={selectedBooking.email} onChange={(e) => setSelectedBooking({ ...selectedBooking, email: e.target.value })} />
                                    </Form.Group>
                                </Col>

                                <Col lg={6} md={6} sm={12} className="">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label><b>Phone Number</b></Form.Label><br />
                                        <Form.Control type="text" defaultValue={selectedBooking.phone} onChange={(e) => setSelectedBooking({ ...selectedBooking, phone: e.target.value })} />

                                    </Form.Group>
                                </Col>
                                <Col lg={12} className="text-end">

                                </Col>
                            </Row>
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer>

                    <Button variant="primary" onClick={handleSave}>
                        Update
                    </Button>

                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Search;
