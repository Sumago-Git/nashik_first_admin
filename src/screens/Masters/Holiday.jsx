import React, { useEffect, useState } from "react";
import { Container, Table, Col } from "react-bootstrap";
import leftarrow from "../../assets/images/Holiday/leftarrow.png";
import rightarrow from "../../assets/images/Holiday/rightarrow.png";
import { confirmAlert } from "react-confirm-alert";
import instance from "../../api/AxiosInstance";
import { toast } from "react-toastify";

const Holiday = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [specialDates, setSpecialDates] = useState([]);
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const fetchHolidays = () => {
        instance.get("holiday/get-holidays")
            .then((res) => {
                const holidayData = res.data.responseData.map((holiday) => ({
                    date: new Date(holiday.holiday_date),
                    label: "Holiday",
                    color: "red",
                    bgColor: "#ffd4d4",
                }));
                setSpecialDates(holidayData);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        // Fetch holidays on component mount
        fetchHolidays();
    }, []);

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const startingDay = getFirstDayOfMonth(currentMonth, currentYear);

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
    const remainingCells = 7 - lastWeek.length;
    lastWeek.push(...Array(remainingCells).fill(null));

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const changeMonth = (direction) => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            if (direction === "prev") {
                newDate.setMonth(newDate.getMonth() - 1);
            } else if (direction === "next") {
                newDate.setMonth(newDate.getMonth() + 1);
            }
            return newDate;
        });
    };

    const alertBox = (selectedDate) => {
        confirmAlert({
            title: "Confirm to delete",
            message: `Are you sure you want to mark ${selectedDate} as Holiday?`,
            customUI: ({ onClose }) => (
                <div style={{ padding: "20px", backgroundColor: "white", borderRadius: "8px" }}>
                    <h2>Confirmation Alert</h2>
                    <p>Are you sure you want to mark {selectedDate} as Holiday?</p>
                    <button
                        className="btn btn-primary"
                        onClick={async () => {
                            setLoading(true);
                            const newData = { holiday_date: selectedDate };
                            const accessToken = localStorage.getItem("accessToken");
                            try {
                                await instance.post("holiday/create-holiday", newData, {
                                    headers: {
                                        Authorization: `Bearer ${accessToken}`,
                                        "Content-Type": "application/json",
                                    },
                                });
                                toast.success("Date added successfully");
                                fetchHolidays();
                                onClose();
                            } catch (error) {
                                console.error("Error adding data:", error);
                                toast.error("Error adding data");
                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                        Yes
                    </button>
                    <button className="btn btn-secondary mx-2" onClick={onClose}>
                        No
                    </button>
                </div>
            ),
        });
    };

    const handleDayClick = (day) => {
        if (!day || isPastDate(day)) return; // Prevent interaction with past dates

        const clickedDate = new Date(currentYear, currentMonth, day);
        const formattedDate = clickedDate.toLocaleDateString("en-US");

        if (isHoliday(day)) {
            const data = {
                holiday_date: formattedDate,
            };
            instance.put("holiday/toggle-holiday-status", data)
                .then((result) => {
                    console.log("Holiday deleted:", result);
                    toast.success("Holiday removed successfully");
                    fetchHolidays();
                })
                .catch((err) => {
                    console.error("Error deleting holiday:", err);
                    toast.error("Error removing holiday");
                });
        } else {
            alertBox(clickedDate.toLocaleDateString());
        }
    };

    const isHoliday = (day) => {
        return specialDates.some(
            (specialDate) =>
                specialDate.date.getDate() === day &&
                specialDate.date.getMonth() === currentMonth &&
                specialDate.date.getFullYear() === currentYear
        );
    };

    const isPastDate = (day) => {
        if (!day) return false;
        const today = new Date();
        const selectedDate = new Date(currentYear, currentMonth, day);
        return selectedDate < today.setHours(0, 0, 0, 0);
    };

    return (
        <Container fluid className="slotbg">
            <Container className="calender">
                <Col lg={12} className="d-flex justify-content-center align-items-center bg-white">
                    <button className="btn ms-1" onClick={() => changeMonth("prev")}>
                        <img src={leftarrow} className="w-75 arrowimg" alt="Previous" />
                    </button>
                    <h3 className="calenderheadline mx-4">
                        {monthNames[currentMonth]} {currentYear}
                    </h3>
                    <button className="btn ms-1" onClick={() => changeMonth("next")}>
                        <img src={rightarrow} className="w-75 arrowimg" alt="Next" />
                    </button>
                </Col>

                <Container className="mt-4 card py-4">
                    <Table bordered responsive style={{ tableLayout: "fixed" }}>
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
                                            onClick={() => handleDayClick(day)}
                                            style={{
                                                height: "100px",
                                                textAlign: "end",
                                                verticalAlign: "middle",
                                                backgroundColor: isHoliday(day)
                                                    ? "rgb(240, 240, 240)"
                                                    : isPastDate(day)
                                                    ? "#e0e0e0" // Light gray for past dates
                                                    : day
                                                    ? "white"
                                                    : "#f0f0f0",
                                                color: isHoliday(day)
                                                    ? "red"
                                                    : isPastDate(day)
                                                    ? "gray" // Gray color for past dates
                                                    : "black",
                                                cursor: isPastDate(day) || !day ? "default" : "pointer",
                                                fontWeight: isHoliday(day) ? "bold" : "600",
                                            }}
                                        >
                                            {day || ""}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Container>
            </Container>
        </Container>
    );
};

export default Holiday;
