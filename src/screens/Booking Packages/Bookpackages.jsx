import React, { useState } from "react";
import { Container, Table, Col, Modal, Nav } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import Button from 'react-bootstrap/Button';
import './bookingpckg.css';

import leftarrow from "../../assets/Holiday/leftarrow.png";
import rightarrow from "../../assets/Holiday/rightarrow.png";

import Card from 'react-bootstrap/Card';



import Row from 'react-bootstrap/Row';



const eventData = [
    { date: '2024-09-05', text: 'Holiday' },
    { date: '2024-09-15', text: 'Available' },
    { date: '2024-09-25', text: 'Meeting' },
];

const Bookingpackages = () => {

    const [smShow, setSmShow] = useState(false);
    const [lgShow, setLgShow] = useState(false);


    const [showModal, setShowModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const handleShowModal = (customer) => {
        setSelectedCustomer(customer); // Set the selected customer
        setShowModal(true); // Show the modal
    };


    const [isEditing, setIsEditing] = useState(false); // Track if in edit mode
    const [firstName, setFirstName] = useState(''); // Initial first name
    const [lastName, setLastName] = useState(''); // Initial last name

    // Toggle between editing and view mode
    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    // Save changes and exit editing mode
    const handleSaveClick = () => {
        setIsEditing(false);
        // You can also handle any save logic here (e.g., API call)
    };

    const [show, setShow] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [key, setKey] = useState('details'); // Set initial tab to 'details'

    const [showHelloModal, setShowHelloModal] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setKey('details'); // Reset to 'details' when the modal opens
        setShow(true);
    };

    const handleCloseHelloModal = () => setShowHelloModal(false);
    const handleShowHelloModal = () => setShowHelloModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCustomer(null); // Clear selected customer when closing modal
    };


    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const changeMonth = (direction) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(direction === 'prev' ? newDate.getMonth() - 1 : newDate.getMonth() + 1);
            return newDate;
        });
    };

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);
    const startingDay = getFirstDayOfMonth(currentMonth, currentYear);
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
    const remainingCells = 7 - lastWeek.length;
    const nextMonthDays = Array.from({ length: remainingCells }, (_, index) => index + 1);
    lastWeek.push(...nextMonthDays.map(day => ({ day, isNextMonth: true })));

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const today = new Date();
    const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();

    const handleDateClick = (day) => {
        if (day) {
            const clickedDate = new Date(currentYear, currentMonth, day);
            setSelectedDate(clickedDate);
            handleShow();
        }
    };

    const isPastDate = (day) => {
        const dateToCheck = new Date(currentYear, currentMonth, day);
        return dateToCheck < today.setHours(0, 0, 0, 0);
    };

    const renderButtonsForDate = (day) => {
        if (day && !isPastDate(day) && (day === 15 || day === 29)) {
            return (
                <div
                    style={{
                        maxHeight: '50px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '3px',
                    }}
                >
                    <Chip
                        label="Available"
                        onClick={handleClick}
                        style={{
                            backgroundColor: 'green',
                            color: 'white',
                            fontSize: '8px',
                            height: '16px',
                            padding: '0 4px',
                        }}
                    />
                    <Chip
                        label="Holiday"
                        onClick={handleClick}
                        style={{
                            backgroundColor: 'orange',
                            color: 'black',
                            fontSize: '8px',
                            height: '16px',
                            padding: '0 4px',
                        }}
                    />
                    <Chip
                        label="Close"
                        onClick={handleClick}
                        style={{
                            backgroundColor: 'red',
                            color: 'white',
                            fontSize: '8px',
                            height: '16px',
                            padding: '0 4px',
                        }}
                    />
                </div>
            );
        }
        return null;
    };

    const handleClick = () => {
        console.info('You clicked the Chip.');
    };


    const customer_table = [
        {
            time: "03:00 p.m",
            count: 62514,

            fname: "Amit",
            lname: "Patil",
            category: "Learning Licence",
            fees: 7512,
            active: "Not Confirmed"
        },
        {
            time: "03:00 p.m",
            count: 62315,

            fname: "Mohit",
            lname: "Patil",
            category: "Learining Licence",
            fees: 7945,
            active: "Attended"
        },
        {
            time: "03:00 p.m",
            count: 65214,

            fname: "Raju",
            lname: "Rao",
            category: "Learining Licence",
            fees: 9564,
            active: "Attended"
        },
        {
            time: "03:00 p.m",
            count: 75415,

            fname: "Prathamesh",
            lname: "Patil",
            category: "Learining Licence",
            fees: 6534,
            active: "Attended"
        },
        {
            time: "03:00 p.m",
            count: 75486,

            fname: "Ketan",
            lname: "Patil",
            category: "Learining Licence",
            fees: 5124,
            active: "Attended"
        },
        {
            time: "03:00 p.m",
            count: 79458,

            fname: "Tejas",
            lname: "Patil",
            category: "Learining Licence",
            fees: 6213,
            active: "Attended"
        },
        {
            time: "03:00 p.m",
            count: 74581,

            fname: "Raje",
            lname: "Gaikwad",
            category: "Learining Licence",
            fees: 6213,
            active: "Attended"
        },
        {
            time: "03:00 p.m",
            count: 76235,

            fname: "pk",
            lname: "rao",
            category: "Learining Licence",
            fees: 5213,
            active: "Attended"
        },
        {
            time: "03:00 p.m",
            count: 79458,

            fname: "Tejas",
            lname: "Patil",
            category: "Learining Licence",
            fees: 6213,
            active: "Attended"
        },
        {
            time: "03:00 p.m",
            count: 74581,

            fname: "Raje",
            lname: "Gaikwad",
            category: "Learining Licence",
            fees: 6213,
            active: "Attended"
        },
        {
            time: "03:00 p.m",
            count: 79458,

            fname: "Tejas",
            lname: "Patil",
            category: "Learining Licence",
            fees: 6213,
            active: "Attended"
        },
        {
            time: "03:00 p.m",
            count: 74581,

            fname: "Raje",
            lname: "Gaikwad",
            category: "Learining Licence",
            fees: 6213,
            active: "Attended"
        },
    ]


    return (
        <>
            <Container fluid className="slotbg pb-5 mb-4">
                <Container className="calender ">
                    {/* <Col lg={12} className="mt-4 d-flex justify-content-between align-items-center">
                        <button className="btn" onClick={() => changeMonth('prev')} disabled={isCurrentMonth}>
                            <FaArrowLeft />
                        </button>
                        <div className="d-flex flex-grow-1 justify-content-center">
                            <h3 className="calenderheadline mx-4" style={{ margin: '0', textAlign: 'center' }}>
                                {monthNames[currentMonth]} {currentYear}
                            </h3>
                        </div>
                        <button className="btn" onClick={() => changeMonth('next')}>
                            <FaArrowRight />
                        </button>
                    </Col> */}
                    <Col lg={12} className="d-flex justify-content-center align-items-center bg-white">
                        <button className="btn ms-1" onClick={() => changeMonth('prev')}>
                            <img src={leftarrow} className="w-75 arrowimg" alt="Previous" />
                        </button>
                        <h3 className="calenderheadline mx-4">
                            {monthNames[currentMonth]} {currentYear}
                        </h3>
                        <button className="btn ms-1" onClick={() => changeMonth('next')}>
                            <img src={rightarrow} className="w-75 arrowimg" alt="Next" />
                        </button>
                    </Col>

                    <Container className="mt-4">
                        {/* <Card>
                            <Card.Body>This is some text within a card body.</Card.Body>
                        </Card> */}
                        <Table responsive style={{ tableLayout: 'fixed', borderCollapse: 'collapse', width: '100%' }}>
                            <thead>
                                <tr className="text-start">
                                    {daysOfWeek.map((day) => (
                                        <th key={day}>{day}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {weeks.map((week, weekIndex) => (
                                    <tr key={weekIndex} style={{ cursor: 'default' }}>
                                        {week.map((day, dayIndex) => {
                                            const disabled = day && isPastDate(day);

                                            return (
                                                <td
                                                    key={dayIndex}
                                                    onClick={() => !disabled && handleDateClick(day)}
                                                    style={{
                                                        height: "100px",
                                                        textAlign: "end",
                                                        verticalAlign: "middle",
                                                        backgroundColor: day && (day.isNextMonth ? "#f0f0f0" : (disabled ? "#f9f9f9" : "white")),
                                                        color: day && (day.isNextMonth ? "#ccc" : disabled ? "#999" : "black"),
                                                        pointerEvents: day && (disabled ? "none" : "auto"),
                                                        fontFamily: "Poppins",
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    {day && (day.isNextMonth ? day.day : day || "")}
                                                    {renderButtonsForDate(day)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Container>
                </Container>
            </Container>

            <Modal show={show} onHide={handleClose} fullscreen>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selectedDate
                            ? ` ${selectedDate.toLocaleString('default', { weekday: 'long' })}, ${selectedDate.toLocaleDateString()}`
                            : 'No date selected'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Nav variant="tabs" activeKey={key} onSelect={(k) => setKey(k)}>
                        <Nav.Item>
                            <Nav.Link eventKey="details">Customer</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="events">Booking</Nav.Link>
                        </Nav.Item>

                    </Nav>
                    {key === 'details' && (
                        <div className="mt-2">
                            <Table striped bordered hover responsive="sm">
                                <tbody>
                                    {
                                        customer_table.map((a) => {
                                            return (
                                                <>
                                                    <tr>
                                                        <td>{a.time}</td>
                                                        <td>{a.count}</td>
                                                        <td >
                                                            <Button
                                                                variant="success"
                                                                onClick={() => handleShowModal(a)} // Pass customer data
                                                            >
                                                                APPROVED
                                                            </Button>
                                                        </td>
                                                        <td>{a.fname}</td>
                                                        <td>{a.lname}</td>
                                                        <td>{a.category}</td>
                                                        <td>{a.fees}</td>
                                                        <td>{a.active}</td>
                                                    </tr>
                                                </>
                                            )
                                        })
                                    }



                                </tbody>
                            </Table>

                        </div>
                    )}
                    {key === 'events' && (
                        <div>
                            <h5>Events</h5>

                        </div>
                    )}

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Customer Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container fluid>
                        <Row>
                            {selectedCustomer ? (
                                <>
                                    <Col lg={6} md={6} sm={12}>
                                        <b>ID :</b><br /><span> 6231</span>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} className="pb-2">
                                        <Button variant="primary" className="w-100" onClick={() => setLgShow(true)}>Approved</Button>
                                    </Col>
                                    <hr></hr>
                                    <Col lg={6} md={6} sm={12}>
                                        <b>Booking Date </b><br /> 17/2/2024
                                    </Col>
                                    <Col lg={6} md={6} sm={12} className="pb-2">
                                        <b>Payment Method  </b><br />I will pay Locally
                                    </Col>
                                    <hr></hr>
                                    <Col lg={6} md={6} sm={12}>
                                        <b>Submission Date </b><br /> 17/2/2024
                                    </Col>
                                    <Col lg={6} md={6} sm={12} className="pb-2">
                                        <b>First Name  </b><br />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        ) : (
                                            <span>{selectedCustomer.fname}</span>
                                        )}
                                    </Col>
                                    <hr></hr>
                                    <Col lg={6} md={6} sm={12}>
                                        <b>Last Name </b><br />
                                        {/* {selectedCustomer.lname} */}
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        ) : (
                                            <span>{selectedCustomer.lname}</span>
                                        )}
                                    </Col>
                                    <Col lg={6} md={6} sm={12} className="pb-2">
                                        <b>Tranning For  </b><br />{selectedCustomer.category}
                                    </Col>
                                    <hr></hr>
                                    <Col lg={6} md={6} sm={12}>
                                        <b>Cirtificate Number </b><br />9561254187
                                    </Col>
                                    <Col lg={6} md={6} sm={12} className="pb-2">
                                        <b>Tranning Status </b><br />Attended
                                    </Col>
                                    <hr></hr>
                                    <Col lg={6} md={6} sm={12}>
                                        <b>Learining Licenice Number </b> <br />MH15AB2154
                                    </Col>
                                    <Col lg={6} md={6} sm={12} className="pb-2">
                                        <b>Emial  </b><br />sdjhghv@gmail.com
                                    </Col>
                                    <hr></hr>
                                    <Col lg={6} md={6} sm={12}>
                                        <b>Phone No </b><br />7451254189
                                    </Col>
                                    <Col lg={6} md={6} sm={12} className="pb-2">
                                        <b>Vehicle type  </b><br />2 wheelar
                                    </Col>
                                    <hr></hr>
                                    <Col lg={6} md={6} sm={12} className="pb-2">
                                        <b>Print </b>
                                        <Button variant="outline-danger m-3">Print Cirtificate</Button>
                                    </Col>

                                    <hr></hr>


                                </>
                            ) : (
                                <p>No customer selected.</p>
                            )}

                        </Row>
                    </Container>

                </Modal.Body>
                <Modal.Footer>

                    <Button variant="danger">Delete</Button>
                    <Button variant="success" onClick={isEditing ? handleSaveClick : handleEditClick} >{isEditing ? 'Save' : 'Edit'}</Button>
                </Modal.Footer>
            </Modal>


            <Modal
                size="lg"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Change Status
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button variant="danger" className="w-100 mb-2">PENDING</Button>
                    <Button variant="warning" className="w-100 mb-2">CANCELED</Button>
                    <Button variant="secondary" className="w-100 mb-2">CLOSE</Button>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Bookingpackages;
