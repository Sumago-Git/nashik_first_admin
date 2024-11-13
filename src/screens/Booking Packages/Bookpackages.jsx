import React, { useState, useEffect } from "react";
import { Container, Table, Col, Row } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import './bookingpckg.css';
import leftarrow from "../../assets/Holiday/leftarrow.png";
import rightarrow from "../../assets/Holiday/rightarrow.png";
import { confirmAlert } from "react-confirm-alert";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { jsPDF } from "jspdf"; // Import jsPDF
import Categories from "../../components/Categories";
import instance from "../../api/AxiosInstance";

const Bookpackages = ({ tabKey }) => {
    const [show, setShow] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [dataByDateAndCategory, setDataByDateAndCategory] = useState([]);
    const [formatedDateData, setFormatedDate] = useState();

    const [lgShow, setLgShow] = useState(false);
    const [rowModal, setRowModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);

    const [show2, setShow2] = useState(false);

    const handleClose2 = () => setShow1(false);
    const handleShow2 = () => setShow2(true);



    // const handleRowClick = (rowData) => {
    //     setSelectedRowData(rowData);
    //     setRowModal(true);
    // };
    const getUserDataByCategoryAndDate = (date) => {
        const newdate = date.split(' ')[1]; // Get "14/11/2024"
        const [day, month, year] = newdate.split('/'); // Split into day, month, and year
        const formattedDate = `${month}/${day}/${year}`; // Rearrange to "MM/DD/YYYY"

        // Construct the data object with the formatted date
        let data = {
            category: categoryName,
            slotdate: formattedDate // Use the formatted date here
        };
        instance.post("bookingform/get-bookingentries-by-date-category", data).then((result) => {
            console.log("result", result);
            setDataByDateAndCategory(result.data.responseData)
        }).catch((error) => {
            console.log("error", error);

        })
    }

    const handleApprovedButtonClick = (event) => {
        event.stopPropagation(); // Prevent row click event from firing
        setLgShow(true);
    };


    const [selectedBooking, setSelectedBooking] = useState(null); // New state for selected booking

    const [isEditing, setIsEditing] = useState(false); // State for edit mode

    const handleEdit = () => {
        setIsEditing(true); // Enable edit mode
    };

    const handleSave = () => {
        // Here you can add logic to save changes to your state or backend
        setIsEditing(false); // Disable edit mode
        let updatedBooking = { ...selectedBooking };

        if (typeof updatedBooking.vehicletype === "string") {
            if (updatedBooking.vehicletype.includes(",")) {
                // Split comma-separated string into an array
                updatedBooking.vehicletype = updatedBooking.vehicletype.split(",").map(item => item.trim());
            } else {
                // Wrap single value string in an array
                updatedBooking.vehicletype = [updatedBooking.vehicletype.trim()];
            }
        } else if (!Array.isArray(updatedBooking.vehicletype)) {
            // If vehicletype is neither string nor array, wrap it as a single-value array
            updatedBooking.vehicletype = [updatedBooking.vehicletype];
        }

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

    const [currentDate, setCurrentDate] = useState(new Date());
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

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const changeMonth = (direction) => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setMonth(direction === 'prev' ? newDate.getMonth() - 1 : newDate.getMonth() + 1);
            return newDate;
        });
    };

    const isPastDate = (day) => {
        const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate < today;
    };

    const getSpecialDateLabel = (day) => {
        return specialDates.find(dateObj => dateObj.date === day);
    };

    const handleDayClick = (day) => {
        if (day && !isPastDate(day)) {
            const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            console.log("clickedDate", clickedDate);

            const dayOfWeek = daysOfWeek[clickedDate.getDay()];
            const formattedDate = clickedDate.toLocaleDateString();
            setSelectedDate(formattedDate);
            setSelectedDay(dayOfWeek);
            handleShow();
            const date = new Date(clickedDate);
            const dayName = new Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(date);
            const datePart = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
            const formattedDateToMatchWithFrontend = `${dayName} ${datePart}`;
            getUserDataByCategoryAndDate(formattedDateToMatchWithFrontend)
            setFormatedDate(formattedDateToMatchWithFrontend)
            console.log("formattedDateToMatchWithFrontend", formattedDateToMatchWithFrontend);

        }
    };

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

        // Set font for the user's name
        doc.setFont("cursive");
        doc.setFontSize(36);
        doc.setTextColor("#4e4e95");

        // Prepare user's name
        const nameText = `${selectedBooking.fname} ${selectedBooking.lname}`;
        const nameWidth = doc.getTextWidth(nameText); // Get the width of the name text

        // Calculate position for centered text
        const xPosition = (210 - nameWidth) / 2; // Centering in a A4 size PDF
        const yPosition = 115; // Adjust as needed for vertical positioning

        // Draw user's name
        doc.text(nameText, xPosition, yPosition);

        // Optional: Draw additional details (if needed)
        doc.setFontSize(24); // Font size for additional details
        doc.setFont("Arial"); // Font for additional details
        doc.setTextColor("#000"); // Color for additional text



        // Save the PDF
        doc.save(`${selectedBooking.fname}_certificate.pdf`); // Save the PDF with the user's name
    };



    const handleRowClick = (a) => {
        console.log("aaaa", a);

        setSelectedBooking(a); // Set the selected booking data
        handleShow1();
    };

    return (
        <>
            <Container fluid className="slotbg mt-4">
                {
                    !categoryName ? <Categories setCategoryName={setCategoryName} /> :
                        <Container className="calender">
                            <Col lg={12} className="d-flex justify-content-center align-items-center bg-white">
                                <button className="btn ms-1" onClick={() => changeMonth('prev')}>
                                    <img src={leftarrow} className="w-75 arrowimg" alt="Previous" />
                                </button>
                                <h3 className="calenderheadline mx-4">
                                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </h3>
                                <button className="btn ms-1" onClick={() => changeMonth('next')}>
                                    <img src={rightarrow} className="w-75 arrowimg" alt="Next" />
                                </button>
                            </Col>

                            <Container className="mt-4 card py-4">
                                <Table responsive style={{ tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr className="text-start">
                                            {daysOfWeek.map((day) => <th key={day}>{day}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {weeks.map((week, weekIndex) => (
                                            <tr key={weekIndex}>
                                                {week.map((day, dayIndex) => (
                                                    <td
                                                        key={dayIndex}
                                                        onClick={() => handleDayClick(day)}
                                                        style={{
                                                            height: "100px",
                                                            textAlign: "end",
                                                            verticalAlign: "middle",
                                                            backgroundColor: day ? (isPastDate(day) ? "#f7f7f7" : "white") : "#f0f0f0",
                                                            color: day ? (isPastDate(day) ? "black" : "black") : "transparent",
                                                            cursor: day && !isPastDate(day) ? "pointer" : "default",
                                                            fontFamily: "Poppins",
                                                            fontWeight: "600",
                                                            opacity: isPastDate(day) ? 0.5 : 1,
                                                            borderLeft: "1px solid #ddd",
                                                        }}
                                                    >
                                                        <div style={{ textAlign: "end" }}>{day || ""}</div>
                                                        <br />
                                                        {day && !isPastDate(day) && getSpecialDateLabel(day) && (
                                                            <div style={{
                                                                fontSize: "0.8rem",
                                                                padding: "4px 8px",
                                                                borderRadius: "12px",
                                                                ...getSpecialDateLabel(day).style,
                                                                width: "70px",
                                                                textAlign: "center",
                                                                whiteSpace: "nowrap",
                                                                margin: "0 auto",
                                                            }}>
                                                                {isMobileView ? getSpecialDateLabel(day).label.charAt(0) : getSpecialDateLabel(day).label}
                                                            </div>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Container>
                        </Container>
                }
            </Container>

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
                        <Tab eventKey="tab1" title="Customer">dksfhehiso
                            <Table striped bordered hover responsive="sm">
                                <tbody>
                                    {
                                        dataByDateAndCategory.length == 0 ? <p className="fw-bold ">No Data Found</p> :
                                            dataByDateAndCategory.map((a) => {
                                                console.log("a", a);

                                                return (
                                                    <>
                                                        <tr onClick={() => { handleRowClick(a) }}>
                                                            <td>{a.slotsession}</td>
                                                            <td>{a.user_id}</td>
                                                            <td> <Button variant="primary" className="w-100">
                                                                {a.status}
                                                            </Button></td>
                                                            <td>{a.fname}</td>
                                                            <td>{a.lname}</td>
                                                            <td>{a.category}</td>
                                                            <td>{a.certificate_no}</td>
                                                            <td>{a.training_status}</td>
                                                        </tr>
                                                    </>
                                                )
                                            })
                                    }
                                </tbody>
                            </Table>
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
                                    <b>Booking Date</b><br />
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            onChange={EditDate}
                                        />
                                    ) : (
                                        selectedBooking.slotdate
                                    )}
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <b>Payment Method</b><br />
                                    {selectedBooking.payment_method}
                                </Col>
                                <hr></hr>

                                <Col lg={6} md={6} sm={12} className="pb-4">
                                    <b>Submission Date</b><br />
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            defaultValue={selectedBooking.submission_date}
                                            onChange={EditSubmissionDate}
                                        />
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
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <b>First Name:</b><br />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            defaultValue={selectedBooking.fname}
                                            onChange={(e) => setSelectedBooking({ ...selectedBooking, fname: e.target.value })}
                                        />
                                    ) : (
                                        selectedBooking.fname
                                    )}
                                </Col>
                                <hr></hr>

                                <Col lg={6} md={6} sm={12} className="pb-4">
                                    <b>Last Name</b><br />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            defaultValue={selectedBooking.lname}
                                            onChange={(e) => setSelectedBooking({ ...selectedBooking, lname: e.target.value })}
                                        />
                                    ) : (
                                        selectedBooking.lname
                                    )}
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <b>Training For</b><br />
                                    {isEditing ? (
                                        <select
                                            defaultValue={selectedBooking.category}
                                            onChange={(e) => setSelectedBooking({ ...selectedBooking, category: e.target.value })}
                                        >
                                            <option value="RTO – Learner Driving License Holder Training">RTO – Learner Driving License Holder Training</option>
                                            <option value="RTO – Suspended Driving License Holders Training">RTO – Suspended Driving License Holders Training</option>
                                            <option value="RTO – Training for School Bus Driver">RTO – Training for School Bus Driver</option>
                                            <option value="School Students Training – Group">School Students Training – Group</option>
                                            <option value="College/Organization Training – Group">College/Organization Training – Group</option>
                                            <option value="College / Organization Training – Individual">College / Organization Training – Individual</option>
                                            {/* Add other options as needed */}
                                        </select>
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
                                        <select
                                            defaultValue={selectedBooking.training_status}
                                            onChange={(e) => setSelectedBooking({ ...selectedBooking, training_status: e.target.value })}
                                        >
                                            <option value="Attended">Attended</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Not Confirmed">Not Confirmed</option>
                                            <option value="Absent">Absent</option>
                                            {/* Add other options as needed */}
                                        </select>
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
                                    <b>Email</b><br />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            defaultValue={selectedBooking.email}
                                            onChange={(e) => setSelectedBooking({ ...selectedBooking, email: e.target.value })}
                                        />
                                    ) : (
                                        selectedBooking.email
                                    )}
                                </Col>
                                <hr></hr>

                                <Col lg={6} md={6} sm={12} className="pb-4">
                                    <b>Phone Number</b><br />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            defaultValue={selectedBooking.phone}
                                            onChange={(e) => setSelectedBooking({ ...selectedBooking, phone: e.target.value })}
                                        />
                                    ) : (
                                        selectedBooking.phone
                                    )}
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <b>Vehical Type</b><br />
                                    {selectedBooking.vehicletype}
                                </Col>
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

export default Bookpackages;
