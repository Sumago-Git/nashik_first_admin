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
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { useLocation } from 'react-router-dom';
import Backbtn from "../../components/Calender Component/Backbtn";
const Bookpackages = ({ tabKey }) => {

    const location = useLocation();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [hoveredDay, setHoveredDay] = useState(null);
    const navigate = useNavigate();
    const [selectedButton, setSelectedButton] = useState("RTO – Learner Driving License Holder Training");
    const [specialDates, setspecialDates] = useState([]);
    const [btno, setbrno] = useState(1, "RTO – Learner Driving License Holder Training");
    const [dateStatuses, setDateStatuses] = useState({}); // State to store date statuses



    const [isMobile, setIsMobile] = useState(false);

    // Function to handle window resizing and set mobile state
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // If window width is less than or equal to 768px, it's mobile
        };

        // Initial check
        handleResize();

        // Add event listener to track window resizing
        window.addEventListener('resize', handleResize);

        // Cleanup listener
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const savedCategory = localStorage.getItem("category");
    const getdata_here = () => {
        instance.post('/Sessionslot/getAvailableslotslots', {

            year: currentYear.toString(),
            month: (currentMonth + 1).toString(),
            category: savedCategory,
        })
            .then((res) => {
                const slotData = res.data.data.reduce((acc, slot) => {
                    // Add the status of each date to the dateStatuses state
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

    const getSpecialDateDetails = (day, month) => {
        return specialDates.find((special) => special.day === day && special.month === month) || {};
    };

    const handleMonthChange = (month) => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setMonth(month);
            return newDate;
        });
    };

    const handleYearChange = (year) => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setFullYear(year);
            return newDate;
        });
    };

    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 7;
        const endYear = currentYear + 3;
        return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
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

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const today = new Date();
    const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();

    const handleDateClick = (day) => {
        // if (dateStatuses[day] === "available") { // Only handle click if the status is "Available"
        const clickedDate = new Date(currentYear, currentMonth, day);
        window.scrollTo(0, 700);
        navigate("/Slotlistpage", { state: { selectedDate: clickedDate, category: selectedButton } });
        // }
    };

    const isPastDate = (day) => {
        const dateToCheck = new Date(currentYear, currentMonth, day);
        return dateToCheck < today.setHours(0, 0, 0, 0);
    };


    const changeMonth = (direction) => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            if (direction === 'prev') {
                newDate.setMonth(newDate.getMonth() - 1);
            } else if (direction === 'next') {
                newDate.setMonth(newDate.getMonth() + 1);
            }
            return newDate;
        });
    };





    return (
        <>
        <Backbtn/>
            <Container fluid className="slotbg mt-4">

                <Container className="calender">

                    <Col lg={12} className="d-flex justify-content-center align-items-center bg-white">
                        <button
                            className="btn ms-1"
                            onClick={() => changeMonth('prev')}
                        >
                            <img src={leftarrow} className="w-75 arrowimg" alt="Previous" />
                        </button>

                        <div className="mx-4 d-flex align-items-center">
                            <select
                                value={currentMonth}
                                onChange={(e) => handleMonthChange(Number(e.target.value))}
                                className="form-select me-2"
                                style={{ width: "150px" }}
                            >
                                {monthNames.map((month, index) => (
                                    <option key={index} value={index}>
                                        {month}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={currentYear}
                                onChange={(e) => handleYearChange(Number(e.target.value))}
                                className="form-select"
                                style={{ width: "100px" }}
                            >
                                {generateYearOptions().map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            className="btn ms-1"
                            onClick={() => changeMonth('next')}
                        >
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
                                            const isAvailable = dateStatuses[day] === "available"; // Check status from state

                                            return (
                                                <td
                                                    key={dayIndex}
                                                    onMouseEnter={() => day && !isDisabled && setHoveredDay(day)}
                                                    onMouseLeave={() => day && !isDisabled && setHoveredDay(null)}
                                                    onClick={() => handleDateClick(day)}
                                                    style={{
                                                        height: "100px",
                                                        textAlign: "end",
                                                         cursor: "pointer",
                                                        verticalAlign: "middle",
                                                        borderRight: "1px solid #ddd",
                                                        backgroundColor: day
                                                            ? dateStatuses[day] === "Holiday"
                                                                ? "#ea7777" // Light blue for holiday
                                                                : "white" // Default background color
                                                            : "white",
                                                        color: day
                                                            ? day.isNextMonth
                                                                ? "#ccc" // Light color for next month's dates
                                                                : isDisabled || dateStatuses[day] === "Holiday"
                                                                    ? "black" // Gray for disabled or holiday
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
                                                        dateStatuses[day] !== "Holiday" && // Check if the day is NOT a holiday
                                                        specialDates.find((date) => date.day === day) &&
                                                        (
                                                            <div>
                                                                {specialDates.find((date) => date.day === day)?.slots?.length > 0 ? (
                                                                    specialDates
                                                                        .find((date) => date.day === day)
                                                                        ?.slots.map((a) => (
                                                                            <div
                                                                                key={a.time} // Ensure unique keys for React elements
                                                                                style={{
                                                                                    fontSize: "12px",
                                                                                    width: "50%",
                                                                                    marginTop: "2px",
                                                                                    color: a.availableSeats <= 0 ? "red" : "green",
                                                                                    backgroundColor: a.availableSeats <= 0 ? "#ffd4d4" : "#d4ffd4", // Dynamically set background color
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

            </Container>



        </>
    );
};

export default Bookpackages;
