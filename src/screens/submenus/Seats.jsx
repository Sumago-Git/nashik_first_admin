import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
    Tooltip, OverlayTrigger,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useSearchExport } from "../../context/SearchExportContext";
import NewResuableForm from "../../components/form/NewResuableForm";
import SearchInput from "../../components/search/SearchInput";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import instance from "../../api/AxiosInstance";
import { FaEdit } from "react-icons/fa";
import { ThreeDots } from 'react-loader-spinner';
import "../../App.scss";

const Seats = () => {
    const { searchQuery, handleSearch, setData, filteredData } = useSearchExport();
    const [seat, setSeat] = useState([]);
    const [errors, setErrors] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});
    const [showTable, setShowTable] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);

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
            name: <CustomHeader name="No. of Seat Available Per Slot" />,
            cell: (row) => <span>{row.seatCount}</span>,
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
                </div>
            ),
        },
    ];

    useEffect(() => {
        fetchSeat();
    }, []);

    const fetchSeat = async () => {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        try {
            const response = await instance.get("seats/get-seat", {
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "application/json",
                },
            });
            const reversedData = response.data.responseData;
            setSeat(reversedData);
            setData(reversedData);
        } catch (error) {
            console.error("Error fetching seat:", error.response || error.message || error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = (formData) => {
        let errors = {};
        let isValid = true;

        if (!formData.seatCount?.trim()) {
            errors.seatCount = "Seat Count is required";
            isValid = false;
        } else if (!/^\d+$/.test(formData.seatCount)) {
            errors.seatCount = "Seat Count must contain only digits";
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleChange = (name, value) => {
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm(formData)) {
            setLoading(true);
            const accessToken = localStorage.getItem("accessToken");
            const data = new FormData();
            console.log("formData", formData);


            try {
                await instance.put(`seats/seat/${editingId}`, formData, {
                    headers: {
                        Authorization: "Bearer " + accessToken,
                        "Content-Type": "application/json",
                    },
                });
                toast.success("Data Updated Successfully");


                const updatedSeat = seat.map((member) =>
                    member.id === editingId ? { ...member, ...formData } : member
                );
                setSeat(updatedSeat);
                setData(updatedSeat);
                setEditMode(false);
                setFormData({});
                setShowTable(true);
            } catch (error) {
                console.error("Error handling form submission:", error);
            } finally {
                setLoading(false);
            }
        }
    };
    const toggleEdit = (id) => {
        const selectedMember = seat.find((member) => member.id === id);
        setEditingId(id);
        setFormData(selectedMember);
        setEditMode(true);
        setShowTable(false);
    };

    const handleCancel = () => {
        setFormData({});
        setEditMode(false);
        setShowTable(true);
    };

    return (
        <>
            <Container fluid>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Row>
                                    <Col className="d-flex justify-content-end align-items-center">
                                        {showTable ? (
                                            <SearchInput
                                                searchQuery={searchQuery}
                                                onSearch={handleSearch}
                                                showExportButton={false}
                                            />
                                        )
                                            :
                                            <Button variant="outline-secondary" onClick={() => setShowTable(true)}>
                                                View
                                            </Button>
                                        }
                                    </Col>
                                </Row>
                            </Card.Header>

                            <Card.Body>
                                {loading ? (
                                    <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                                        <ThreeDots
                                            height="80"
                                            width="80"
                                            radius="9"
                                            color="#000"
                                            ariaLabel="three-dots-loading"
                                            visible={true}
                                        />
                                    </div>
                                ) : showTable ? (
                                    <DataTable
                                        columns={tableColumns(currentPage, rowsPerPage)}
                                        data={filteredData.length > 0 ? filteredData : seat}
                                        pagination
                                        responsive
                                        striped
                                        noDataComponent="No Data Available"
                                        onChangePage={(page) => setCurrentPage(page)}
                                        onChangeRowsPerPage={(rowsPerPage) =>
                                            setRowsPerPage(rowsPerPage)
                                        }
                                    />
                                ) : (
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <NewResuableForm
                                                    label={"Available Seat"}
                                                    placeholder={"Enter Available Seat number"}
                                                    type={"text"}
                                                    name={"seatCount"}
                                                    onChange={handleChange}
                                                    initialData={formData}
                                                    error={errors.seatCount}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <div className="mt-3 d-flex justify-content-end">
                                                <Button type="submit" variant="success">
                                                    Update
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    className="ms-2"
                                                    onClick={handleCancel}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </Row>
                                    </Form>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            {/* <Container fluid className="mt-3">
                <Row>
                    <Col>
                        <Card>

                        </Card>
                    </Col>
                </Row>
            </Container> */}
        </>
    );
};

export default Seats;
