import React, { useState } from 'react';
import { Card, Col, Nav, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const bookingcatname = ({ setCategoryName }) => {
    const training_categories = [
        {
            category: "RTO – Learner Driving License Holder Training",
            url: ""
        },
        {
            category: "RTO – Suspended Driving License Holders Training",
            url: ""
        },
        {
            category: "RTO – Training for School Bus Driver",
            url: ""
        },
        {
            category: "School Students Training – Group",
            url: ""
        },
        {
            category: "College/Organization Training – Group",
            url: ""
        },
       
    ];

    const navigate = useNavigate();
    const slotDate = "2023-10-10";  // Define or pass slotDate, formattedTime, and session.title
    const formattedTime = "10:00 AM";
    const session = { title: "Session 1" };

    const CategoryClick = (item) => {
        localStorage.setItem("category", item.category); // Save to localStorage
      
      
        navigate("/bookpackg", {
            // state: {
            //     selectedDate: slotDate,
            //     selectedTime: `${formattedTime}-${session.title}`,

            // }
        });
    };

    return (
        <div>
            <Row className='justify-content-center'>
                {training_categories.map((item, id) => (
                    <Col md={5} key={id}>
                        <Card onClick={() => {CategoryClick(item)}} className='p-3 my-3 text-center border-0 shadow'>
                            <Link className='text-decoration-none text-black fw-bold' to={""}>
                                {item.category}
                            </Link>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};



export default bookingcatname