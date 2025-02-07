import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import instance from '../../api/AxiosInstance';
import Backbtn from '../Calender Component/Backbtn';

const Sessionslotdetails2 = () => {
  const { id } = useParams(); // Get the slot ID from the URL
  const [formData, setFormData] = useState({
    institution_name: '',
    institution_email: '',
    institution_phone: '',
    hm_principal_manager_name: '',
    hm_principal_manager_mobile: '',
    coordinator_mobile: '',
    coordinator_name: '',
    // Other fields you want to update
  });
  const [errors, setErrors] = useState({});
  const [slotdate, setSlotDate] = useState('');
  const [slotsession, setSlotSession] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchSlotDetails = async () => {
      try {
        const response = await instance.get(`/bookingform/getSlotInfobyid/${id}`);
        const data = response.data.data; // Make sure to extract the data property correctly
        setFormData({
          institution_name: data.institution_name,
          institution_email: data.institution_email,
          institution_phone: data.institution_phone,
          hm_principal_manager_name: data.hm_principal_manager_name,
          hm_principal_manager_mobile: data.hm_principal_manager_mobile,
          coordinator_mobile: data.coordinator_mobile,
          coordinator_name: data.coordinator_name,
        });
        setSlotDate(data.slotdate);
        setSlotSession(data.slotsession);
        setCategory(data.category);
      } catch (error) {
        console.error("Error fetching slot details:", error);
        alert("Error fetching slot details.");
      }
    };

    fetchSlotDetails();
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        category,
        slotsession,
        slotdate,
        institution_name: formData.institution_name,
        institution_email: formData.institution_email,
        institution_phone: formData.institution_phone,
        hm_principal_manager_name: formData.hm_principal_manager_name,
        hm_principal_manager_mobile: formData.hm_principal_manager_mobile,
        coordinator_mobile: formData.coordinator_mobile,
        coordinator_name: formData.coordinator_name,
      };

      // Send the update request
      const response = await instance.put(`/bookingform/updateSlotInfo/${id}`, data, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Navigate back or show success message
      navigate('/groupbooking');
      alert("Slot registration updated successfully.");
    } catch (error) {
      console.error('Error updating form:', error);
      alert("Error updating slot details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Backbtn />
      <Container className='bookingdetails mt-5 pt-4 pb-3 '>

        <h1 className='bookingheadline mt-3 mx-auto'>Please fill in your details</h1>
        <form onSubmit={handleSubmit}>
          <Row className=''>
            <Col lg={6} md={7} sm={12}>
              <p className='bookingdate text-black text-start ms-lg-4 ms-sm-3 mt-3'>{"Institution Name*"}</p>
              <input
                name='institution_name'
                value={formData.institution_name}
                onChange={handleChange}
                onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '')} // Allow only alphabets

                placeholder={"Institution Name"}
                className='dateinput p-3 m-0 mt-0 ms-lg-3'
              />
              {errors.institution_name && <p className='text-start ms-md-4 mt-1 text-danger'>{errors.institution_name}</p>}
            </Col>
            <Col lg={6}>
              <p className='bookingdate text-black text-start ms-lg-4 ms-sm-3 mt-3'>{"Institution Email*"}</p>
              <input
                name='institution_email'
                value={formData.institution_email}
                onChange={handleChange}
                placeholder={"Institution Email"}
                className='dateinput p-3 m-0 mt-0 ms-lg-3'
              />
              {errors.institution_email && <p className='text-start ms-md-4 mt-1 text-danger'>{errors.institution_email}</p>}
            </Col>
            <Col lg={6}>
              <p className='bookingdate text-black text-start ms-lg-4 ms-sm-3 mt-3'>{"Institution Landline No."}</p>
              <input
                name='institution_phone'
                value={formData.institution_phone}
                onChange={handleChange}
                placeholder={"Institution Landline No."}
                className='dateinput p-3 m-0 mt-0 ms-lg-3'
              />
              {errors.institution_phone && <p className='text-start ms-md-4 mt-1 text-danger'>{errors.institution_phone}</p>}
            </Col>
            <Col lg={6}>
              <p className='bookingdate text-black text-start ms-lg-4 ms-sm-3 mt-3'>{"Principal/Manager Name*"}</p>
              <input
                name='hm_principal_manager_name'
                value={formData.hm_principal_manager_name}
                onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '')} // Allow only alphabets

                onChange={handleChange}
                placeholder={"Principal/Manager Name"}
                className='dateinput p-3 m-0 mt-0 ms-lg-3'
              />
              {errors.hm_principal_manager_name && <p className='text-start ms-md-4 mt-1 text-danger'>{errors.hm_principal_manager_name}</p>}
            </Col>
            <Col lg={6}>
              <p className='bookingdate text-black text-start ms-lg-4 ms-sm-3 mt-3'>{"Principal/Manager Mobile*"}</p>
              <input
                name='hm_principal_manager_mobile'
                maxLength="10"
                value={formData.hm_principal_manager_mobile}
                onChange={handleChange}
                placeholder={"Principal/Manager Mobile"}
                className='dateinput p-3 m-0 mt-0 ms-lg-3'
              />
              {errors.hm_principal_manager_mobile && <p className='text-start ms-md-4 mt-1 text-danger'>{errors.hm_principal_manager_mobile}</p>}
            </Col>
            <Col lg={6}>
              <p className='bookingdate text-black text-start ms-lg-4 ms-sm-3 mt-3'>{"Coordinator Name*"}</p>
              <input
                name='coordinator_name'
                value={formData.coordinator_name}
                onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '')} // Allow only alphabets

                onChange={handleChange}
                placeholder={"Cordinator Name"}
                className='dateinput p-3 m-0 mt-0 ms-lg-3'
              />
              {errors.coordinator_name && <p className='text-start ms-md-4 mt-1 text-danger'>{errors.coordinator_name}</p>}
            </Col>
            <Col lg={6} >
              <p className='bookingdate text-black text-start ms-lg-4 ms-sm-3 mt-3'>{"Cordinator Mobile*"}</p>

              <input
                name='coordinator_mobile'
                maxLength="10"
                value={formData.coordinator_mobile}
                onChange={handleChange}
                placeholder={"Cordinator Mobile"}
                className='dateinput p-3 m-0 mt-0 ms-lg-3'
              />
              {errors.coordinator_mobile && <p className='text-start ms-md-4 mt-1 text-danger'>{errors.coordinator_mobile}</p>}
            </Col>




            <div className='text-center my-2'>
              <Button type="submit">
                Update
              </Button>                </div>
          </Row>
        </form>





      </Container></>
  );
};




export default Sessionslotdetails2;
