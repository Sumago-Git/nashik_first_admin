import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import instance from "../../api/AxiosInstance";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";

const SlotComp = ({ selectedDates, categoryName, showModal, handleCloseModal }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [eyeVisibilityById, setEyeVisibilityById] = useState({});
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);
    const [imagePreview, setImagePreview] = useState("");
    const [team, setTeam] = useState([]);

    const [loading, setLoading] = useState(false);
    const handleClose = () => setShow(false);
    const CustomHeader = ({ name }) => (
        <div style={{ fontWeight: "bold", color: "black", fontSize: "16px" }}>
            {name}
        </div>
    );

    const [formData, setFormData] = useState({
        time: '',
        deadlineTime: '',
        title: '',
        capacity: '',
        trainer: "",

    });

    useEffect(() => {
        fetchTeam();
        // Retrieve and set visibility state from localStorage
        const storedVisibility = JSON.parse(localStorage.getItem('eyeVisibilityById')) || {};
        setEyeVisibilityById(storedVisibility);
    }, []);

    useEffect(() => {
        // Store visibility state in localStorage whenever it changes
        localStorage.setItem('eyeVisibilityById', JSON.stringify(eyeVisibilityById));
    }, [eyeVisibilityById]);


    useEffect(() => {
        if (formData.img && formData.img instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(formData.img);
        } else if (formData.img && typeof formData.img === "string") {
            setImagePreview(formData.img);
        } else {
            setImagePreview("");
        }
    }, [formData.img]);
    const handleCreateNewSlot = () => {
        setShow1()
    }
    const fetchTeam = async () => {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken"); // Retrieve access token
        try {
            const response = await instance.get("counter/get-homecounter", {
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "application/json",
                },
            });
            const reversedData = response.data.responseData.reverse();
            setTeam(reversedData);
            setData(reversedData);
        } catch (error) {
            console.error(
                "Error fetching team:",
                error.response || error.message || error
            );
        } finally {
            setLoading(false);
        }
    };

    const validateForm = (formData) => {
        let errors = {};
        let isValid = true;

        // if (!formData.img) {
        //     errors.img = "Image is not 338x220 pixels";
        //     isValid = false;

        // } else if (
        //     formData.img instanceof File &&
        //     !validateImageSize(formData.img)
        // ) {
        //     errors.img = "Image is required with 338x220 pixels";
        //     isValid = false;
        // }

        // else if (formData.desc.length > 1000) {
        //   errors.desc = "Description must be 1000 characters or less";
        //   isValid = false;
        // }

        setErrors(errors);
        return isValid;
    };

    const validateImageSize = (file) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                if (img.width === 338 && img.height === 220) {
                    resolve();
                } else {
                    reject("Image is required with 338x220 pixels");
                }
            };
            img.onerror = () => reject("Error loading image");
            img.src = URL.createObjectURL(file);
        });
    };
    const handleDelete = async (id) => {
        confirmAlert({
            title: "Confirm to delete",
            message: "Are you sure you want to delete this data?",
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
                    <h2>Confirm to delete</h2>
                    <p>Are you sure you want to delete this data?</p>
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
                                const accessToken = localStorage.getItem("accessToken");
                                try {
                                    await instance.delete(`counter/delete-homecounter/${id}`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`,
                                            "Content-Type": "application/json",
                                        },
                                    });
                                    toast.success("Data Deleted Successfully");
                                    fetchTeam();
                                } catch (error) {
                                    console.error("Error deleting data:", error);
                                    toast.error("Error deleting data");
                                } finally {
                                    setLoading(false);
                                }
                                onClose();
                            }}
                        >
                            Yes
                        </button>
                        <button className="btn btn-secondary" onClick={() => onClose()}>
                            No
                        </button>
                    </div>
                </div>
            ),
        });
    };

    const handleIsActive = async (id, isVisible) => {
      
        confirmAlert({
            title: "Confirm to change visibility",
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
                    <h2>Confirm to change visibility</h2>
                    <p>
                        Are you sure you want to {isVisible ? "hide" : "show"} this data?
                    </p>
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
                                const accessToken = localStorage.getItem("accessToken");
                                try {
                                    await instance.put(
                                        `counter/isactive-homecounter/${id}`,
                                        { isVisible },
                                        {
                                            headers: {
                                                Authorization: `Bearer ${accessToken}`,
                                                "Content-Type": "application/json",
                                            },
                                        }
                                    );
                                    toast.success(
                                        `Data ${isVisible ? "hidden" : "shown"} successfully`
                                    );
                                    setEyeVisibilityById((prev) => ({
                                        ...prev,
                                        [id]: isVisible,
                                    }));
                                    fetchTeam();
                                } catch (error) {
                                    console.error("Error updating visibility:", error);
                                    toast.error("Error updating visibility");
                                } finally {
                                    setLoading(false); // Set loading to false
                                }
                                onClose();
                            }}
                        >
                            Yes
                        </button>
                        <button className="btn btn-secondary" onClick={() => onClose()}>
                            No
                        </button>
                    </div>
                </div>
            ),
        });
    };

    const toggleEdit = (id) => {
        const selectedMember = team.find((member) => member.id === id);
        if (selectedMember) {
            setEditingId(id);
            setFormData(selectedMember); // This should set existing data correctly
            setEditMode(true);
            setShowTable(false); // Switch to form view when editing
        }
    };


    const handleAdd = () => {
        setFormData({});
        setEditMode(false);
        setShowTable(false); // Switch to form view when adding new item
    };

    const handleView = () => {
        setFormData({});
        setEditMode(false);
        setShowTable(true); // Switch to table view
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm(formData)) {
            setLoading(true);
            const accessToken = localStorage.getItem("accessToken"); // Retrieve access token
            const data = new FormData();

            // Append all formData fields, including the img file if present
            for (const key in formData) {
                if (formData[key] instanceof File || typeof formData[key] === "string") {
                    data.append(key, formData[key]);
                }
            }

            try {
                if (editMode) {
                    await instance.put(`counter/update-homecounter/${editingId}`, data, {
                        headers: {
                            Authorization: "Bearer " + accessToken,
                            "Content-Type": "application/json",
                        },
                    });
                    toast.success("Data Updated Successfully");
                    const updatedTeam = team.map((member) =>
                        member.id === editingId ? formData : member
                    );
                    setTeam(updatedTeam);
                } else {
                    await instance.post("counter/create-homecounter", data, {
                        headers: {
                            Authorization: "Bearer " + accessToken,
                            "Content-Type": "application/json",
                        },
                    });
                    toast.success("Data Submitted Successfully");
                }
                fetchTeam();

                setEditMode(false);
                setFormData({});
                setImagePreview("");
                setShowTable(true); // Switch back to table view after submission
            } catch (error) {
                console.error("Error handling form submission:", error);
            } finally {
                setLoading(false); // Set loading to false
            }
        }
    };


    const handleChange = async (name, value) => {
        if (name === "img" && value instanceof File) {
            try {
                await validateImageSize(value);
                setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
                setErrors((prevErrors) => ({ ...prevErrors, img: "" }));
            } catch (error) {
                setErrors((prevErrors) => ({ ...prevErrors, img: error }));
                setImagePreview("");
            }
        } else {
            setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
            setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        }
    };

    const tableColumns = (currentPage, rowsPerPage) => [
        {
            name: <CustomHeader name="Sr. No." />,
            selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
        },
        {
            name: <CustomHeader name="Title" />,
            cell: (row) => <span>{row.training_imparted}</span>,
        },
        {
            name: <CustomHeader name="Title" />,
            cell: (row) => <span>{row.lives_changed}</span>,
        },
        {
            name: <CustomHeader name="Title" />,
            cell: (row) => <span>{row.children}</span>,
        }, {
            name: <CustomHeader name="Title" />,
            cell: (row) => <span>{row.adult}</span>,
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
                        {/* {selectedDates} */}
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










