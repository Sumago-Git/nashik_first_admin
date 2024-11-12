import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { FaEdit, FaEye, FaEyeSlash, FaRegEye } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import instance from '../../api/AxiosInstance';

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useSearchExport } from '../../context/SearchExportContext';
import SearchInput from '../search/SearchInput';

function Homebanner() {
  // const [title, setTitle] = useState("");
  const [img2, setImage] = useState(null);
  const [img1, setImage1] = useState(null);

  const [previewMobile, setPreviewMobile] = useState(null);

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [showAdd, setShowAdd] = useState(true);
  const [getadmin_data, setadmin_data] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [activeStatus, setActiveStatus] = useState({}); // Track isActive status

  const { searchQuery, handleSearch, handleExport, setData, filteredData } =
    useSearchExport();

  const validateForm = () => {
    let errors = {};
    let isValid = true;


    if (!img2 && !editMode) { // Only validate image in add mode
      errors.img2 = 'Image is required';
      isValid = false;
    }
    if (!img1 && !editMode) { // Only validate image in add mode
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
        setShowAdd(true); // Show table after form submission
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
        if (type === "mobile" && img.width <= 480 && img.height <= 800) {
          setImage1(file);
          setPreviewMobile(URL.createObjectURL(file));
          setErrors((prevErrors) => ({ ...prevErrors, img1: '' }));
        } else if (type === "desktop") {
          setImage(file);
          setErrors((prevErrors) => ({ ...prevErrors, img2: '' }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, img1: "Only mobile dimension images are allowed (e.g., max 480x800)." }));
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
        setImage2(null);
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
    instance.get('homeBanner/get-homeBanners')
      .then((res) => {
        setadmin_data(res.data.responseData || []);
        const initialStatus = {};
        res.data.responseData.forEach(item => {
          initialStatus[item.id] = item.isActive; // Set the initial status for each item
        });
        setActiveStatus(initialStatus); // Set active status state
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getdata_admin();
  }, []);

  const edit = (id) => {
    const item = getadmin_data.find((a) => a.id === id);
    if (item) {

      setPreview(item.img2); // Assuming 'img' contains the URL for preview
      setPreview(item.img1);
      setEditMode(true);
      setEditId(id);
      setShowAdd(false); // Show form for editing
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
              getdata_admin(); // Refresh the data after deletion
            } catch (error) {
              console.error("Error deleting data:", error);
              alert("There was an error deleting the data.");
            }
          }
        },
        {
          label: 'No',
          onClick: () => { } // Do nothing if user clicks "No"
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
          [id]: !prevStatus[id] // Toggle the isActive status
        }));
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

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

            getadmin_data.length > 0 ? (
              <>
                {/* <SearchInput value={searchQuery} onChange={handleSearch} /> */}
                <Table striped bordered hover responsive="sm">
                  <thead>
                    <tr>
                      <th>Sr. No</th>
                      <th>Image Desktop</th>
                      <th>Image Mobile</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getadmin_data.map((a, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <img
                            src={a.img2}
                            className="trademark img-fluid"
                            alt={a.title}
                            height="40"
                            width="120"
                          />
                        </td>
                        <td>
                          <img
                            src={a.img1}
                            className="trademark img-fluid"
                            alt={a.title}
                            height="40"
                            width="120"
                          />
                        </td>
                        <td className="p-2">
                          <Button variant="primary" className="m-2" onClick={() => edit(a.id)}>
                            <FaEdit />
                          </Button>
                          <Button variant="danger" className="m-2" onClick={() => delete_data(a.id)}><MdDelete /></Button>
                          <Button
                            variant={activeStatus[a.id] ? "success" : "warning"} // Button color based on isActive
                            className="m-2"
                            onClick={() => toggleActiveStatus(a.id)}
                          >
                            {/* Conditionally render the icon based on isActive status */}
                            {activeStatus[a.id] ? (
                              <FaRegEye color="white" />  // Green Eye when isActive is true
                            ) : (
                              <FaEyeSlash color="white" />  // Red Eye-slash when isActive is false
                            )}
                          </Button>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : (
              <Alert variant="warning" className="text-center">
                No data found
              </Alert>
            )
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
                  <Form.Group className="mb-3" controlId="formBasicImage">
                    <Form.Label>Upload Image mobile</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "mobile")}
                    />
                    {errors.img1 && <span className="error text-danger">{errors.img1}</span>}
                  </Form.Group>
                </Col>
              </Row>
              <Button variant={editMode ? "primary" : "success"} type="submit">
                {editMode ? 'Update' : 'Submit'}
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Homebanner;
