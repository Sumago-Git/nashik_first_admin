import React, { useState } from 'react';
import { Card, Col, Nav, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import CalenderComp from '../../../components/Calender Component/CalenderComp';
import Backbtn from '../../../components/Calender Component/Backbtn';

const Calender2 = () => {
    const [show, setShow] = useState(true);
    const [activeKey, setActiveKey] = useState("Schedules");
    const [categoryName, setCategoryName] = useState("");
    const navigate = useNavigate(); // New useNavigate hook

    const training_categories = [

        { category: "School Students Training – Group", url: "" },
        { category: "College/Organization Training – Group", url: "" },

    ];

    const title = ["Schedules", "Closed Days"];

    const CategoryClick = (item) => {
        localStorage.setItem("categoryforslot", item.category);
        setCategoryName(item.category);
        navigate('/CalenderComp2', { state: { categoryName: item.category, tabKey: activeKey } });
    };

    const ActiveTab = (key) => {
        setActiveKey(key);
    };

    return (
        <div>
            <Backbtn/>
            {
                show ?
                    <Row className='justify-content-center'>
                        {
                            training_categories.map((item, id) => (
                                <Col md={5} key={id}>
                                    <Card onClick={() => CategoryClick(item)} className='p-3 my-3 text-center border-0 shadow'>
                                        <Link className='text-decoration-none text-black fw-bold' to="#">
                                            {item.category}
                                        </Link>
                                    </Card>
                                </Col>
                            ))
                        }
                    </Row>
                    :
                    <>
                        <h3 className='py-3'>{categoryName}</h3>
                        <Nav fill variant="tabs" activeKey={activeKey}>
                            {
                                title.map((item, id) => (
                                    <Nav.Item key={id}>
                                        <Nav.Link eventKey={item} href="#" onClick={() => ActiveTab(item)}>
                                            {item}
                                        </Nav.Link>
                                    </Nav.Item>
                                ))
                            }
                        </Nav>
                    </>
            }
        </div>
    );
};

export default Calender2;
