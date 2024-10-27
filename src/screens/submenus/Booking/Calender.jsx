import React, { useState } from 'react'
import { Card, Col, Nav, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import CalenderComp from '../../../components/Calender Component/CalenderComp'

const Calender = () => {
    const [show, setShow] = useState(true)
    const [activeKey, setActiveKey] = useState("Schedules")
    const [categoryName, setCategoryName] = useState("")
    const training_categories = [
        {
            category: "RTO – Learner Driving License Holders Training",
            url: ""
        },
        {
            category: "RTO – Suspended Driving License Holders Training",
            url: ""
        },
        {
            category: "RTO – School Bus Driver Training",
            url: ""
        },
        {
            category: "School / College / Organization Trainings - Group",
            url: ""
        },
        {
            category: "Adult (College/Organization) Training - Individual",
            url: ""
        },
        {
            category: "POLICE – Counselling Training",
            url: ""
        },
    ]
    const title = [
        "Schedules", "Closed Days"]
    const CategoryClick = (item, id) => {
        setShow(false)
        setCategoryName(item.category)
    }
    const ActiveTab = (key) => {
        setActiveKey(key)
    }
    return (
        <div>
            {
                show ?
                    <Row className='justify-content-center'>
                        {
                            training_categories.map((item, id) => {
                                return (
                                    <Col md={5}>
                                        <Card onClick={() => CategoryClick(item, id)} className='p-3 my-3 text-center border-0 shadow'>
                                            <Link className='text-decoration-none text-black fw-bold' to={""}>
                                                {item.category}
                                            </Link>
                                        </Card>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                    :
                    <>
                        <h3 className='py-3'>{categoryName}</h3>
                        <Nav fill variant="tabs" activeKey={activeKey}>
                            {
                                title.map((item, id) => {
                                    return (
                                        <Nav.Item>
                                            <Nav.Link eventKey={item} href="" onClick={() => ActiveTab(item)}>
                                                {item}
                                            </Nav.Link>
                                        </Nav.Item>
                                    )
                                })
                            }
                        </Nav>
                        <CalenderComp tabKey={activeKey} categoryName={categoryName} />

                    </>
            }


        </div>
    )
}

export default Calender