import React, { useState, useEffect, useCallback } from "react";
import { Container, Table, Col, Modal } from "react-bootstrap";
import leftarrow from "../../assets/images/Holiday/leftarrow.png";
import rightarrow from "../../assets/images/Holiday/rightarrow.png";
import { confirmAlert } from "react-confirm-alert";
import instance from "../../api/AxiosInstance";
import { toast } from "react-toastify";
import SlotComp from "../SlotComp/SlotComp";
import { useLocation } from 'react-router-dom';

const CalenderComp = () => {
    const location = useLocation();
    const { categoryName, tabKey } = location.state || {};
    console.log("tabKey", tabKey);
    const [team, setTeam] = useState([]);
    const [myDay, setMyDay] = useState(""); // Add state for day name

    const [newdate, setnewdate] = useState("")
    const [specialDates, setSpecialDates] = useState([]);
    const [dateStatuses, setDateStatuses] = useState({}); // State to store date statuses
    const [hoveredDay, setHoveredDay] = useState(null);
    const [comp, setComp] = useState("false")
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(false)
    const [selectedDates, setSelectedDate] = useState("")
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
    // Helper function to get the number of days in the current month
    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Helper function to get the first day of the month (which weekday it starts on)
    const getFirstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
    };

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get number of days in the current month and the starting day (weekday)
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const startingDay = getFirstDayOfMonth(currentMonth, currentYear);

    // Create an array with the number of days in the current month
    const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);

    // Create the first week, which may include empty cells if the month doesn't start on Sunday
    const firstWeek = Array(startingDay).fill(null).concat(daysArray.slice(0, 7 - startingDay));

    // Helper function to divide the days into weeks (7 days per week)
    const chunkArray = (arr, size) => {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    };

    // Create weeks for the calendar
    const weeks = chunkArray(daysArray.slice(7 - startingDay), 7);
    weeks.unshift(firstWeek); // Add the first week at the beginning

    // Fill the last week with empty cells if necessary
    const lastWeek = weeks[weeks.length - 1];
    const remainingCells = 7 - lastWeek.length;
    lastWeek.push(...Array(remainingCells).fill(null));

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];


    const getSpecialDateDetails = (day, month) => {
        return specialDates.find((special) => special.day === day && special.month === month) || {};
    };
    const changeMonth = (direction) => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            if (direction === "prev") {
                // Check if the current date is in the current month and year
                const isCurrentMonth = newDate.getMonth() === new Date().getMonth() && newDate.getFullYear() === new Date().getFullYear();
                if (isCurrentMonth) {
                    return prevDate; // Do nothing if it's the current month
                }
                newDate.setMonth(newDate.getMonth() - 1);
            } else if (direction === "next") {
                newDate.setMonth(newDate.getMonth() + 1);
            }
            return newDate;
        });
    };


    function alertBox(selectedDate) {
        confirmAlert({
            title: "Confirm to delete",
            message: "Are you sure you want to mark " + selectedDate + " as Holiday?",
            customUI: ({ onClose }) => (
                <div
                    style={{
                        textAlign: "left",
                        padding: "20px",
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(5, 5, 5, 0.2)",
                        maxWidth: "400px",
                        margin: "0 auto",
                    }}
                >
                    <h2>Confirmation Alert</h2>
                    <p>Are you sure you want to mark {selectedDate} as Holiday?</p>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "20px",
                        }}
                    >
                        <button
                            style={{ marginRight: "10px" }}
                            className="btn btn-primary"
                            onClick={async () => {
                                setLoading(true);
                                const newData = {
                                    holiday_date: selectedDate,
                                };
                                const accessToken = localStorage.getItem("accessToken");
                                try {
                                    await instance.post("holiday/create-holiday", newData, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`,
                                            "Content-Type": "application/json",
                                        },
                                    });
                                    toast.success("Date added successfully");
                                    fetchHoliday(); // Fetch updated holidays
                                    onClose(); // Close the alert here only if the API call is successful
                                } catch (error) {
                                    console.error("Error adding data:", error);
                                    toast.error("Error adding data");
                                    // Do not close the alert if there's an error
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            Yes
                        </button>
                        <button className="btn btn-secondary" onClick={onClose}>
                            No
                        </button>
                    </div>
                </div>
            ),
        });
    }
    const today = new Date();
    const isPastDate = (day) => {
        const dateToCheck = new Date(currentYear, currentMonth, day);
        return dateToCheck <= today.setHours(0, 0, 0, 0);
    };


    // Function to handle day click

    const handleDayClick = (day, weekday) => {
        if (day) {
            const clickedDate = new Date(currentYear, currentMonth, day);
            const newDateString = clickedDate.toLocaleDateString();

            setSelectedDate(newDateString); // Update selected date
            setnewdate(newDateString); // Update the new date string
            setMyDay(weekday); // Set the day name
            fetchTeam(); // Call fetchTeam() with updated selectedDates

            if (tabKey === "Closed Days") {
                alertBox(newDateString); // Pass the date here
            } else {
                handleShowModal(); // Show the modal
            }
        }
    };

    const fetchTeam = async () => {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken"); // Retrieve access token
        try {
            const response = await instance.post("Sessionslot/get-getSessionbySessionslot2", { slotdate: selectedDates, slotType: "inhouse" }, {
                headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
            });
            const filteredData = response.data.responseData?.reverse()
            setTeam(filteredData);
            console.log('dfh', filteredData)


        } catch (error) {
            console.error(
                "Error fetching team:",
                error.response || error.message || error
            );
        } finally {
            setLoading(false);
        }
    };
    const isHoliday = (day) => {
        return specialDates.some(specialDate =>
            specialDate.date.getDate() === day &&
            specialDate.date.getMonth() === currentMonth &&
            specialDate.date.getFullYear() === currentYear
        );
    };
    const isFutureOrToday = (day) => {
        const today = new Date();
        const selectedDate = new Date(currentYear, currentMonth, day);
        return selectedDate >= today;
    };
    const savedCategory = localStorage.getItem("categoryforslot");

    const getdata_here = () => {
        instance.post('/Sessionslot/getAvailableslotslots2', {
            slotType: 'inhouse',
            year: currentYear.toString(),
            month: (currentMonth + 1).toString(),
            // category: savedCategory,
        })
            .then((res) => {
                const slotData = res.data.data.reduce((acc, slot) => {
                    // Add the status of each date to the dateStatuses state
                    acc[slot.day] = slot.status;
                    return acc;
                }, {});

                setDateStatuses(slotData);
                setSpecialDates(res.data.data.map(slot => ({
                    day: slot.day,
                    status: slot.status,
                    totalCapacity: slot.totalCapacity,
                    totalSlots: slot.totalSlots,
                    totalAvailableSeats: slot.totalAvailableSeats,
                    label: slot.status === "available" ? "Available" : slot.status === "Holiday" ? "Holiday" : "Closed",
                    color: slot.status === "Holiday" ? "#ff0000" : (slot.status === "available" ? "green" : "red"),
                    bgColor: slot.status === "Holiday" ? "#ea7777" : (slot.status === "available" ? "#d4ffd4" : "#ffd4d4"),
                    isHoliday: slot.status === "Holiday",
                })));
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        // Fetch holidays on component mount
        getdata_here()
    }, [currentDate, showModal]);
    useEffect(() => {
        if (selectedDates) {
            fetchTeam();
        }
    }, [selectedDates]);
    const selectedDateIsPast = isPastDate(new Date(selectedDates).getDate());
    return (
        <>
            <Container fluid className="slotbg">
                {/* <div><h2>{savedCategory}</h2></div> */}
                <Container className="calender">
                    <Col lg={12} className="d-flex justify-content-center align-items-center bg-white">
                        <button
                            className="btn ms-1"
                            onClick={() => changeMonth('prev')}
                        >
                            <img src={leftarrow} className="w-75 arrowimg" alt="Previous" />
                        </button>
                        <h3 className="calenderheadline mx-4">
                            {monthNames[currentMonth]} {currentYear}
                        </h3>
                        <button
                            className="btn ms-1"
                            onClick={() => changeMonth('next')}
                        >
                            <img src={rightarrow} className="w-75 arrowimg" alt="Next" />
                        </button>
                    </Col>

                    <Container className="mt-4 card py-4">
                        <Table
                            bordered
                            responsive
                            style={{
                                tableLayout: 'fixed',
                                borderCollapse: 'collapse',
                            }}
                        >
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
                                            const isDisabled = day && isPastDate(day);
                                            const { label: dateLabel, color: textColor, bgColor, isHoliday } = getSpecialDateDetails(day, currentMonth);
                                            const isAvailable = dateStatuses[day] === "available"; // Check status from state
                                            const weekday = day !== null ? daysOfWeek[new Date(currentYear, currentMonth, day).getDay()] : ""; // Calculate weekday

                                            return (
                                                <td
                                                    key={dayIndex}
                                                    onMouseEnter={() => day && !isDisabled && setHoveredDay(day)}
                                                    onMouseLeave={() => day && !isDisabled && setHoveredDay(null)}
                                                    onClick={() => day && dateStatuses[day] !== "Holiday" && handleDayClick(day, weekday)} // Pass weekday here
                                                    style={{
                                                        height: "100px",
                                                        textAlign: "end",
                                                        verticalAlign: "middle",
                                                        borderRight: "1px solid #ddd",
                                                        backgroundColor: day
                                                            ? isDisabled
                                                                ? "#f9f9f9" // Disabled (past dates or holidays)
                                                                : dateStatuses[day] === "available"
                                                                    ? "#d4ffd4" // Green for available
                                                                    : dateStatuses[day] === "Holiday"
                                                                        ? "#ea7777" // Light blue for holiday
                                                                        : "#d4ffd4" // Red for closed or other statuses
                                                            : "white",
                                                        color: day
                                                            ? isDisabled || dateStatuses[day] === "Holiday"
                                                                ? "#999" // Gray for disabled or holiday
                                                                : "black"
                                                            : "black",
                                                        fontFamily: "Poppins",
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    {day && (
                                                        <>

                                                            <div>{day}</div>
                                                        </>
                                                    )}
                                                    <br />
                                                    {specialDates &&
                                                        specialDates.length > 0 &&
                                                        dateStatuses[day] !== "Holiday" && // Ensure the day is not a holiday
                                                        specialDates.find((date) => date.day === day && date.totalSlots > 0) && ( // Check if totalSlots is greater than 0
                                                            <div
                                                                style={{
                                                                    fontSize: "10px",

                                                                    borderRadius: "15px",
                                                                    display: "inline-block",
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                <h6>
                                                                    totalSlots: {specialDates.find((date) => date.day === day)?.totalSlots}
                                                                </h6>
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
            <SlotComp showModal={showModal}
                handleCloseModal={handleCloseModal}
                handleShowModal={handleShowModal}
                selectedDates={selectedDates}
                realdata={team}
                isPast={selectedDateIsPast}
                categoryName={categoryName}
                todayname={myDay}
            />
        </>
    );
};

export default CalenderComp;
