import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import InputMask from 'react-input-mask';

import Form from 'react-bootstrap/Form';
import * as XLSX from 'xlsx';

import instance from '../../api/AxiosInstance';

const Bookingpage2 = () => {
  const [formData, setFormData] = useState({
    learningNo: '_/__/__',
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
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");





  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email regex
    const phoneRegex = /^[0-9]{10}$/; // 10-digit phone number regex
    const landlineRegex = /^(?:\+91[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{6,8}$/; // Landline number regex
    const nameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces for name fields
    const licenseRegex = /^[A-Z]{2}\d{2}\/\d{7}\/\d{4}$/; // Format like "MH15/0012345/3456"
    const charOnlyRegex = /^[A-Za-z]+$/; // Only letters, no spaces or special characters
    const numberOnlyRegex = /^\d+$/; // Only numbers

    // Validate for group training category
    if (!formData.excel) {
      newErrors.excel = 'Please upload an Excel file.';
    }
    if (!formData.institution_name) {
      newErrors.institution_name = 'Institution name is required';
    } else if (!nameRegex.test(formData.institution_name)) {
      newErrors.institution_name = 'Institution name should only contain letters and spaces';
    }
    if (!formData.institution_email) {
      newErrors.institution_email = 'Institution email is required';
    } else if (!emailRegex.test(formData.institution_email)) {
      newErrors.institution_email = 'Please enter a valid institution email address';
    }
    if (!formData.institution_phone) {
      newErrors.institution_phone = 'Institution phone is required';
    } else if (!landlineRegex.test(formData.institution_phone)) {
      newErrors.institution_phone = 'Institution phone number must be a valid format (e.g., +1-800-123-4567 or 8001234567)';
    }


    // Validate the ReCAPTCHA


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };




  const handleChange = (e) => {
    const { name, files } = e.target;

    if (name === 'excel') {
      const file = files[0];

      const allowedExtensions = /(\.xls|\.xlsx)$/i;
      if (file && !allowedExtensions.exec(file.name)) {
        alert("Please upload a valid Excel file (.xls or .xlsx)");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Get headers and validate columns
        const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];
        const requiredExcelColumns = ["fname", "mname", "lname", "email", "phone"];
        let requiredColumns;
        if (category === "College/Organization Training – Group") {
          requiredColumns = requiredExcelColumns; // Your existing requiredExcelColumns
        } else if (category === "School Students Training – Group") {
          requiredColumns = ["fname", "mname", "lname"];
        }

        const isValidColumns = requiredColumns.every(column => headers.includes(column));

        if (!isValidColumns) {
          alert("The uploaded Excel file does not match the required structure. Please check the column names.");
          e.target.value = "";
          return;
        }

        if (!isValidColumns) {
          alert("The uploaded Excel file does not match the required structure. Please check the column names.");
          e.target.value = "";
          return;
        }

        // Count rows and validate the number of entries
        const rows = XLSX.utils.sheet_to_json(sheet);
        const rowCount = rows.length;

        if (rowCount <= 30 || rowCount >= 70) {
          alert("The number of entries in the Excel file should be greater than 30 and less than 70.");
          e.target.value = "";
          return;
        }

        // If both column structure and row count are valid, set the file in formData
        setFormData((prevData) => ({
          ...prevData,
          [name]: file,
        }));
      };

      reader.readAsArrayBuffer(file);
    } else {
      // Handle other fields
      setFormData((prevData) => ({
        ...prevData,
        [name]: e.target.value,
      }));


    }
  };



  const handleSubmit = async (e) => {


    e.preventDefault();


    setIsSubmitting(true); // Start loading
    let value = slotdate
    const parts = value.split(' '); // Split the string by space
    const dateParts = parts[1].split('/'); // Split the date part (e.g., "27/11/2024") by "/"

    // Extract day, month, and year
    const day = dateParts[0];
    const month = dateParts[1];
    const year = dateParts[2];

    // Format to YYYY-MM-DD
    const formattedDate = `${month}/${day}/${year}`;

    try {
      // Create a new FormData instance
      const sessionSlotId = localStorage.getItem('slotsid');

      const data = new FormData();

      // Append all form fields to the FormData instance
      data.append('learningNo', formData.learningNo);
      data.append('fname', formData.fname);

      data.append('mname', formData.mname);
      data.append('lname', formData.lname);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('category', category);
      data.append('slotsession', slotsession);
      data.append('slotdate', formattedDate);
      data.append('institution_name', formData.institution_name);
      data.append('institution_email', formData.institution_email);
      data.append('institution_phone', formData.institution_phone);
      data.append('hm_principal_manager_name', formData.hm_principal_manager_name);
      data.append('hm_principal_manager_mobile', formData.hm_principal_manager_mobile);
      data.append('coordinator_mobile', formData.coordinator_mobile);
      data.append('coordinator_name', formData.coordinator_name);
      data.append('sessionSlotId', sessionSlotId);

      // Append the Excel file if it exists
      if (formData.excel) {
        data.append('file', formData.excel);
      }

      // Append the vehicle types as a comma-separated string
      // data.append('vehicletype', formData.vehicletype.join(','));

      // Make the axios request to the combined endpoint
      const response = await instance.post('bookingform/create-uploadOrAddBookingForm', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Show success message
      alert('Booking successfully created!');

      // Resetting the form
      setFormData({
        learningNo: '',
        fname: '',
        mname: '',
        lname: '',
        email: '',
        phone: '',
        excel: '',
        // vehicletype: [],
      });
      setErrors({}); // Clear errors
      navigate('/groupbooking')
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error
      if (error.response) {
        alert(`Error: ${error.response.data.message || 'Something went wrong!'}`);
      } else {
        alert('Error: No response from server.');
      }
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };


  useEffect(() => {
    if (location && location.state) {
      console.log("location state : ", location.state);
      const selectedSession = location.state.selectedTime.split('-')[1];
      setSlotSession(selectedSession)
      setSlotDate(location.state.selectedDate)
      // console.log("location.selectedTime", location.state.selectedTime);
      setCategory(location.state.category || ""); // Assume category comes from the location state
      setSlotTime(`${location.state.selectedDate} ${location.state.selectedTime}`);
    }
  }, [location])






  return (
    <>





      <Container className='bookingdetails mt-5 pt-4 pb-3 '>
        <div className='form-group mb-4'>
          <p className='detailtext text-black text-start ms-lg-4 mb-4'>{slotdate}</p>
          <form onSubmit={handleSubmit}>
            <Row className='justify-content-center'>
              <Col lg={6} md={7} sm={12}>
                <p className='bookingdate text-black text-start ms-lg-4 ms-sm-3 mt-3'>
                  {category === "RTO – Suspended Driving License Holders Training" ? "Permanant License Number*" : "Learning License Number*"}
                </p>
                {category === "RTO – Suspended Driving License Holders Training" ?
                  <InputMask
                    mask="**/**/**/****"
                    value={formData.learningNo || ""} // Ensure controlled value
                    onChange={(e) => {
                      // Get the input value and convert it to uppercase
                      const inputValue = e.target.value.toUpperCase();

                      // Update state in real-time
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        learningNo: inputValue,
                      }));
                    }}
                    placeholder="____/_______/____"
                    className="dateinput p-3 m-0 mt-0 ms-lg-3 custom-placeholder"
                  >
                    {(inputProps) => <input {...inputProps} />}
                  </InputMask>
                  :
                  <InputMask
                    mask="****/*******/****"
                    value={formData.learningNo || ""} // Ensure controlled value
                    onChange={(e) => {
                      // Get the input value and convert it to uppercase
                      const inputValue = e.target.value.toUpperCase();

                      // Update state in real-time
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        learningNo: inputValue,
                      }));
                    }}
                    placeholder="____/_______/____"
                    className="dateinput p-3 m-0 mt-0 ms-lg-3 custom-placeholder"
                  >
                    {(inputProps) => <input {...inputProps} />}
                  </InputMask>
                }

                {errors.learningNo && (
                  <p className='text-start ms-md-4 mt-1 text-danger'>{errors.learningNo}</p>
                )}
              </Col>
              <Col lg={6} md={7}>
                <p className='bookingdate text-black text-start ms-lg-4 ms-sm-3 mt-3'>{"First Name*"}</p>
                <input
                  name='fname'
                  value={formData.fname}
                  onChange={handleChange}
                  placeholder={"First Name"}
                  className='dateinput p-3 m-0 mt-0 ms-lg-3'
                />
                {errors.fname && <p className='text-start ms-md-4 mt-1 text-danger'>{errors.fname}</p>}
              </Col>
              <Col lg={6} md={7}>
                <p className='bookingdate text-black text-start ms-lg-4 ms-sm-3 mt-3'>{"Middle Name"}</p>
                <input
                  name='mname'
                  value={formData.mname}
                  onChange={handleChange}
                  placeholder={"Middle Name"}
                  className='dateinput p-3 m-0 mt-0 ms-lg-3'
                />
                {errors.mname && <p className='text-start ms-md-4 mt-1 text-danger'>{errors.mname}</p>}
              </Col>
              <Col lg={6} md={7}>
                <p className='bookingdate text-black text-start ms-lg-4 ms-sm-3 mt-3'>{"Last Name*"}</p>
                <input
                  name='lname'
                  value={formData.lname}
                  onChange={handleChange}
                  placeholder={"Last Name"}
                  className='dateinput p-3 m-0 mt-0 ms-lg-3'
                />
                {errors.lname && <p className='text-start ms-md-4 mt-1 text-danger'>{errors.lname}</p>}
              </Col>
              <Col lg={6} md={7}>
                <p className='bookingdate text-black text-start ms-lg-4 ms-sm-3 mt-3'>{"Email*"}</p>
                <input
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={"email"}
                  className='dateinput p-3 m-0 mt-0 ms-lg-3'
                />
                {errors.email && <p className='text-start ms-md-4 mt-1 text-danger'>{errors.email}</p>}
              </Col>
              <Col lg={6} md={7}>
                <p className='bookingdate text-black text-start ms-lg-4 ms-sm-3 mt-3'>{"Phone*"}</p>
                <input
                  name='phone'
                  maxLength="10"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={"phone"}
                  className='dateinput p-3 m-0 mt-0 ms-lg-3 ms-md-0'
                />
                {errors.phone && <p className='text-start ms-md-4 mt-1 text-danger'>{errors.phone}</p>}
              </Col>


              <div className='text-center mt-4'>
                <button type="submit " className='returnbutton' disabled={isSubmitting} onClick={() => setShowModal(true)}>
                  {isSubmitting ? (
                    <span>
                      <span className="spinner-border returnbutton spinner-border-sm me-2"></span>
                      Submitting...
                    </span>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </Row>
          </form>
        </div>





      </Container>



    </>
  );
}

export default Bookingpage2;