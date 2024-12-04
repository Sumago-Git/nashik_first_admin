import React, { useState, useEffect } from "react";
import { Container, Table, Col, Row, Modal, Button } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import './bookingpckg.css';
import leftarrow from "../../assets/Holiday/leftarrow.png";
import rightarrow from "../../assets/Holiday/rightarrow.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import instance from "../../api/AxiosInstance";

const Bookpackagesmodal = ({ tabKey, showModal, handleClose, savedCategory, passSelectedDate }) => {
    const location = useLocation();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [hoveredDay, setHoveredDay] = useState(null);
    const navigate = useNavigate();
    const [selectedButton, setSelectedButton] = useState("RTO – Learner Driving License Holder Training");
    const [specialDates, setspecialDates] = useState([]);
    const [dateStatuses, setDateStatuses] = useState({});
    const [isMobile, setIsMobile] = useState(false);

    // Handle window resizing to check if the device is mobile
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const getdata_here = () => {
        instance.post('/Sessionslot/getAvailableslotslots', {
            slotType: 'inhouse',
            year: currentYear.toString(),
            month: (currentMonth + 1).toString(),
            category: savedCategory,
        })
            .then((res) => {
                const slotData = res.data.data.reduce((acc, slot) => {
                    acc[slot.day] = slot.status;
                    return acc;
                }, {});

                setDateStatuses(slotData);
                setspecialDates(res.data.data.map(slot => ({
                    day: slot.day,
                    status: slot.status,
                    totalCapacity: slot.totalCapacity,
                    totalAvailableSeats: slot.totalAvailableSeats,
                    label: slot.status === "available" ? "Available" : slot.status === "Holiday" ? "Holiday" : "Closed",
                    color: slot.status === "Holiday" ? "red" : (slot.status === "available" ? "green" : "red"),
                    bgColor: slot.status === "Holiday" ? "#ea7777" : (slot.status === "available" ? "#d4ffd4" : "#ffd4d4"),
                    isHoliday: slot.status === "Holiday",
                    slots: slot.slots
                })));
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();
    const getSpecialDateDetails = (day, month) => specialDates.find((special) => special.day === day && special.month === month) || {};

    const changeMonth = (direction) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : +1));
            return newDate;
        });
    };

    useEffect(() => {
        getdata_here();
    }, [currentDate]);

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);
    const startingDay = getFirstDayOfMonth(currentMonth, currentYear);
    const firstWeek = Array(startingDay).fill(null).concat(daysArray.slice(0, 7 - startingDay));
    const chunkArray = (arr, size) => {
        const result = [];
        for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
        return result;
    };
    const weeks = chunkArray(daysArray.slice(7 - startingDay), 7);
    weeks.unshift(firstWeek);

    const lastWeek = weeks[weeks.length - 1];
    const remainingCells = 7 - lastWeek.length;
    const nextMonthDays = Array.from({ length: remainingCells }, (_, index) => index + 1);
    lastWeek.push(...nextMonthDays.map(day => ({ day, isNextMonth: true })));

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const today = new Date();
    const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();

    const handleDateClick = (clickedDay) => {
        const clickedDate = new Date(currentYear, currentMonth , clickedDay); // Note the adjustment for month (0-indexed)

        const year = clickedDate.getFullYear();
        const month = (clickedDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed (0 = January)
        const day = clickedDate.getDate().toString().padStart(2, '0'); // Ensure day is two digits

        // Format as yyyy-mm-dd
        const formattedDate = `${year}-${month}-${day}`;
        passSelectedDate(formattedDate);
        handleClose();
    };


    const isPastDate = (day) => {
        const dateToCheck = new Date(currentYear, currentMonth, day);
        return dateToCheck < today.setHours(0, 0, 0, 0);
    };

    return (
        <Modal show={showModal} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className="calender">
                    <Col lg={12} className="d-flex justify-content-center align-items-center bg-white">
                        <button className="btn ms-1" onClick={() => { changeMonth('prev'); }}>
                            <img src={leftarrow} className="w-75 arrowimg" alt="Previous" />
                        </button>
                        <h3 className="calenderheadline mx-4">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h3>
                        <button className="btn ms-1" onClick={() => { changeMonth('next'); }}>
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
                                    <tr key={weekIndex} style={{ cursor: 'default' }}>
                                        {week.map((day, dayIndex) => {
                                            const isDisabled = day && isPastDate(day);
                                            const { label: dateLabel, color: textColor, bgColor, isHoliday } = getSpecialDateDetails(day, currentMonth);
                                            const isAvailable = dateStatuses[day] === "available";

                                            return (
                                                <td
                                                    key={dayIndex}
                                                    onMouseEnter={() => day && !isDisabled && setHoveredDay(day)}
                                                    onMouseLeave={() => day && !isDisabled && setHoveredDay(null)}
                                                    onClick={() => handleDateClick(day)}
                                                    style={{
                                                        height: "100px",
                                                        textAlign: "end",
                                                        verticalAlign: "middle",
                                                        borderRight: "1px solid #ddd",
                                                        backgroundColor: day
                                                            ? dateStatuses[day] === "Holiday"
                                                                ? "#ea7777"
                                                                : "white"
                                                            : "white",
                                                        color: day
                                                            ? day.isNextMonth
                                                                ? "#ccc"
                                                                : isDisabled || dateStatuses[day] === "Holiday"
                                                                    ? "black"
                                                                    : "black"
                                                            : "black",
                                                        pointerEvents: day && dateStatuses[day] === "Holiday" ? "none" : "auto",
                                                        transition: 'color 0.3s',
                                                        fontFamily: "Poppins",
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    {day && (day.isNextMonth ? day.day : day || "")}
                                                    <br />
                                                    {specialDates &&
                                                        specialDates.length > 0 &&
                                                        dateStatuses[day] !== "Holiday" &&
                                                        specialDates.find((date) => date.day === day) &&
                                                        !isPastDate(day) && (
                                                            <div>
                                                                {specialDates.find((date) => date.day === day)?.slots?.length > 0 ? (
                                                                    specialDates
                                                                        .find((date) => date.day === day)
                                                                        ?.slots.map((a) => (
                                                                            <div
                                                                                key={a.time}
                                                                                style={{
                                                                                    fontSize: "12px",
                                                                                    width: "50%",
                                                                                    marginTop: "2px",
                                                                                    color: a.availableSeats === 0 ? "red" : "green",
                                                                                    backgroundColor: a.availableSeats === 0 ? "#ffd4d4" : "#d4ffd4",
                                                                                    padding: "3px 8px",
                                                                                    borderRadius: "15px",
                                                                                    display: "grid",
                                                                                    fontWeight: "bold",
                                                                                }}
                                                                            >
                                                                                {a.time}
                                                                            </div>
                                                                        ))
                                                                ) : (
                                                                    <div
                                                                        style={{
                                                                            fontSize: "12px",
                                                                            width: "100%",
                                                                            marginTop: "2px",
                                                                            color: "gray",
                                                                            backgroundColor: "#f0f0f0",
                                                                            padding: "3px 8px",
                                                                            borderRadius: "15px",
                                                                            textAlign: "center",
                                                                            fontWeight: "bold",
                                                                        }}
                                                                    >
                                                                        No slot available
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Container>
                </Container>
            </Modal.Body>
        </Modal>
    );
};




export default Bookpackagesmodal