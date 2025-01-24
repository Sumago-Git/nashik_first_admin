import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import * as XLSX from 'xlsx';

import instance from '../../api/AxiosInstance';
import Backbtn from '../Calender Component/Backbtn';

const Sessionslotdetails = () => {
  const [formData, setFormData] = useState({
    learningNo: '____/_______/____',
    fname: '',
    mname: '',
    lname: '',
    email: '',
    phone: '',
    excel: '',
    // vehicletype: [],
    institution_name: "",
    institution_email: "",
    institution_phone: "",
    hm_principal_manager_name: "",
    hm_principal_manager_mobile: "",
    coordinator_mobile: "",
    coordinator_name: ""
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [slotTime, setSlotTime] = useState("")
  const location = useLocation()
  const [slotsession, setSlotSession] = useState("")
  const [slotdate, setSlotDate] = useState("")
  const [category, setCategory] = useState(""); // Add a state for category
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slotDatefortest, setslotDatefortest] = useState("")
  console.log(slotDatefortest)
  useEffect(() => {
    if (location && location.state) {
      console.log("location state : ", location.state);
      const selectedSession = location.state.selectedTime.split('-')[1];
      setSlotSession(selectedSession)
      setSlotDate(location.state.selectedDate)
      setslotDatefortest(location.state.temodate)
      console.log(location.state.temodate)
      // console.log("location.selectedTime", location.state.selectedTime);
      setCategory(location.state.category || ""); // Assume category comes from the location state
      setSlotTime(`${location.state.selectedDate} ${location.state.selectedTime}`);
    }
  }, [location])



  const validateForm = (formData) => {
    let errors = {};
    let isValid = true;


    // coordinator_mobile: formData.coordinator_mobile,
    // coordinator_name: formData.coordinator_name,

    if (!formData.institution_name) {
      errors.institution_name = 'Institution Name is required';
      isValid = false;
    }
    if (!formData.institution_email) {
      errors.institution_email = 'Institution Email is required';
      isValid = false;
    }

    if (!formData.hm_principal_manager_name) {
      errors.hm_principal_manager_name = 'Principal Manager Name is required';
      isValid = false;
    }
    if (!formData.hm_principal_manager_mobile) {
      errors.hm_principal_manager_mobile = 'Principal Manager Mobile is required';
      isValid = false;
    }
    if (!formData.coordinator_name) {
      errors.coordinator_name = 'Coordinator Name is required';
      isValid = false;
    }
    setErrors(errors);
    return isValid;
  };



  const handleChange = (e) => {
    const { name, files } = e.target;


    // Handle other fields
    setFormData((prevData) => ({
      ...prevData,
      [name]: e.target.value,
    }));



  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    // Start loading
    if (validateForm(formData)) {
      setIsSubmitting(true);
      // Format the slotdate before sending it
      let value = slotdate;
      const parts = value.split(' '); // Split the string by space
      const dateParts = parts[1].split('/'); // Split the date part (e.g., "27/11/2024") by "/"

      // Extract day, month, and year
      const day = dateParts[0];
      const month = dateParts[1];
      const year = dateParts[2];

      // Format to YYYY-MM-DD
      const formattedDate = `${month}/${day}/${year}`;

      try {
        const sessionSlotId = localStorage.getItem('slotsid');

        // Create the data object in JSON format
        const data = {

          category: category,
          slotsession: slotsession,
          slotdate: formattedDate,
          institution_name: formData.institution_name,
          institution_email: formData.institution_email,
          institution_phone: formData.institution_phone,
          hm_principal_manager_name: formData.hm_principal_manager_name,
          hm_principal_manager_mobile: formData.hm_principal_manager_mobile,
          coordinator_mobile: formData.coordinator_mobile,
          coordinator_name: formData.coordinator_name,
          sessionSlotId: sessionSlotId,
        };

        // Send a POST request with JSON data
        const response = await instance.post('bookingform/registerSlotInfo', data, {
          headers: {
            'Content-Type': 'application/json', // Set content type to application/json
          },
        });
        localStorage.setItem('slotsids', sessionSlotId),
          // Redirect after successful submission
          navigate('/bookingpage',

            {
              state: {
                selectedDate: slotdate,
                selectedTime: `${slotTime}`,
                category: category,
                temodate: slotDatefortest

              }
            }
          );
      } catch (error) {
        console.error('Error submitting form:', error);
        if (error.response) {
          alert(`Error: ${error.response.data.message || 'Something went wrong!'}`);
        } else {
          alert('Error: No response from server.');
        }
      } finally {
        setIsSubmitting(false); // Stop loading
      }
    };
  }








  return (
    <>




      <Backbtn/>
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
                placeholder={"Institution Name"}
                className='dateinput p-3 m-0 mt-0 ms-lg-3'
              />
              {errors.institution_name && <p className='text-start ms-md-4 mt-1 text-danger'>{errors.institution_name}</p>}
            </Col>
            <Col lg={6}></Col>
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
              {/* {errors.institution_phone && <p className='text-start ms-md-4 mt-1 text-danger'>{errors.institution_phone}</p>} */}
            </Col>
            <Col lg={6}>
              <p className='bookingdate text-black text-start ms-lg-4 ms-sm-3 mt-3'>{"Principal/Manager Name*"}</p>
              <input
                name='hm_principal_manager_name'
                value={formData.hm_principal_manager_name}
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>

          </Row>
        </form>





      </Container>



    </>
  );
}

export default Sessionslotdetails;
