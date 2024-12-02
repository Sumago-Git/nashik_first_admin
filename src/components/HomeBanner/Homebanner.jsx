import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { FaEdit, FaEyeSlash, FaRegEye } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import DataTable from 'react-data-table-component';
import instance from '../../api/AxiosInstance';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useSearchExport } from '../../context/SearchExportContext';

function Homebanner() {
  const [img2, setImage] = useState(null);
  const [img1, setImage1] = useState(null);
  const [previewMobile, setPreviewMobile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [showAdd, setShowAdd] = useState(true);
  const [getadmin_data, setadmin_data] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [activeStatus, setActiveStatus] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { searchQuery, handleSearch, handleExport, setData, filteredData } =
    useSearchExport();

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!img2 && !editMode) {
      errors.img2 = 'Image is required';
      isValid = false;
    }
    if (!img1 && !editMode) {
      errors.img1 = 'Image is required';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleForm = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const formData = new FormData();

      if (img2) formData.append('img2', img2);
      if (img1) formData.append('img1', img1);

      try {
        if (editMode && editId) {
          await instance.put(`homeBanner/update-homeBanner/${editId}`, formData);
          alert('Data updated successfully!');
        } else {
          await instance.post('homeBanner/create-homeBanner', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          alert('Data submitted successfully!');
        }

        setImage(null);
        setImage1(null);

        setPreview(null);
        setErrors({});
        setEditMode(false);
        setEditId(null);
        getdata_admin();
        setShowAdd(true);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (type === "mobile" && img.width <= 1360 && img.height <= 1055) {
          setImage1(file);
          setPreviewMobile(URL.createObjectURL(file));
          setErrors((prevErrors) => ({ ...prevErrors, img1: '' }));
        } else if (type === "desktop") {
          setImage(file);
          setErrors((prevErrors) => ({ ...prevErrors, img2: '' }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, img1: "Only mobile dimension images are allowed (e.g., max 1360x1055)." }));
          setImage1(null);
          setPreviewMobile(null);
        }
      }
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [type === "mobile" ? "img1" : "img2"]: "Only image files are allowed." }));
      if (type === "mobile") {
        setImage1(null);
        setPreviewMobile(null);
      } else {
        setImage(null);
      }
    }
  };

  const handleToggle = () => {
    setShowAdd(!showAdd);
    setEditMode(false);
    setImage(null);
    setImage1(null);
    setPreview(null);
    setErrors({});
  };

  const getdata_admin = () => {
    instance.get('homeBanner/find-homeBanners')
      .then((res) => {
        setadmin_data(res.data.responseData || []);
        const initialStatus = {};
        res.data.responseData.forEach(item => {
          initialStatus[item.id] = item.isActive;
        });
        setActiveStatus(initialStatus);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getdata_admin();
  }, []);

  const edit = (id) => {
    const item = getadmin_data.find((a) => a.id === id);
    if (item) {
      setPreview(item.img2);
      setPreview(item.img1);
      setEditMode(true);
      setEditId(id);
      setShowAdd(false);
    }
  };

  const delete_data = async (id) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await instance.delete(`homeBanner/homeBanner-delete/${id}`);
              getdata_admin();
            } catch (error) {
              console.error("Error deleting data:", error);
              alert("There was an error deleting the data.");
            }
          }
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  };

  const toggleActiveStatus = async (id) => {
    try {
      const response = await instance.put(`homeBanner/homeBanner-status/${id}`);
      if (response.data) {
        setActiveStatus(prevStatus => ({
          ...prevStatus,
          [id]: !prevStatus[id]
        }));
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Define columns for DataTable
  const tableColumns = () => [
    {
      name: 'Sr. No',
      selector: (row, index) => index + 1 + (currentPage - 1) * rowsPerPage,
    },
    {
      name: 'Image Desktop',
      cell: (row) => <img src={row.img2} alt={row.title} height="40" width="120" />,
    },
    {
      name: 'Image Mobile',
      cell: (row) => <img src={row.img1} alt={row.title} height="40" width="120" />,
    },
    {
      name: 'Action',
      cell: (row) => (
        <>
          <Button variant="primary" className="m-2" onClick={() => edit(row.id)}>
            <FaEdit />
          </Button>
          <Button variant="danger" className="m-2" onClick={() => delete_data(row.id)}>
            <MdDelete />
          </Button>
          <Button
            variant={activeStatus[row.id] ? "success" : "warning"}
            className="m-2"
            onClick={() => toggleActiveStatus(row.id)}
          >
            {activeStatus[row.id] ? <FaRegEye color="white" /> : <FaEyeSlash color="white" />}
          </Button>
        </>
      ),
    },
  ];

  return (
    <Container>
      <Card>
        <Card.Header className="d-flex justify-content-end">
          <Button variant={editMode ? "primary" : "success"} onClick={handleToggle}>
            {showAdd ? 'Add' : 'View'}
          </Button>
        </Card.Header>
        <Card.Body>
          {showAdd ? (
            <DataTable
              columns={tableColumns()}
              data={filteredData.length > 0 ? filteredData : getadmin_data}
              pagination
              responsive
              striped
              noDataComponent="No Data Available"
              onChangePage={(page) => setCurrentPage(page)}
              onChangeRowsPerPage={(rows) => setRowsPerPage(rows)}
            />
          ) : (
            <Form onSubmit={handleForm}>
              <Row>
                <Col lg={6} md={6} sm={12}>
                  <Form.Group className="mb-3" controlId="formBasicImage">
                    <Form.Label>Upload Image Desktop</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "desktop")}
                    />
                    {errors.img2 && <span className="error text-danger">{errors.img2}</span>}
                  </Form.Group>
                </Col>
                <Col lg={6} md={6} sm={12}>
                  <Form.Group className="mb-3" controlId="formBasicImage1">
                    <Form.Label>Upload Image Mobile</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "mobile")}
                    />
                    {errors.img1 && <span className="error text-danger">{errors.img1}</span>}
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex ">
                <Button variant={editMode ? "primary" : "success"}  type="submit">
                  {editMode ? 'Update' : 'Submit'}
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Homebanner;
