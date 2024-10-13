import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useSearchExport } from "../../context/SearchExportContext";
import NewResuableForm from "../../components/form/NewResuableForm";
import SearchInput from "../../components/search/SearchInput";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import instance from "../../api/AxiosInstance";
import { FaEdit } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import "../../App.scss";

const ContactInfo = () => {
  const { searchQuery, handleSearch, setData, filteredData } = useSearchExport();
  const [team, setTeam] = useState([]);
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
      name: <CustomHeader name="WhatsApp" />,
      cell: (row) => <span>{row.whatsapp}</span>,
    },
    {
      name: <CustomHeader name="Phone" />,
      cell: (row) => <span>{row.phone}</span>,
    },
    {
      name: <CustomHeader name="Email" />,
      cell: (row) => <span>{row.email}</span>,
    },
    {
      name: <CustomHeader name="Address" />,
      cell: (row) => <span>{row.address}</span>,
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
    fetchTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await instance.get("contact-detail/get-contactdetails", {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      });
      const reversedData = response.data.responseData;
      setTeam(reversedData);
      setData(reversedData);
    } catch (error) {
      console.error(
        "Error fetching team:",
        error.response || error.message || error
      );
      toast.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (data) => {
    let errors = {};
    let isValid = true;

    // WhatsApp Validation
    if (!data.whatsapp?.trim()) {
      errors.whatsapp = "WhatsApp number is required";
      isValid = false;
    } else if (!/^\d+$/.test(data.whatsapp)) {
      errors.whatsapp = "WhatsApp number must contain only digits";
      isValid = false;
    }

    // Phone Validation
    if (!data.phone?.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d+$/.test(data.phone)) {
      errors.phone = "Phone number must contain only digits";
      isValid = false;
    }

    // Email Validation
    if (!data.email?.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    // Address Validation
    if (!data.address?.trim()) {
      errors.address = "Address is required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm(formData)) {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      try {
        await instance.put(`header-contact/headercontact/${editingId}`, data, {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Data Updated Successfully");

        const updatedTeam = team.map((member) =>
          member.id === editingId ? { ...member, ...formData } : member
        );
        setTeam(updatedTeam);
        setData(updatedTeam);
        setEditMode(false);
        setFormData({});
        setShowTable(true);
      } catch (error) {
        console.error("Error updating data:", error);
        toast.error("Failed to update data.");
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleEdit = (id) => {
    const selectedMember = team.find((member) => member.id === id);
    setEditingId(id);
    setFormData(selectedMember);
    setEditMode(true);
    setShowTable(false);
  };

  const handleCancel = () => {
    setFormData({});
    setEditMode(false);
    setShowTable(true);
    setErrors({});
  };

  return (
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
                  ) : (
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowTable(true)}
                    >
                      View
                    </Button>
                  )}
                </Col>
              </Row>
            </Card.Header>

            <Card.Body>
              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "100px" }}
                >
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
                  data={filteredData.length > 0 ? filteredData : team}
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
                        label={"WhatsApp"}
                        placeholder={"Enter WhatsApp number"}
                        type={"text"}
                        name={"whatsapp"}
                        onChange={handleChange}
                        initialData={formData}
                        error={errors.whatsapp}
                      />
                    </Col>
                    <Col md={6}>
                      <NewResuableForm
                        label={"Phone"}
                        placeholder={"Enter phone number"}
                        type={"text"}
                        name={"phone"}
                        onChange={handleChange}
                        initialData={formData}
                        error={errors.phone}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <NewResuableForm
                        label={"Email"}
                        placeholder={"Enter email"}
                        type={"email"}
                        name={"email"}
                        onChange={handleChange}
                        initialData={formData}
                        error={errors.email}
                      />
                    </Col>
                    <Col md={6}>
                      <NewResuableForm
                        label={"Address"}
                        placeholder={"Enter address"}
                        type={"text"}
                        name={"address"}
                        onChange={handleChange}
                        initialData={formData}
                        error={errors.address}
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
  );
};

export default ContactInfo;
