import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import instance from "../../api/AxiosInstance";

const Slotlistpage = () => {
    const [slotDate, setSlotDate] = useState("");
    const [category, setCategory] = useState("");
    const [sessions, setSessions] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    // Use useEffect to load location.state or saved values from localStorage
    useEffect(() => {
        const savedCategory = localStorage.getItem("Bookcalendercategory");
        const savedDate = localStorage.getItem("BookcalenderslotDate");

        if (location?.state) {
            console.log("location state: ", location.state);
            const { category, selectedDate } = location.state;

            setCategory(category);
            const date = new Date(selectedDate);
            const options = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-GB', options).replace(',', '');
            setSlotDate(formattedDate);

            // Save values to localStorage
            localStorage.setItem("Bookcalendercategory", category);
            localStorage.setItem("BookcalenderslotDate", formattedDate);
        } else if (savedCategory && savedDate) {
            // Use saved values if location.state is unavailable
            setCategory(savedCategory);
            setSlotDate(savedDate);
        }
    }, [location]);
    const savedCategory = localStorage.getItem("category");
    useEffect(() => {
        if (category && slotDate) {

            const parts = slotDate.split(' ');
            const dateParts = parts[1].split('/');
            const day = parseInt(dateParts[0], 10); // Remove leading zero by converting to integer
            const month = parseInt(dateParts[1], 10); // Remove leading zero by converting to integer
            const year = dateParts[2];

            const formattedDate = `${month}/${day}/${year}`;
            const data = { slotdate: formattedDate, category: savedCategory };
            instance.post(`/Sessionslot/get-getSessionbySessionslot`, data, {
                headers: { "Content-Type": "application/json" }
            })
                .then((result) => {
                    setSessions(result.data.responseData);
                })
                .catch((err) => {
                    console.log("Error fetching sessions:", err);
                });
        }
    }, [category, slotDate]);

    return (
        <Container>
            <h1 className='daydate mt-5'>{slotDate}</h1>
            <Container className='mt-md-5'>
                <Row>
                    {sessions.length === 0 ? "No Slots Available" :
                        sessions.map((session, index) => {
                            let [hours, minutes] = session.time.split(':');
                            let period = 'A.M.';
                            if (hours >= 12) {
                                period = 'P.M.';
                                if (hours > 12) hours -= 12;
                            } else if (hours === '0') {
                                hours = 12;
                            }
                            const formattedTime = `${hours}:${minutes} ${period}`;
                            const isAvailable = session.available_seats > 0;
                            // const buttonStyle = {
                            //     border: "0px",
                            //     cursor: isAvailable ? 'pointer' : 'not-allowed',
                            //     opacity: isAvailable ? 1 : 0.5,
                            // };
                            return (
                                <Col key={index} lg={6} sm={6} md={6} className={index === 0 ? 'pe-lg-5' : 'ps-lg-5'}>
                                    <Card
                                        className='p-3 my-3 text-center border-0 shadow'
                                        onClick={() => {
                                            localStorage.setItem('slotsid', session.id)
                                            navigate("/Bookcalender", {
                                                state: {
                                                    selectedDate: slotDate,
                                                    selectedTime: `${formattedTime}-${session.title}`,
                                                    category: category,
                                                    slotsession: session.title
                                                }
                                            });
                                            setTimeout(() => window.scrollTo(0, 790), 0);

                                        }
                                        }
                                    // style={buttonStyle}
                                    >
                                        <Link className='text-decoration-none text-black fw-bold'>
                                            {formattedTime} - {session.title}
                                        </Link>
                                    </Card>
                                </Col>
                            );
                        })}
                </Row>
            </Container>
        </Container>
    );
}

export default Slotlistpage;
