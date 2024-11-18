import React, { useState, useEffect } from "react";
import { Container, Table, Col, Row, Form, Alert } from "react-bootstrap";

import './bookingpckg.css';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { jsPDF } from "jspdf"; // Import jsPDF
import Categories from "../../components/Categories";
import instance from "../../api/AxiosInstance";
import { useLocation } from "react-router-dom";
import DataTable from 'react-data-table-component';

const Bookcalender = ({ tabKey }) => {
    const [show, setShow] = useState(false);
    // const [selectedDate, setSelectedDate] = useState("");
    const [selectedDay, setSelectedDay] = useState("");

    const [dataByDateAndCategory, setDataByDateAndCategory] = useState([]);
    const [formatedDateData, setFormatedDate] = useState();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [lgShow, setLgShow] = useState(false);


    const [show2, setShow2] = useState(false);





    const location = useLocation();
    const { selectedDate, selectedTime, category, slotsession } = location.state || {}; // Destructure with default to avoid undefined errors

    useEffect(() => {
        if (!selectedDate || !selectedTime || !category) {
            console.log("State values are missing:", { selectedDate, selectedTime, category });
        } else {
            console.log("Selected Date:", selectedDate);
            console.log("Selected Time:", selectedTime);
            console.log("Category:", category);
        }
    }, [selectedDate, selectedTime, category]);


    const sessionSlotId = localStorage.getItem('slotsid');
    const category1 = localStorage.getItem('category')
    const getUserDataByCategoryAndDate = () => {

        const dateOnly = selectedDate.split(' ')[1];
        let data = {
            slotsession: slotsession,// Use the formatted date here
            sessionSlotId: sessionSlotId,
            category: category1
        };
        instance.post("bookingform/get-bookingentries-by-date-category", data).then((result) => {
            console.log("result", result);
            setDataByDateAndCategory(result.data.responseData)
        }).catch((error) => {
            console.log("error", error);

        })
    }

    useEffect(() => {
        getUserDataByCategoryAndDate()
    }, [])





    const [selectedBooking, setSelectedBooking] = useState(null); // New state for selected booking

    const [isEditing, setIsEditing] = useState(false); // State for edit mode

    const handleEdit = () => {
        setIsEditing(true); // Enable edit mode
    };

    const handleSave = () => {
        // Here you can add logic to save changes to your state or backend
        setIsEditing(false); // Disable edit mode
        let updatedBooking = { ...selectedBooking };

        // if (typeof updatedBooking.vehicletype === "string") {
        //     if (updatedBooking.vehicletype.includes(",")) {
        //         // Split comma-separated string into an array
        //         updatedBooking.vehicletype = updatedBooking.vehicletype.split(",").map(item => item.trim());
        //     } else {
        //         // Wrap single value string in an array
        //         updatedBooking.vehicletype = [updatedBooking.vehicletype.trim()];
        //     }
        // } else if (!Array.isArray(updatedBooking.vehicletype)) {
        //     // If vehicletype is neither string nor array, wrap it as a single-value array
        //     updatedBooking.vehicletype = [updatedBooking.vehicletype];
        // }

        instance.put(`bookingform/bookingform/${updatedBooking.id}`, updatedBooking).then((resp) => {
            console.log("resp", resp);
            getUserDataByCategoryAndDate(formatedDateData)
        }).catch((err) => {
            console.log("err", err);

        })
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleShow1 = () => setShow1(true);
    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);


    const [loading, setLoading] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

    const specialDates = [
        { date: 18, label: "Holiday", style: { backgroundColor: "#742929", color: "#ecc2c2" } },
        { date: 15, label: "Closed", style: { backgroundColor: "#ffd4d4", color: "red" } },
        { date: 22, label: "Available", style: { backgroundColor: "#d4ffd4", color: "green" } },
    ];


    useEffect(() => {

        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);






    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const startingDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);
    const firstWeek = Array(startingDay).fill(null).concat(daysArray.slice(0, 7 - startingDay));

    const chunkArray = (arr, size) => {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    };

    const weeks = chunkArray(daysArray.slice(7 - startingDay), 7);
    weeks.unshift(firstWeek);

    const lastWeek = weeks[weeks.length - 1];
    lastWeek.push(...Array(7 - lastWeek.length).fill(null));

    const EditDate = (e) => {
        let value = e.target.value
        const date = new Date(value);

        // Define options for formatting
        const options = {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        const formattedDate = date.toLocaleDateString('en-GB', options).replace(',', '').replace('/', '');
        setSelectedBooking({ ...selectedBooking, slotdate: formattedDate })
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
    const handleDownloadCertificate = async () => {
        const doc = new jsPDF();

        // Add the certificate background image
        const image = await import('../../assets/Holiday/cirtification.jpg'); // Make sure the path is correct
        const imgData = image.default; // Get the image data

        // Add the background image to the PDF
        doc.addImage(imgData, 'PNG', 0, 0, 210, 270); // Adjust width and height as necessary

        // Set font, color, and size for the user's name
        doc.setFont("cursive");
        doc.setFontSize(36);
        doc.setTextColor("#4e4e95");

        // Prepare user's name
        const nameText = `${selectedBooking.fname} ${selectedBooking.lname}`;
        const nameWidth = doc.getTextWidth(nameText);

        // Center the name horizontally
        const xPositionName = (210 - nameWidth) / 2;
        const yPositionName = 115; // Adjust as needed for vertical positioning

        // Draw the user's name
        doc.text(nameText, xPositionName, yPositionName);

        // Set font and size for Sr and slotdate
        doc.setFont("Arial");

        // Set color and position for Sr (ID)
        doc.setTextColor("#4e4e95"); // Set color for Sr (use any desired color code)
        doc.setFontSize(17);
        const srText = `00${selectedBooking.id}`;
        const xPositionSr = 185; // Adjust x-position for Sr
        const yPositionSr = 63; // Adjust y-position for Sr
        doc.text(srText, xPositionSr, yPositionSr);

        // Set color and position for slotdate
        doc.setTextColor("#4e4e95"); // Set color for slotdate (use any desired color code)
        doc.setFontSize(15);
        const slotDateText = `: ${selectedBooking.slotdate}`;
        const xPositionSlotDate = 180; // Adjust x-position for slotdate
        const yPositionSlotDate = 82; // Adjust y-position for slotdate
        doc.text(slotDateText, xPositionSlotDate, yPositionSlotDate);

        // Save the PDF
        doc.save(`${selectedBooking.fname}_certificate.pdf`);
    };

    const toggleStatus = (row) => {
        const newStatus = row.training_status === "Confirmed" ? "Attended" : "Confirmed";

        // Update backend
        instance.put(`bookingform/bookingform/${row.id}`, { training_status: newStatus })
            .then(() => {
                // Update row status locally for immediate UI feedback
                setDataByDateAndCategory(prevData =>
                    prevData.map(item =>
                        item.id === row.id ? { ...item, training_status: newStatus } : item
                    )
                );
            })
            .catch((error) => console.error("Error updating status:", error));
    };


    const handleRowClick = (a) => {
        console.log("aaaa", a);

        setSelectedBooking(a); // Set the selected booking data
        handleShow1();
    };
    const columns = [
        {
            name: 'Session',
            selector: row => row.slotsession,
            sortable: true,
        },
        {
            name: 'Status',
            cell: row => (
                <Button
                    variant={row.training_status === "Confirmed" ? "success" : "secondary"}
                    className="w-100"
                    onClick={() => toggleStatus(row)}
                >
                    {row.training_status === "Confirmed" ? "Confirmed" : "Attended"}
                </Button>
            ),
            sortable: true,
        },
        {
            name: 'First Name',
            selector: row => row.fname,
            sortable: true,
        },
        {
            name: 'Last Name',
            selector: row => row.lname,
            sortable: true,
        },
        {
            name: 'Category',
            selector: row => row.category,
            sortable: true,
        },
        {
            name: 'Certificate No.',
            selector: row => row.certificate_no,
            sortable: true,
        },
        {
            name: 'Training Status',
            selector: row => row.training_status,
            sortable: true,
        },
    ];
    return (
        <>

            <h3>{category1}</h3><h3>{selectedDate}</h3>

            {dataByDateAndCategory.length > 0 ? (
                <DataTable
                    columns={columns}
                    data={dataByDateAndCategory}
                    pagination
                    responsive
                    striped
                    noDataComponent="No Data Available"
                    onRowClicked={handleRowClick}
                />
            ) : (
                <Alert variant="warning" className="text-center">
                    No Data Found
                </Alert>
            )}

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                fullscreen
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        ({selectedDay}) {selectedDate}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs defaultActiveKey="tab1" id="modal-tabs" className="mb-3">
                        <Tab eventKey="tab1" title="Customer">

                        </Tab>
                        <Tab eventKey="tab2" title="Booking">
                            <p className="fw-bold ">Comming Soon</p>
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={show1} onHide={handleClose1} size="lg" className="modaldetail">
                <Modal.Header >
                    <Modal.Title>Customer Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBooking && (
                        <div>
                            <Row>
                                <Col lg={6} md={6} sm={12} className="pb-4">
                                    <b>User Id</b><br />
                                    {selectedBooking.user_id}<br />
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <b>Status</b><br />
                                    <Button variant={selectedBooking.status === "APPROVED" ? "primary" : selectedBooking.status === "PENDING" ? "warning" : selectedBooking.status === "CANCELLED" && "danger"} onClick={() => setLgShow(true)} className="w-100">{selectedBooking.status}</Button>
                                </Col>
                                <hr></hr>

                                <Col lg={6} md={6} sm={12} className="pb-4">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <b>Booking Date</b><br />
                                        {isEditing ? (
                                            <Form.Control type="date" onChange={EditDate} />
                                        ) : (
                                            selectedBooking.slotdate
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <b>Payment Method</b><br />
                                    {selectedBooking.payment_method}
                                </Col>
                                <hr></hr>

                                <Col lg={6} md={6} sm={12} className="pb-4">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <b>Submission Date</b><br />
                                        {isEditing ? (
                                            // <input
                                            //     type="date"
                                            //     defaultValue={selectedBooking.submission_date}
                                            //     onChange={EditSubmissionDate}
                                            // />
                                            <Form.Control type="date" defaultValue={selectedBooking.submission_date} onChange={EditSubmissionDate} />
                                        ) : (
                                            // Check if submission_date is a valid date and format it properly
                                            <span>
                                                {selectedBooking.submission_date
                                                    ? (() => {
                                                        const date = new Date(selectedBooking.submission_date);
                                                        const options = {
                                                            weekday: 'long',
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                        };
                                                        const formattedDate = date.toLocaleDateString('en-GB', options); // 'en-GB' uses day/month/year format
                                                        return formattedDate.replace(',', '').replace('/', '/'); // Remove commas and ensure proper formatting
                                                    })()
                                                    : selectedBooking.submission_date}
                                            </span>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <b>First Name:</b><br />
                                        {isEditing ? (
                                            // <input
                                            //     type="text"
                                            //     defaultValue={selectedBooking.fname}
                                            //     onChange={(e) => setSelectedBooking({ ...selectedBooking, fname: e.target.value })}
                                            // />
                                            <Form.Control type="text" defaultValue={selectedBooking.fname} onChange={(e) => setSelectedBooking({ ...selectedBooking, fname: e.target.value })} />
                                        ) : (
                                            selectedBooking.fname
                                        )}
                                    </Form.Group>
                                </Col>
                                <hr></hr>

                                <Col lg={6} md={6} sm={12} className="pb-4">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <b>Last Name</b><br />
                                        {isEditing ? (
                                            // <input
                                            //     type="text"
                                            //     defaultValue={selectedBooking.lname}
                                            //     onChange={(e) => setSelectedBooking({ ...selectedBooking, lname: e.target.value })}
                                            // />
                                            <Form.Control type="text" defaultValue={selectedBooking.lname} onChange={(e) => setSelectedBooking({ ...selectedBooking, lname: e.target.value })} />
                                        ) : (
                                            selectedBooking.lname
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <b>Training For</b><br />

                                    {isEditing ? (
                                        <Form.Select
                                            defaultValue={selectedBooking.category}
                                            onChange={(e) => { setSelectedBooking({ ...selectedBooking, category: e.target.value }); }}
                                        >
                                            <option value="RTO – Learner Driving License Holder Training">RTO – Learner Driving License Holder Training</option>
                                            <option value="RTO – Suspended Driving License Holders Training">RTO – Suspended Driving License Holders Training</option>
                                            <option value="RTO – Training for School Bus Driver">RTO – Training for School Bus Driver</option>
                                            <option value="School Students Training – Group">School Students Training – Group</option>
                                            <option value="College/Organization Training – Group">College/Organization Training – Group</option>
                                            <option value="College / Organization Training – Individual">College / Organization Training – Individual</option>
                                            {/* Add other options as needed */}
                                        </Form.Select>
                                    ) : (
                                        selectedBooking.category
                                    )}


                                </Col>
                                <hr></hr>

                                <Col lg={6} md={6} sm={12} className="pb-4">
                                    <b>Certificate Number</b><br />
                                    {selectedBooking.certificate_no}
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <b>Tranning Status</b><br />
                                    {isEditing ? (
                                        // <select
                                        //     defaultValue={selectedBooking.training_status}
                                        //     onChange={(e) => setSelectedBooking({ ...selectedBooking, training_status: e.target.value })}
                                        // >
                                        <Form.Select aria-label="Default select example" defaultValue={selectedBooking.training_status} onChange={(e) => setSelectedBooking({ ...selectedBooking, training_status: e.target.value })}>

                                            <option value="Attended">Attended</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Not Confirmed">Not Confirmed</option>
                                            <option value="Absent">Absent</option>
                                            {/* Add other options as needed */}
                                        </Form.Select>
                                    ) : (
                                        selectedBooking.training_status
                                    )}
                                </Col>
                                <hr></hr>

                                <Col lg={6} md={6} sm={12} className="pb-4">
                                    <b>Learining Licenses Number</b><br />
                                    {selectedBooking.learningNo}
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        {/* <b>Email</b><br /> */}
                                        <Form.Label><b>Email</b></Form.Label><br />
                                        {isEditing ? (
                                            // <input
                                            //     type="text"
                                            //     defaultValue={selectedBooking.email}
                                            //     onChange={(e) => setSelectedBooking({ ...selectedBooking, email: e.target.value })}
                                            // />


                                            <Form.Control type="text" defaultValue={selectedBooking.email} onChange={(e) => setSelectedBooking({ ...selectedBooking, email: e.target.value })} />

                                        ) : (
                                            selectedBooking.email
                                        )}
                                    </Form.Group>
                                </Col>
                                <hr></hr>

                                <Col lg={6} md={6} sm={12} className="pb-4">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label><b>Phone Number</b></Form.Label><br />


                                        {isEditing ? (
                                            <Form.Control type="text" defaultValue={selectedBooking.phone} onChange={(e) => setSelectedBooking({ ...selectedBooking, phone: e.target.value })} />
                                        ) : (
                                            selectedBooking.phone
                                        )}
                                    </Form.Group>
                                </Col>
                                {/* <Col lg={6} md={6} sm={12}>
                                    <b>Vehical Type</b><br />
                                    {selectedBooking.vehicletype}
                                </Col> */}
                                <hr></hr>

                                <Col lg={6} md={6} sm={12} className="pb-4">
                                    <b>Print </b><br />
                                    <Button variant="danger" onClick={handleDownloadCertificate}>Print Cirtificate</Button>
                                </Col>

                                <Col lg={12} className="text-end">

                                </Col>
                            </Row>
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="danger" onClick={() => { handleClose1(); setIsEditing(false); }}>
                        Return
                    </Button>
                    {isEditing ? (
                        <Button variant="primary" onClick={handleSave}>
                            Save
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={handleEdit}>
                            Edit
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>


            <Modal size="lg" show={lgShow} onHide={() => setLgShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    setSelectedBooking({ ...selectedBooking, status: "APPROVED" });
                                    setLgShow(false);
                                }}
                                className="w-100 m-2">
                                APPROVED
                            </Button>
                            <Button variant="warning"
                                onClick={() => {
                                    setSelectedBooking({ ...selectedBooking, status: "PENDING" })
                                    setLgShow(false);
                                }}
                                className="w-100 m-2">PENDING </Button>
                            <Button variant="danger" onClick={() => {
                                setSelectedBooking({ ...selectedBooking, status: "CANCELLED" })
                                setLgShow(false);
                            }} className="w-100 m-2">CANCELLED</Button>
                            <Button variant="secondary" onClick={() => setLgShow(false)} className="w-100 m-2">CLOSE</Button>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setLgShow(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Bookcalender;