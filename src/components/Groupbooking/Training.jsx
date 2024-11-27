import React, { useEffect, useState } from "react";
import { Container, Table, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import leftarrow from "../../assets/images/Holiday/leftarrow.png";
import rightarrow from "../../assets/images/Holiday/rightarrow.png";

import Nav from 'react-bootstrap/Nav';

import instance from "../../api/AxiosInstance";



// Event data for sample holidays


const Training = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState(null);
  const navigate = useNavigate();
  const [selectedButton, setSelectedButton] = useState("College/Organization Training – Group");
  const [specialDates, setspecialDates] = useState([]);
  const [btno, setbrno] = useState("College/Organization Training – Group");
  const [dateStatuses, setDateStatuses] = useState({}); // State to store date statuses

  useEffect(() => {
    getdata_here();
  }, []);


  useEffect(() => {
    getdata_here();
  }, [currentDate]);
  const getdata_here = ({ category = selectedButton } = {}) => {
    instance.post('/Sessionslot/getAvailableslotslots', {
      year: currentYear.toString(),
      month: (currentMonth + 1).toString(),
      category,
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
          color: slot.status === "Holiday" ? "#ff0000" : (slot.status === "available" ? "green" : "red"),
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

  const changeMonth = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
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
    if (dateStatuses[day] !== "Holiday") { // Only handle click if the status is "Available"
      const clickedDate = new Date(currentYear, currentMonth, day);
      window.scrollTo(0, 700);
      navigate("/Slotpage", { state: { selectedDate: clickedDate, category: selectedButton } });
    }
  };

  const isPastDate = (day) => {
    const dateToCheck = new Date(currentYear, currentMonth, day);
    return dateToCheck < today.setHours(0, 0, 0, 0);
  };

  const handleButtonClick = (buttonNumber, btncategory) => {


    setSelectedButton(btncategory);
    setbrno(buttonNumber);
    getdata_here({
      category: btncategory,
      buttonNumber,
    })

  };


  const tabsData = [

    { id: 1, label: "College/Organization Training – Group" },
    { id: 2, label: "School Students Training – Group" },
    { id: 3, label: "RTO – Learner Driving License Holder Training" },
    { id: 4, label: "RTO – Suspended Driving License Holders Training" },
    { id: 5, label: "RTO – Training for School Bus Driver" },



  ];
  return (
    <>




      <Container fluid className="slotbg pb-5 mb-4">
        <Container>

          <Nav variant="tabs" defaultActiveKey="/home" className="mt-lg-4 mx-auto">
            <Row>
              {tabsData.map((tab) => (
                <Col md={2} className="p-0" key={tab.id} onClick={() => handleButtonClick(tab.id, tab.label)}>
                  <Nav.Item className="calendertabs">
                    <Nav.Link eventKey={`link-${tab.id}`} className="text-black">
                      <button
                        type="button"
                        className={`btn3d btn w-100 calendertabs custom-button ${btno === tab.id ? 'selected' : ''}`}
                        style={{
                          backgroundColor: btno === tab.id ? '#feeeea' : 'white', // Set selected background color
                          color: btno === tab.id ? 'orange' : 'black' // Set text color based on selection
                        }}

                        aria-label={tab.label}
                      >
                        <span className="glyphicon glyphicon-download-alt"></span> {tab.label}
                      </button>
                    </Nav.Link>
                  </Nav.Item>
                </Col>
              ))}
            </Row>
          </Nav>



        </Container>

        <Container className="calender">
          <Col lg={12} className="mt-4 d-flex justify-content-center align-items-center">
            <button className="btn ms-1" onClick={() => changeMonth('prev')} disabled={isCurrentMonth}>
              <img src={leftarrow} className="w-75 arrowimg" alt="Previous" />            </button>
            <h3 className="calendarheadline mx-4 mt-4">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <button className="btn ms-1" onClick={() => changeMonth('next')}>
              <img src={rightarrow} className="w-75 arrowimg mt-4" alt="Next" />
            </button>
          </Col>

          <Container className="mt-4">
            <Table responsive style={{ tableLayout: 'fixed', borderCollapse: 'collapse' }}>
              <thead>
                <tr className="text-start">
                  {daysOfWeek.map((day) => (
                    <th key={day} style={{ borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                      {day}
                    </th>
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

                      return (
                        <td
                          key={dayIndex}
                          onMouseEnter={() => day && !isDisabled && setHoveredDay(day)}
                          onMouseLeave={() => day && !isDisabled && setHoveredDay(null)}
                          onClick={() => !isDisabled && handleDateClick(day)}
                          style={{
                            height: "100px",
                            textAlign: "end",
                            verticalAlign: "middle",
                            borderRight: "1px solid #ddd",
                            backgroundColor: day
                              ? day.isNextMonth
                                ? "#f0f0f0" // Next month's dates (light gray)
                                : isDisabled
                                  ? "#f9f9f9" // Disabled (past dates or holidays)
                                  : dateStatuses[day] === "available"
                                    ? "#d4ffd" // Green for available
                                    : dateStatuses[day] === "Holiday"
                                      ? "#ea7777" // Light blue for holiday
                                      : "#ffd4d4" // Red for closed or other statuses
                              : "white",
                            color: day
                              ? day.isNextMonth
                                ? "#ccc" // Light color for next month's dates
                                : isDisabled || dateStatuses[day] === "Holiday"
                                  ? "#999" // Gray for disabled or holiday
                                  : "black"
                              : "black", color: day && (day.isNextMonth ? "#ccc" : isDisabled || isHoliday ? "#999" : "black"),
                            pointerEvents: day && (isHoliday ? "none" : "auto"),
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
                            !isPastDate(day) && (
                              <div>
                                {specialDates.find((date) => date.day === day)?.slots.length > 0 ? (
                                  specialDates
                                    .find((date) => date.day === day)
                                    ?.slots.map((a) => (
                                      <div
                                        key={a.time} // Ensure unique keys for React elements
                                        style={{
                                          fontSize: "12px",
                                          width: "50%",
                                          marginTop: "2px",
                                          color: a.availableSeats === 0 ? "red" : "green",
                                          backgroundColor: a.availableSeats === 0 ? "#ffd4d4" : "#d4ffd4", // Dynamically set background color
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




export default Training
