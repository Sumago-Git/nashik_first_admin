import React, { useState } from "react";
import { Container, Table, Col } from "react-bootstrap";
import leftarrow from "../../assets/images/Holiday/leftarrow.png";
import rightarrow from "../../assets/images/Holiday/rightarrow.png";
import { confirmAlert } from "react-confirm-alert";
import instance from "../../api/AxiosInstance";
import { toast } from "react-toastify";

const Holiday = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(false)
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

    // Function to change the month when clicking the arrows
    const changeMonth = (direction) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            if (direction === 'prev') {
                newDate.setMonth(newDate.getMonth() - 1);
            } else if (direction === 'next') {
                newDate.setMonth(newDate.getMonth() + 1);
            }
            return newDate;
        });
    };
    const fetchHoliday = async () => {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken"); // Retrieve access token
        try {
            const response = await instance.get("/holiday/find-holidays", {
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "application/json",
                },
            });
            console.log("response", response);

        } catch (error) {
            console.error(
                "Error fetching team:",
                error.response || error.message || error
            );
        } finally {
            setLoading(false);
        }
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

    // Function to handle day click
    const handleDayClick = (day) => {
        if (day) {
            const clickedDate = new Date(currentYear, currentMonth, day);
            console.log(`Selected Date: ${clickedDate.toLocaleDateString()}`);
            alertBox(clickedDate.toLocaleDateString())
        }
    };

    return (
        <>
            <Container fluid className="slotbg">
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
                                    <tr key={weekIndex}>
                                        {week.map((day, dayIndex) => (
                                            <td
                                                key={dayIndex}
                                                onClick={() => handleDayClick(day)} // Add click event
                                                style={{
                                                    height: "100px",
                                                    textAlign: "end",
                                                    verticalAlign: "middle",
                                                    backgroundColor: day ? "white" : "#f0f0f0",
                                                    color: day ? "black" : "transparent",
                                                    fontFamily: "Poppins",
                                                    fontWeight: "600",
                                                    cursor: day ? "pointer" : "default" // Make clickable cells appear interactive
                                                }}
                                            >
                                                {day || ""} {/* Display the day or empty cell */}
                                            </td>
                                        ))}
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

export default Holiday;
