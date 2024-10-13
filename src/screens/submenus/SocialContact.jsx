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

const SocialContact = () => {
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
      name: <CustomHeader name="Facebook" />,
      cell: (row) => <span>{row.facebook}</span>,
    },
    {
      name: <CustomHeader name="Instagram" />,
      cell: (row) => <span>{row.instagram}</span>,
    },
    {
      name: <CustomHeader name="Email" />,
      cell: (row) => <span>{row.email}</span>,
    },
    {
      name: <CustomHeader name="Whatsapp" />,
      cell: (row) => <span>{row.whatsapp}</span>,
    },
    {
      name: <CustomHeader name="Linkedin" />,
      cell: (row) => <span>{row.linkedin}</span>,
    },
    {
      name: <CustomHeader name="Twitter" />,
      cell: (row) => <span>{row.twitter}</span>,
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
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await instance.get("social-contact/get-socialcontacts", {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      });
      console.log("response", response);

      const reversedData = response.data.responseData;
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

    if (!formData.facebook?.trim()) {
      errors.facebook = "Facebook link is required";
      isValid = false;
    }

    if (!formData.instagram?.trim()) {
      errors.instagram = "Instagram link is required";
      isValid = false;
    }
    if (!formData.email?.trim()) {
      errors.email = "email link is required";
      isValid = false;
    }
    if (!formData.linkedin?.trim()) {
      errors.linkedin = "linkedin link is required";
      isValid = false;
    }
    if (!formData.twitter?.trim()) {
      errors.linkedin = "twitter link is required";
      isValid = false;
    }
    if (!formData.whatsapp?.trim()) {
      errors.whatsapp = "Whatsapp number is required";
      isValid = false;
    } else if (!/^\d+$/.test(formData.whatsapp)) {
      errors.whatsapp = "Whatsapp number must contain only digits";
      isValid = false;
    } else if (formData.whatsapp.length !== 10) {
      errors.whatsapp = "Whatsapp number must be exactly 10 digits";
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
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      try {
        await instance.put(`social-contact/socialcontact/${editingId}`, data, {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
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
        console.error("Error handling form submission:", error);
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
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Row>
                <Col className="d-flex justify-content-end align-items-center">
                  {showTable && (
                    <SearchInput
                      searchQuery={searchQuery}
                      onSearch={handleSearch}
                      showExportButton={false}
                    />
                  )}
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
                        label={"Facebook"}
                        placeholder={"Enter facebook Link"}
                        type={"text"}
                        name={"facebook"}
                        onChange={handleChange}
                        initialData={formData}
                        error={errors.facebook}
                      />
                    </Col>
                    <Col md={6}>
                      <NewResuableForm
                        label={"Instagram"}
                        placeholder={"Enter Instagram Link"}
                        type={"text"}
                        name={"instagram"}
                        onChange={handleChange}
                        initialData={formData}
                        error={errors.instagram}
                      />
                    </Col>
                    <Col md={6}>
                      <NewResuableForm
                        label={"Email Id"}
                        placeholder={"Enter Email Id "}
                        type={"text"}
                        name={"email"}
                        onChange={handleChange}
                        initialData={formData}
                        error={errors.email}
                      />
                    </Col>
                    <Col md={6}>
                      <NewResuableForm
                        label={"Whatsapp"}
                        placeholder={"Enter Whatsapp Number "}
                        type={"text"}
                        name={"whatsapp"}
                        onChange={handleChange}
                        initialData={formData}
                        error={errors.whatsapp}
                      />
                    </Col>
                    <Col md={6}>
                      <NewResuableForm
                        label={"LinkedIn"}
                        placeholder={"Enter LinkedIn Link "}
                        type={"text"}
                        name={"linkedin"}
                        onChange={handleChange}
                        initialData={formData}
                        error={errors.linkedin}
                      />
                    </Col>
                    <Col md={6}>
                      <NewResuableForm
                        label={"Twitter"}
                        placeholder={"Enter Twitter Link "}
                        type={"text"}
                        name={"twitter"}
                        onChange={handleChange}
                        initialData={formData}
                        error={errors.twitter}
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

export default SocialContact;
