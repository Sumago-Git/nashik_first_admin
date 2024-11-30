import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Modal, OverlayTrigger, Tooltip, Col, Row, Badge } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import instance from "../../api/AxiosInstance";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import NewResuableForm from "../../components/form/NewResuableForm";

const SlotComp = ({ selectedDates, categoryName, showModal, handleCloseModal, handleShowModal, realdata, isPast, todayname }) => {
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
        slotType: 'inhouse',
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
            const response = await instance.post("Sessionslot/get-getSessionbySessionslot2", { slotdate: selectedDates, slotType: "inhouse" }, {
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
                    if (key == "capacity") {
                        data.append(key, formData[key] == null ? 50 : formData[key]);
                    }
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
                    toast.success("Slot Added Successfully");
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
            cell: (row) => <span>{row.slotdate}</span>,
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
                <>
                    <div className="d-flex">  {!isPast && (
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}
                        >
                            <Button className="ms-1" onClick={() => toggleEdit(row.id, row)}>
                                <FaEdit />
                            </Button>
                        </OverlayTrigger>)}
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
                        {/* {!isPast && (<OverlayTrigger
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
                        </OverlayTrigger>)} */}
                    </div>


                </>
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
    // Time slots for weekdays (Monday to Friday)

    const weekendSlots = [
        { value: "10:30-12:30", label: "10:30 AM to 12:30 PM" },
        { value: "13:00-15:00", label: "1:00 PM to 3:00 PM" },
        { value: "15:30-17:30", label: "3:30 PM to 5:30 PM" },
    ];
    const weekdaySlots = [
        { value: "09:00-10:59", label: "9:00 AM to 11:00 AM" },
        { value: "11:00-12:59", label: "11:00 AM to 1:00 PM" },
        { value: "13:00-14:59", label: "1:00 PM to 3:00 PM" },
        { value: "15:00-16:59", label: "3:00 PM to 5:00 PM" },
    ];

    // Time slots for weekends (Saturday/Sunday) with 15-minute adjustment

    // Determine if today is Saturday or Sunday
    const isWeekend = todayname === "Sat" || todayname === "Sun";

    // RTO-related categories
    const rtoCategories = [
        "RTO – Learner Driving License Holder Training",
        "RTO – Suspended Driving License Holders Training",
        "RTO – Training for School Bus Driver",
    ];

    // Function to filter time slots based on the category and day
    const getAvailableSlots = (category) => {
        if (isWeekend) {
            // Weekend logic: Only show the specific slots for RTO categories and 2nd slot for non-RTO
            if (rtoCategories.includes(category)) {
                return [
                    { value: "10:30-12:30", label: "10:30 AM to 12:30 PM" },

                    { value: "15:30-17:30", label: "3:30 PM to 5:30 PM" },
                ];
            } else {
                return [
                    { value: "13:01-15:00", label: "1:00 PM to 3:00 PM" },
                ];  // Only show the 2nd slot for non-RTO categories
            }
        } else {
            // On weekdays or non-weekends, show all slots
            return weekdaySlots;
        }
    };


    // Get the available time slots based on the category
    const timeSlots = getAvailableSlots(formData.category);

    const handleTrainerChange = async (e) => {
        const trainerName = e.target.value;
        handleChange("trainer", trainerName); // Update the trainer field in the formData

        if (trainerName) {
            // Check for trainer conflict
            const response = await instance.post("Sessionslot/checkTrainerConflict", {
                trainer: trainerName,
                slotdate: formData.slotdate, // Use the selected slot date for checking conflict
            });

            if (response.data.responseData.conflict === true) {
                // Show confirmation popup if there's a conflict
                const confirmMessage = `The trainer ${trainerName} is already assigned to another slot Today. Do you want to continue with this slot or choose a different time or trainer?`;
                const proceed = await alert(confirmMessage);

                if (!proceed) {
                    // Reset the trainer field if user cancels
                    handleChange("trainer", trainerName);
                    return; // Exit early if the user chooses not to continue
                }
            }
        }
    };

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
                        <Button variant="success" className="rounded-5 mx-2" onClick={handleClose1}>
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
                                        <option value="RTO – Learner Driving License Holder Training">RTO – Learner Driving License Holder Training</option>
                                        <option value="RTO – Suspended Driving License Holders Training">RTO – Suspended Driving License Holders Training</option>
                                        <option value="RTO – Training for School Bus Driver">RTO – Training for School Bus Driver</option>
                                        <option value="School Students Training – Group">School Students Training – Group</option>
                                        <option value="College/Organization Training – Group">College/Organization Training – Group</option>

                                    </Form.Select>
                                </Form.Group>


                            </Col>

                            {/* <Col md={10}>
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


                            </Col> */}
                            <Col md={10}>
                                <Form.Group controlId="trainingType">
                                    <Form.Label>Trainer Name</Form.Label>
                                    <Form.Select
                                        name="trainer"
                                        value={formData.trainer} // Use the trainer from formData
                                        onChange={handleTrainerChange} // Use the new handleTrainerChange to trigger conflict check
                                    >
                                        <option value="">Choose trainer</option>
                                        {traniners.map((trainer) => (
                                            <option key={trainer.id} value={trainer.name}>
                                                {trainer.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            {/* <Col md={10}>
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
                            </Col> */}

                            <Col md={10}>
                                <Form.Group controlId="timeSlot">
                                    <Form.Label>Select Time Slot</Form.Label>
                                    <Form.Select
                                        name="timeSlot"
                                        value={`${formData.time}-${formData.deadlineTime}`}
                                        onChange={(e) => {
                                            const [startTime, endTime] = e.target.value.split("-");
                                            setFormData({
                                                ...formData,
                                                time: startTime,
                                                deadlineTime: endTime,
                                            });
                                        }}
                                        required
                                    >
                                        <option value="">Select Time Slot</option>
                                        {timeSlots.map((slot) => (
                                            <option key={slot.value} value={slot.value}>
                                                {slot.label}
                                            </option>
                                        ))}
                                    </Form.Select>
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
                        <Row className="justify-content-center">
                            <Col md={10}>
                                <Form.Group controlId="trainingType">
                                    <Form.Label>Trainer Name</Form.Label>
                                    <Form.Select
                                        name="trainer"
                                        value={formData.trainer} // Use the trainer from formData
                                        onChange={handleTrainerChange} // Use handleTrainerChange for conflict check
                                    >
                                        <option value="">Choose trainer</option>
                                        {traniners.map((trainer) => (
                                            <option key={trainer.id} value={trainer.name}>
                                                {trainer.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col xs={12} className="d-flex justify-content-end mt-3">
                                <Button variant="primary" type="submit" className="mx-3">
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

export default SlotComp;










