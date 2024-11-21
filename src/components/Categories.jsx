import React, { useState } from 'react'
import { Card, Col, Nav, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Categories = ({setCategoryName}) => {
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
      
    ]

    const CategoryClick = (item, id) => {
        setCategoryName(item.category)
    }

    return (
        <div>
            {
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
            }
        </div>
    )
}

export default Categories