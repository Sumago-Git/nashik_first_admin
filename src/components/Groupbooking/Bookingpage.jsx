import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import {Link} from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import * as XLSX from 'xlsx';

import instance from '../../api/AxiosInstance';

const Bookingpage = () => {
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
      const sessionSlotId = localStorage.getItem('slotsids');

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

      data.append('sessionSlotId', sessionSlotId);


      if (formData.excel) {
        data.append('file', formData.excel);
      }

      const response = await instance.post('bookingform/create-uploadOrAddBookingForm', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Booking successfully created!');
      const records = response.data.data;
      for (const record of records) {
        try {
          const updateResponse = await instance.put('bookingform/updateTrainingStatus', {
            trainingStatus: 'Attended',
            bookingId: record.id,
            certificate_no: Math.floor(100000 + Math.random() * 900000), // Generate a random 6-digit certificate number
          });

          console.log(`Record ${record.id} updated successfully:`, updateResponse.data);
        } catch (updateError) {
          console.error(`Error updating record ${record.id}:`, updateError);
        }
      }

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
        <h1 className='bookingheadline mt-3 mx-auto'>Please fill in your details</h1>
        <form onSubmit={handleSubmit}>
          <Row className=''>

            <Col lg={7} className='mb-3'>
              <Form.Group controlId="uploadExcel">

                <Form.Control
                  type="file"
                  name='excel'
                  accept=".xls,.xlsx"
                  onChange={handleChange}
                />
                {errors.excel && <p className='text-start ms-md-1 mt-1 text-danger'>{errors.excel}</p>}
              </Form.Group>
            </Col>



            <div className='text-center'>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Submitting...
                  </span>
                ) : (
                  "Submit"
                )}
              </Button>                </div>
          </Row>
        </form>



        <Col lg={12} className='mt-md-5 pt-lg-3 pb-5 mb-lg-2 mt-4'>
          <Link to='/groupbooking'><button className='returnbutton p-lg-3'>
            Return
          </button></Link>
        </Col>

      </Container>



    </>
  );
}

export default Bookingpage;
