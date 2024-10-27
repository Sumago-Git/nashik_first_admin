import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";

const SlotComp = ({ selectedDates, categoryName, showModal, handleCloseModal }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [eyeVisibilityById, setEyeVisibilityById] = useState({});
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);
    // const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const [formData, setFormData] = useState({
        time: '',
        deadlineTime: '',
        title: '',
        capacity: '',
        trainer: "",
        category: categoryName
    });

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        // Optionally, you can close the modal after submission
        handleClose1();
    };

    const handleCreateNewSlot = () => {
        handleShow1()
    }
    const CustomHeader = ({ name }) => (
        <div style={{ fontWeight: "bold", color: "black", fontSize: "16px" }}>
            {name}
        </div>
    );

    const tableColumns = (currentPage, rowsPerPage) => [
        {
            name: <CustomHeader name="Sr. No." />,
            selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
        },
        {
            name: <CustomHeader name="Financial Year" />,
            cell: (row) => <span>{row.financial}</span>,
        },
        {
            name: <CustomHeader name="PDF" />,
            cell: (row) => (
                <a href={row.img} target="_blank" rel="noopener noreferrer">
                    View PDF
                </a>
            ),
        },
        {
            name: <CustomHeader name="Actions" />,
            cell: (row) => (
                <div className="d-flex">
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}
                    >
                        <Button className="ms-1" onClick={() => toggleEdit(row.id)}>
                            <FaEdit />
                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="delete-tooltip">Delete</Tooltip>}
                    >
                        <Button
                            className="ms-1"
                            style={{ backgroundColor: "red", color: "white", borderColor: "red" }}
                            onClick={() => handleDelete(row.id)}
                        >
                            <FaTrash />
                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="visibility-tooltip">{eyeVisibilityById[row.id] ? 'Hide' : 'Show'}</Tooltip>}
                    >
                        <Button
                            className="ms-1"
                            style={{
                                backgroundColor: eyeVisibilityById[row.id] ? 'red' : 'green',
                                borderColor: eyeVisibilityById[row.id] ? 'red' : 'green',
                                color: 'white',
                            }}
                            onClick={() => handleIsActive(row.id, !eyeVisibilityById[row.id])}
                        >
                            {eyeVisibilityById[row.id] ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                    </OverlayTrigger>
                </div>
            ),
        },
    ];

    return (
        <>
            <Modal
                show={showModal}
                onHide={handleCloseModal}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="modal-fullscreen d-flex justify-content-center"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {selectedDates}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <DataTable
                            columns={tableColumns(currentPage, rowsPerPage)}
                            data={data}
                            pagination
                            paginationServer
                            paginationTotalRows={100}
                            onChangePage={setCurrentPage}
                            onChangeRowsPerPage={setRowsPerPage}
                            highlightOnHover
                            dense
                            noDataComponent={
                                <div className="text-center my-3">
                                    <p>There is no record to display.</p>
                                    <Button variant="success" className='rounded-5' onClick={handleCreateNewSlot}>
                                        Create New Slot
                                    </Button>
                                </div>
                            }
                        />
                    </Card>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <style jsx>{`
                .modal-fullscreen {
                    max-width: 100%;
                    height: 100%;
                    margin: 0;
                }

                .modal-fullscreen .modal-dialog {
                    width: 100%;
                    height: 100%;
                    margin: 0;
                }

                .modal-fullscreen .modal-content {
                    height: 100%;
                }
            `}</style>

            <Modal show={show1} onHide={handleClose1}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Slot</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formCategory">
                            <Form.Label>Training Category</Form.Label>
                            <Form.Control
                                type="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                disabled
                            />
                        </Form.Group>

                        <Form.Group controlId="formTrainer" className="mt-3">
                            <Form.Label>Trainer</Form.Label>
                            <Form.Control
                                type="text"
                                name="trainer"
                                value={formData.trainer}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formTime" className="mt-3">
                            <Form.Label>Time</Form.Label>
                            <Form.Control
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formDeadlineTime" className="mt-3">
                            <Form.Label>Deadline Time</Form.Label>
                            <Form.Control
                                type="time"
                                name="deadlineTime"
                                value={formData.deadlineTime}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formTitle" className="mt-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formCapacity" className="mt-3">
                            <Form.Label>Capacity</Form.Label>
                            <Form.Control
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    <Button variant="secondary" onClick={handleClose1}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default SlotComp;
