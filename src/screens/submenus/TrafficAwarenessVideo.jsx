import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useSearchExport } from "../../context/SearchExportContext";
import { ShowContext } from "../../context/ShowContext";
import NewResuableForm from "../../components/form/NewResuableForm";
import SearchInput from "../../components/search/SearchInput";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import instance from "../../api/AxiosInstance";
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ThreeDots } from 'react-loader-spinner';

import "../../App.scss";

const TrafficAwarenessVideo = () => {
  const { searchQuery, handleSearch, handleExport, setData, filteredData } =
    useSearchExport();

  const [team, setTeam] = useState([]);
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [eyeVisibilityById, setEyeVisibilityById] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [showTable, setShowTable] = useState(true); // New state for toggling form and table view
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

  useEffect(() => {
    fetchTeam();

    const storedVisibility = JSON.parse(localStorage.getItem('eyeVisibilityById')) || {};
    setEyeVisibilityById(storedVisibility);
  }, []);

  useEffect(() => {
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

  const fetchTeam = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken"); // Retrieve access token
    try {
      const response = await instance.get("leadership/get-leadership", {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      });
      const reversedData = response.data.responseData.reverse();
      setTeam(reversedData);
      setData(reversedData);
    } catch (error) {
      console.error("Error fetching team:", error.response || error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (formData) => {
    let errors = {};
    let isValid = true;

    if (!formData.img) {
      errors.img = "video is required";
      isValid = false;
    } else if (formData.img instanceof File) {
      const fileType = formData.img.type;
      if (fileType !== "application/pdf") {
        errors.img = "Only PDF files are allowed";
        isValid = false;
      }
    }
    if (!formData.financial?.trim()) {
      errors.financial = "Financial Year is required";
    }

    setErrors(errors);
    return isValid;
  };

  const handleChange = (name, value) => {
    if (name === "img" && value instanceof File) {
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
      setErrors((prevErrors) => ({ ...prevErrors, img: "" }));
    } else if (name === "img" && value) {
      const fileType = value.type;
      if (fileType !== "application/pdf") {
        setErrors((prevErrors) => ({ ...prevErrors, img: "Only PDF files are allowed" }));
        setImagePreview("");
      } else {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    console.log("Form data ",formData)
    e.preventDefault();
    setShowTable(true);
    
    if (validateForm(formData)) {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken"); // Retrieve access token
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      try {
        if (editMode) {
          await instance.put(`leadership/update-leadership/${editingId}`, data, {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "multipart/form-data",
            },
          });
          toast.success("Data Updated Successfully");
          const updatedTeam = team.map((member) =>
            member.id === editingId ? formData : member
          );
          setTeam(updatedTeam);
        } else {
          await instance.post("leadership/create-leadership", data, {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "multipart/form-data",
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
            boxShadow: "0 4px 8px rgba(5, 5, 5, 0.1)",
          }}
        >
          <h1>Confirm Delete</h1>
          <p>Are you sure you want to delete this item?</p>
          <Button
            onClick={async () => {
              setLoading(true);
              const accessToken = localStorage.getItem("accessToken"); // Retrieve access token
              try {
                await instance.delete(`leadership/delete-leadership/${id}`, {
                  headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "application/json",
                  },
                });
                toast.success("Data Deleted Successfully");
                fetchTeam();
              } catch (error) {
                console.error("Error deleting data:", error);
              } finally {
                setLoading(false);
                onClose();
              }
            }}
          >
            Delete
          </Button>
          <Button onClick={onClose} style={{ marginLeft: "10px" }}>
            Cancel
          </Button>
        </div>
      ),
    });
  };

  const toggleEdit = (id) => {
    const selectedData = team.find((item) => item.id === id);
    if (selectedData) {
      setFormData({ financial: selectedData.financial, img: selectedData.img });
      setEditingId(id);
      setEditMode(true);
      setShowTable(false); // Show form view
    }
  };

  const handleIsActive = (id, isActive) => {
    setEyeVisibilityById((prev) => ({
      ...prev,
      [id]: isActive,
    }));
  };

  return (
    <>
      <Container fluid>
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div>
              <p></p>
            </div>
            <Button onClick={() => setShowTable(!showTable)}>
              {showTable ? "Add" : "View"}
            </Button>
          </Card.Header>
          <Card.Body>
            <Card.Title></Card.Title>
            <Card.Text>
              {loading ? (
                <div className="d-flex justify-content-center">
                  <ThreeDots color="#00BFFF" height={80} width={80} />
                </div>
              ) : showTable ? (
                <>
                  <SearchInput value={searchQuery} onChange={handleSearch} />
                  <DataTable
                    columns={tableColumns(currentPage, rowsPerPage)}
                    data={filteredData}
                    pagination
                    paginationServer
                    paginationTotalRows={filteredData.length}
                    onChangePage={setCurrentPage}
                    onChangeRowsPerPage={setRowsPerPage}
                    highlightOnHover
                    dense
                  />
                </>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="finacial">
                        <Form.Label>Financial Year</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ex.2021-2022"
                          value={formData.financial || ''}
                          onChange={(e) => handleChange("financial", e.target.value)}
                          isInvalid={!!errors.financial}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.financial}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="img">
                        <Form.Label>Upload Video</Form.Label>
                        <Form.Control
                          type="file"
                          accept="video/*" // Allow all video file types
                          onChange={(e) => handleChange("img", e.target.files[0])}
                          isInvalid={!!errors.img}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.img}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col className="d-flex justify-content-end">
                      <Button variant="primary" type="submit" disabled={loading}>
                        {editMode ? "Update" : "Submit"}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default TrafficAwarenessVideo;
