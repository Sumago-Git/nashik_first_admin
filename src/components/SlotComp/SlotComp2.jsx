import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Modal, OverlayTrigger, Tooltip, Col, Row, Badge } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import instance from "../../api/AxiosInstance";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import NewResuableForm from "../../components/form/NewResuableForm";

const SlotComp2 = ({ selectedDates, categoryName, showModal, handleCloseModal, handleShowModal, realdata, isPast }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [title, setTitle] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [eyeVisibilityById, setEyeVisibilityById] = useState({});
    const [data, setData] = useState(realdata);
    console.log("cbvdf", isPast)
    useEffect(() => {
        setData(realdata);
    }, [realdata]);
    const [editMode, setEditMode] = useState(false);
    const [show, setShow] = useState(false);
    const [showTable, setShowTable] = useState(true)
    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(true);
    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(true);
    const handleShow1 = () => setShow1(true);
    const [imagePreview, setImagePreview] = useState("");
    const [team, setTeam] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const handleClose = () => setShow(false);
    const [editingId, setEditingId] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null); // New state for selected booking
    const [isEditing, setIsEditing] = useState(false); // State for edit mode

    const CustomHeader = ({ name }) => (
        <div style={{ fontWeight: "bold", color: "black", fontSize: "18px" }}>
            {name}
        </div>
    );
    useEffect(() => {
        if (selectedDates && selectedDates.length > 0) {
            setFormData((prev) => ({ ...prev, slotdate: selectedDates }));
        }
    }, [selectedDates]);
    console.log(selectedDates)
    const initialFormData = {
        slotType: 'onsite',
        category: categoryName,
        time: '',
        deadlineTime: '',
        title: '',
        capacity: '',
        trainer: '',
        slotdate: selectedDates
    };

    // Use the initial state when setting up the useState hook
    const [formData, setFormData] = useState(initialFormData);

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
            const response = await instance.post("Sessionslot/get-getSessionbySessionslot", { slotdate: selectedDates, category: categoryName, slotType: "onsite" }, {
                headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
            });
            const filteredData = response.data.responseData?.reverse()
            setTeam(filteredData);
            setData(filteredData)
            console.log('dfh', filteredData)


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

        // Check if the title is empty
        if (!formData.title.trim()) {
            errors.title = 'Title is required';
            isValid = false;
        }

        // Convert capacity to a string before calling trim() and check if it's empty
        if (!String(formData.capacity).trim()) {
            errors.capacity = 'Capacity is required';
            isValid = false;
        }

        // Check if deadlineTime is empty
        if (!formData.deadlineTime.trim()) {
            errors.deadlineTime = 'Deadline time is required';
            isValid = false;
        }

        // Check if category is empty
        if (!formData.category.trim()) {
            errors.category = 'Category is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const [traniners, settainers] = useState([])
    const getdata_admin = () => {
        instance.get('trainer/get-trainers')
            .then((res) => {
                settainers(res.data.responseData)
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        getdata_admin();
    }, []);


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
                                        `Sessionslot/isactive-Sessionslot/${id}`,
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
                                onClose(); handleShowModal()
                                handleShowModal
                            }}
                        >
                            Yes
                        </button>
                        <button className="btn btn-secondary" onClick={() => { onClose(); handleShowModal() }}>
                            No
                        </button>
                    </div>
                </div>
            ),
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
                                    await instance.delete(`Sessionslot/isdelete-Sessionslot/${id}`, {
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
                                handleShowModal()

                            }}
                        >
                            Yes
                        </button>
                        <button className="btn btn-secondary" onClick={() => { onClose(); handleShowModal() }}>
                            No
                        </button>
                    </div>
                </div>
            ),
        });
    };
    const toggleEdit = (id, row) => {
        // const selectedMember = team.find((member) => member.id === id);
        // console.log(selectedMember)
        if (row) {
            setShow1(true)
            setEditingId(id);
            setFormData(row); // This should set existing data correctly
            setEditMode(true);
            setShowTable(false);
            // Switch to form view when editing
        }
    };
    const toggleEdit2 = (id, row) => {
        // const selectedMember = team.find((member) => member.id === id);
        // console.log(selectedMember)
        if (row) {
            setShow2(true)
            setEditingId(id);
            setFormData(row); // This should set existing data correctly
            setEditMode(true);
            setShowTable(false);
            // Switch to form view when editing
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const requiredFields = ["category", "time", "deadlineTime", "title", "capacity"];
        for (const field of requiredFields) {
            if (!formData[field]) {
                toast.error(`${field} is required`); // Show error for each missing required field
                return; // Exit if any required field is empty
            }
        }
        if (formData.capacity <= 30) {
            toast.error("Capacity should be more than 30");
            return; // Exit if capacity is not greater than 30
        }
        if (deadlineError) {
            toast.error('Deadline Time should be greater than Time');
            return;
        }

        if (validateForm(formData)) {
            setLoading(true);
            const accessToken = localStorage.getItem("accessToken");
            const data = new FormData();

            for (const key in formData) {
                if (formData[key] instanceof File || typeof formData[key] === "string") {
                    data.append(key, formData[key]);
                }
            }

            try {
                if (editMode) {
                    await instance.put(`Sessionslot/Sessionslot/${editingId}`, formData, {
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
                    fetchTeam();
                } else {
                    await instance.post("Sessionslot/create-Sessionslot", data, {
                        headers: {
                            Authorization: "Bearer " + accessToken,
                            "Content-Type": "application/json",
                        },
                    });

                }
                fetchTeam();
                setShow1(false)

                setEditMode(false);
                setFormData(initialFormData); // Reset formData to initial state
                setImagePreview("");
                setShowTable(true);

            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message); // Show error message in toast
                }
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
    };
    const handleSubmit2 = async (e) => {
        e.preventDefault();
        const requiredFields = ["category", "time", "deadlineTime", "title", "capacity"];
        for (const field of requiredFields) {
            if (!formData[field]) {
                toast.error(`${field} is required`); // Show error for each missing required field
                return; // Exit if any required field is empty
            }
        }
        if (formData.capacity <= 30) {
            toast.error("Capacity should be more than 30");
            return; // Exit if capacity is not greater than 30
        }
        if (deadlineError) {
            toast.error('Deadline Time should be greater than Time');
            return;
        }

        if (validateForm(formData)) {
            setLoading(true);
            const accessToken = localStorage.getItem("accessToken");
            const data = new FormData();

            for (const key in formData) {
                if (formData[key] instanceof File || typeof formData[key] === "string") {
                    data.append(key, formData[key]);
                }
            }

            try {
                if (editMode) {
                    await instance.put(`Sessionslot/Sessionslot/${editingId}`, formData, {
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
                    fetchTeam();
                } else {
                    await instance.post("Sessionslot/create-Sessionslot", data, {
                        headers: {
                            Authorization: "Bearer " + accessToken,
                            "Content-Type": "application/json",
                        },
                    });

                }
                fetchTeam();
                setShow2(false)

                setEditMode(false);
                setFormData(initialFormData); // Reset formData to initial state
                setImagePreview("");
                setShowTable(true);

            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message); // Show error message in toast
                }
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
    };
    const [deadlineError, setDeadlineError] = useState(false); // To track if the deadline time is invalid

    const handleChange = (name, value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
        if (name === 'time') {
            setDeadlineError(false); // Reset deadline error when time is changed
        }

        // If "deadlineTime" is updated, validate it
        if (name === 'deadlineTime') {
            const selectedTime = new Date(`1970-01-01T${formData.time}:00`);
            const deadline = new Date(`1970-01-01T${value}:00`);

            // Check if deadline time is greater than the selected time
            if (deadline <= selectedTime) {
                setDeadlineError(true); // Set error if deadline time is before or equal to time
            } else {
                setDeadlineError(false); // Valid deadline time
            }
        }
    };
    function convertDateFormat(date) {
        // Split the input date by "/"
        const [month, day, year] = date.split('/');

        // Return the formatted date in MM/DD/YYYY format
        return `${day}/${month}/${year}`;
    }
    const tableColumns = (currentPage, rowsPerPage) => [
        {
            name: <CustomHeader name="Sr. No." />,
            selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
        },
        {
            name: <CustomHeader name="Title" />,
            cell: (row) => <span>{row.title}</span>,
        },
        {
            name: <CustomHeader name="Capacity" />,
            cell: (row) => <span>{row.capacity}</span>,
        },
        {
            name: <CustomHeader name="Slot Date" />,
            cell: (row) => <span>{convertDateFormat(row.slotdate)}</span>,
        },
        {
            name: <CustomHeader name="Time" />,
            cell: (row) => <span>{row.time}</span>,
        },
        {
            name: <CustomHeader name="deadlineTime" />,
            cell: (row) => <span>{row.deadlineTime}</span>,
        },
        {
            name: <CustomHeader name="Trainer" />,
            cell: (row) => (
                row.trainer ? (
                    <span>{row.trainer}</span>
                ) : (
                    <Badge
                        variant="primary"
                        onClick={() => toggleEdit2(row.id, row)}
                    >
                        Add Trainer
                    </Badge>
                )
            ),
        },
        {
            name: <CustomHeader name="Category" />,
            cell: (row) => <span>{row.category}</span>,
        },
        {
            name: <CustomHeader name="Actions" />,
            cell: (row) => (
                <div className="d-flex">
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}
                    >
                        <Button className="ms-1" onClick={() => toggleEdit(row.id, row)}>
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
                            onClick={() => { handleDelete(row.id); handleCloseModal() }}
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
                            onClick={() => { handleIsActive(row.id, !eyeVisibilityById[row.id]); handleCloseModal() }}
                        >
                            {eyeVisibilityById[row.id] ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                    </OverlayTrigger>
                </div>
            ),
        },


    ];
    const dateParts = selectedDates.split("/");

    // Create a new Date object using the parts
    const date = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);

    // Format the date to "DD Month YYYY"
    const formattedDate = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <>
            <Modal
                show={showModal}
                onHide={handleCloseModal}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="modal-fullscreen d-flex justify-content-center"
                fullscreen

            >
                <Modal.Header closeButton >


                    {!isPast && (
                        <Button variant="success" className="rounded-5" onClick={handleClose1}>
                            Create New Slot
                        </Button>
                    )}
                    <div className='text-center'> <h6>{categoryName}</h6><h5>{formattedDate}</h5></div>

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

                                </div>
                            }
                        />
                    </Card>
                </Modal.Body>

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
                <Modal.Header >
                    <Modal.Title>Add Slot</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className='justify-content-center'>


                            <Col md={10}>
                                <Form.Group controlId="trainingType">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select
                                        name="category"
                                        value={formData.category} // Use "category" as it matches initialFormData
                                        onChange={(e) => handleChange("category", e.target.value)} // Call handleChange with "category"
                                    >
                                        <option value={categoryName}>{categoryName}</option>
                                        {/* <option value="RTO – Learner Driving License Holder Training">RTO – Learner Driving License Holder Training</option>
                                        <option value="RTO – Suspended Driving License Holders Training">RTO – Suspended Driving License Holders Training</option>
                                        <option value="RTO – Training for School Bus Driver">RTO – Training for School Bus Driver</option> */}
                                        <option value="School Students Training – Group">School Students Training – Group</option>
                                        <option value="College/Organization Training – Group">College/Organization Training – Group</option>

                                    </Form.Select>
                                </Form.Group>


                            </Col>

                            <Col md={10}>
                                <Form.Group controlId="trainingType">
                                    <Form.Label>Trainer Name</Form.Label>
                                    <Form.Select
                                        name="category"
                                        value={formData.trainer} // Use "category" as it matches initialFormData
                                        onChange={(e) => handleChange("trainer", e.target.value)} // Call handleChange with "category"
                                    >
                                        <option value="">choose trainer</option>
                                        {traniners.map((a) => {
                                            return (
                                                <option key={a.id} value={a.name}>
                                                    {a.name}
                                                </option>
                                            );
                                        })}

                                    </Form.Select>
                                </Form.Group>


                            </Col>
                            <Col md={10}>
                                <Form.Group controlId="time">
                                    <Form.Label>Time</Form.Label>
                                    <Form.Control
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={(e) => handleChange('time', e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={10}>
                                <Form.Group controlId="deadlineTime">
                                    <Form.Label>Deadline Time</Form.Label>
                                    <Form.Control
                                        type="time"
                                        name="deadlineTime"
                                        value={formData.deadlineTime}
                                        onChange={(e) => handleChange('deadlineTime', e.target.value)}
                                        required
                                    />
                                    {deadlineError && (
                                        <Form.Text className="text-danger">
                                            Deadline Time must be greater than Time.
                                        </Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={10}>
                                <NewResuableForm
                                    label="Title"
                                    placeholder="Enter title"
                                    type="text"
                                    name="title"
                                    onChange={handleChange}
                                    initialData={formData}
                                />
                            </Col>
                            <Col md={10}>
                                <NewResuableForm
                                    label="Capacity"
                                    placeholder="Enter capacity"
                                    type="number"
                                    name="capacity"
                                    onChange={handleChange}
                                    initialData={formData}
                                />
                            </Col>
                            <Col xs={12} className="d-flex justify-content-end mt-3">
                                <Button variant="primary" type="submit" className='mx-3'>
                                    Submit
                                </Button>
                                <Button variant="secondary" onClick={() => setShow1(false)}>
                                    Close
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>


            </Modal>

            <Modal show={show2} onHide={handleClose2}>
                <Modal.Header >
                    <Modal.Title>Add Slot</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit2}>
                        <Row className='justify-content-center'>




                            <Col md={10}>
                                <Form.Group controlId="trainingType">
                                    <Form.Label>Trainer Name</Form.Label>
                                    <Form.Select
                                        name="category"
                                        value={formData.trainer} // Use "category" as it matches initialFormData
                                        onChange={(e) => handleChange("trainer", e.target.value)} // Call handleChange with "category"
                                    >
                                        <option value="">choose trainer</option>
                                        {traniners.map((a) => {
                                            return (
                                                <option key={a.id} value={a.name}>
                                                    {a.name}
                                                </option>
                                            );
                                        })}

                                    </Form.Select>
                                </Form.Group>


                            </Col>
                            <Col xs={12} className="d-flex justify-content-end mt-3">
                                <Button variant="primary" type="submit" className='mx-3'>
                                    Submit
                                </Button>
                                <Button variant="secondary" onClick={() => setShow2(false)}>
                                    Close
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>


            </Modal>
        </>
    );
};

export default SlotComp2;










