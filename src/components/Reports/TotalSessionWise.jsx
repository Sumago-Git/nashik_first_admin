

import React, { useState, useEffect } from "react";
import { Button, Dropdown } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Select from "react-select";
import * as XLSX from "xlsx";
import axios from "axios";
import { ThreeDots } from 'react-loader-spinner';
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import instance from "../../api/AxiosInstance";

const TotalSessionWise = () => {
  // State for filters
  const [date, setDate] = useState(null);
  const [yearFilter, setYearFilter] = useState(null);
  const [monthFilter, setMonthFilter] = useState(null);
  const [weekFilter, setWeekFilter] = useState(null);
  const [dayFilter, setDayFilter] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [totalSessionData, setTotalSessionData] = useState([]);
  const [institude, setInstitude] = useState([]);
  const [selectInstitude, setselectInstitude] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedRTO, setSelectedRTO] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [getadmin_data, setadmin_data] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Fetch admin/trainer data
  const getdata_admin = () => {
    instance.get('trainer/get-trainers')
      .then((res) => {
        setadmin_data(res.data.responseData || []);
      })
      .catch((err) => console.log(err));
  };

  // Format date to YYYY-MM-DD
  const formatDate = (dateObj) => {
    if (!dateObj) return '';
    const d = new Date(dateObj);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // Generate years for year dropdown
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 2016;
    return Array.from(
      { length: currentYear - startYear + 1 },
      (_, index) => ({
        value: (currentYear - index).toString(),
        label: (currentYear - index).toString()
      })
    );
  };

  // Generate months for month dropdown
  const monthOptions = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  // Generate weeks for week dropdown
  const weekOptions = Array.from(
    { length: 52 },
    (_, index) => ({
      value: (index + 1).toString().padStart(2, '0'),
      label: `Week ${index + 1}`
    })
  );

  // Generate days for day dropdown
  const dayOptions = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  ].map((day, index) => ({
    value: String(index + 1).padStart(2, '0'),
    label: day,
  }));

  // Fetch total sessions data
  const fetchTotalSessionData = async () => {
    const apiUrl = 'http://localhost:8000/report/totalSessionsConducted';
    setLoading(true);
    setTotalSessionData([]);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('No access token found. Please log in again.');
        return;
      }

      const response = await axios.post(
        apiUrl,
        {
          financialYear: yearFilter?.value || '',
          month: monthFilter?.value || '',
          week: weekFilter?.value || '',
          date: date ? formatDate(date) : '',
          institutionName: selectInstitude,
          trainingType: selectedCategory,
          trainer: selectedTrainer,
          day: dayFilter?.value,
          rtoFilter: selectedRTO,
          slotType: selectedSlot,
          rtoSubCategory: selectedSubCategory,
          page: currentPage,
          pageSize: pageSize
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if response has data and data array is not empty
      if (response?.data) {
        setTotalSessionData(response.data.data);
        
        // Update pagination states
        if (response.data.pagination) {
          setCurrentPage(response.data.pagination.currentPage);
          setTotalPages(response.data.pagination.totalPages);
          setTotalRecords(response.data.pagination.totalRecords);
        }
        
        console.log('Fetched total session data:', response.data.data);
      } else {
        setTotalSessionData([]);
        console.warn('No session data available for the selected filters');
      }
    } catch (error) {
      console.error('Error fetching session data:', error);
      setTotalSessionData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch institution list
  const fetchInstitutionList = async () => {
    const apiUrl = 'http://localhost:8000/report/getInstitudeNCategoryList';

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('No access token found. Please log in again.');
        return;
      }

      const response = await axios.post(
        apiUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data) {
        setInstitude(response.data.data);
        console.log('Fetched institutions:', response.data.data);
      } else {
        throw new Error('Invalid response structure.');
      }
    } catch (error) {
      console.error('Error fetching institutions:', error);
      alert('There was an issue fetching the institutions. Please try again.');
    }
  };

  // Reset filters
  const resetFilters = () => {
    setYearFilter(null);
    setMonthFilter(null);
    setWeekFilter(null);
    setDayFilter(null);
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedSlot("");
    setSelectedRTO(false);
    setselectInstitude("");
    setSelectedTrainer("");
    setDate(null);
    setCurrentPage(1);
    setPageSize(10);
    fetchTotalSessionData();
  };

  // Fetch data on component mount and when filters change
  // useEffect(() => {
  //   fetchTotalSessionData();
  // }, [currentPage, pageSize, yearFilter, monthFilter, weekFilter, 
  //     dayFilter, selectedCategory, selectedSubCategory, 
  //     selectedSlot, selectedRTO, selectInstitude, selectedTrainer, date]);

  // Initial data fetch
  useEffect(() => {
    fetchInstitutionList();
    getdata_admin();
    fetchTotalSessionData();
  }, [currentPage, pageSize]);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Rest of the component remains exactly the same as in the previous implementation
  // ... (all previous code for columns, render method, etc. remains unchanged)
  const sessionColumns = [
    {
      name: 'Date',
      selector: (row) => {
        const date = new Date(row.tempDate);
        return date.toLocaleDateString();
      },
      sortable: true,
    },
    {
      name: 'Time',
      selector: (row) => row.slotTimeInfo,
      sortable: true,
    },
    {
      name: 'No of Students ',
      selector: (row) => row.sessionCount,
      sortable: true,
    },
    {
      name: 'School/Institution',
      selector: (row) => row.institution_name || 'N/A',
      sortable: true,
    },
    {
      name: 'Principal/Manager',
      selector: (row) => row.hm_principal_manager_name || 'N/A',
      sortable: true,
    },
    {
      name: 'Coordinator Name',
      selector: (row) => row.coordinator_name || 'N/A',
      sortable: true,
    },
    {
      name: 'Coordinator Mobile',
      selector: (row) => row.coordinator_mobile || 'N/A',
      sortable: true,
    },
    {
      name: 'Trainer',
      selector: (row) => row.trainer,
      sortable: true,
    },
    {
      name: 'Training Type',
      selector: (row) => row.trainingType,
      sortable: true,
    },
    {
      name: 'Location',
      selector: (row) => row.slotType,
      sortable: true,
    },
    {
      name: 'Financial Year',
      selector: (row) => row.financialYear || 'N/A',
      sortable: true,
    },
    {
      name: 'RTO Sub-Category',
      selector: (row) => row.rtoSubcategory || 'N/A',
      sortable: true,
    },
 
  ];
  return (
    <div className="p-4 bg-light">
    
    <h2 className="text-primary mb-4">Total Sessions</h2>

    {/* Filters Container */}
    <div className="mb-4 d-flex justify-content-end gap-3 flex-wrap align-items-center">
      {/* Category Dropdown */}
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="category-dropdown" className="text-white">
          {selectedCategory || "Select Category"}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setSelectedCategory("School")}>
            School
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSelectedCategory("Adult")}>
            Adult
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Slot Type Dropdown */}
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="slot-dropdown" className="text-white">
          {selectedSlot ? (selectedSlot === "inhouse" ? "In House" : "On Site") : "Select Slot"}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setSelectedSlot("onsite")}>
            On Site
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSelectedSlot("inhouse")}>
            In House
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* RTO Dropdown */}
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="rto-dropdown" className="text-white">
          {selectedRTO ? "RTO" : "Filter by RTO"}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setSelectedRTO(true)}>
            RTO
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/*  Sub Category Dropdown */}
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="subcategory-dropdown" className="text-white">
          {selectedSubCategory || "Select Sub Category"}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setSelectedSubCategory("RTO – Learner Driving License Holder Training")}>
            RTO – Learner Driving License Holder Training
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSelectedSubCategory("RTO – Suspended Driving License Holders Training")}>
          RTO – Suspended Driving License Holders Training
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSelectedSubCategory("RTO – Training for School Bus Driver")}>
          RTO – Training for School Bus Driver
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Institution Dropdown */}
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="institution-dropdown" className="text-white">
          {selectInstitude || "Select Institution"}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {institude.length > 0 ? (
            institude.map((category, index) => (
              <Dropdown.Item
                key={index}
                onClick={() => setselectInstitude(category.institution_name)}
              >
                {category.institution_name}
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item disabled>No Institutions Available</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>

      {/* Trainer Dropdown */}
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="trainer-dropdown" className="text-white">
          {selectedTrainer || "Select Trainer"}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {getadmin_data.map((item, id) => (
            <Dropdown.Item key={id} onClick={() => setSelectedTrainer(item.name)}>
              {item.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {/* Date Selection */}
      <div className="position-relative">
        <Button
          variant="primary"
          onClick={() => setShowCalendar(!showCalendar)}
          className="text-white"
        >
          {date ? formatDate(date) : "Select Date"}
        </Button>

        {showCalendar && (
          <div
            className="position-absolute mt-2 z-3 bg-white shadow"
            style={{
              zIndex: 1000,
              right: 0,
              top: '100%'
            }}
          >
            <Calendar
              value={date}
              onChange={(selectedDate) => {
                setDate(selectedDate);
                setShowCalendar(false);
                setYearFilter(null);
                setMonthFilter(null);
                setWeekFilter(null);
                setDayFilter(null);
              }}
              maxDate={new Date()}
            />
          </div>
        )}
      </div>
    </div>

    <div className="mb-4 d-flex justify-content-end gap-3 flex-wrap align-items-center">
      {date ? null : (
        <div className="d-flex gap-3">
          {/* Year Filter */}
          <div style={{ minWidth: "200px" }}>
            <Select
              options={generateYears()}
              value={yearFilter}
              onChange={setYearFilter}
              placeholder="Select Year"
              isClearable
            />
          </div>

          {/* Month Filter */}
          <div style={{ minWidth: "200px" }}>
            <Select
              options={monthOptions}
              value={monthFilter}
              onChange={setMonthFilter}
              placeholder="Select Month"
              isClearable
            />
          </div>

         

          {/* Week Filter */}
          <div style={{ minWidth: "200px" }}>
            <Select
              options={weekOptions}
              value={weekFilter}
              onChange={setWeekFilter}
              placeholder="Select Week"
              isClearable
            />
          </div>
           {/* Day Filter */}
           <div style={{ minWidth: "200px" }}>
           <Select
             options={dayOptions}
             value={dayFilter}
             onChange={setDayFilter}
             placeholder="Select Day"
             isClearable
           />
         </div>
        </div>
      )}

      {/* Action Buttons */}
      <Button variant="primary" onClick={fetchTotalSessionData}>
        Search
      </Button>
      <Button variant="danger" onClick={resetFilters}>
        Clear
      </Button>
      <Button variant="success" onClick={() => {
        // Flatten the data for Excel export
        const worksheetData = totalSessionData.map(session => ({
          Date: new Date(session.tempDate).toLocaleDateString(),
          Time: session.slotTimeInfo,
          'School/Institution': session.institution_name || 'N/A',
          'Principal/Manager': session.hm_principal_manager_name || 'N/A',
          'Coordinator Name': session.coordinator_name || 'N/A',
          'Coordinator Mobile': session.coordinator_mobile || 'N/A',
          Trainer: session.trainer,
          'Training Type': session.trainingType,
          Location: session.slotType,
          'RTO Sub-Category': session.rtoSubcategory || 'N/A'
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Total Sessions");
        XLSX.writeFile(workbook, "total_sessions.xlsx");
      }}>
        Download Excel
      </Button>
    </div>
      {/* Total Sessions Data Table */}
      <DataTable
      title="Total Sessions"
      columns={sessionColumns}
      data={totalSessionData}
      pagination
      paginationServer
      paginationTotalRows={totalRecords}
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handlePageSizeChange}
      paginationPerPage={pageSize}
      paginationRowsPerPageOptions={[10, 30, 50, 100, 200]}
      paginationComponent={() => (
        <div className="d-flex justify-content-between align-items-center p-2 w-100">
          <div className="d-flex align-items-center">
            <span className="mr-2">Show</span>
            <select 
              value={pageSize} 
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="form-control form-control-sm"
              style={{ width: '80px' }}
            >
              {[10, 30, 50, 100, 200].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="ml-2">entries</span>
          </div>
          <div className="d-flex align-items-center">
            <span className="mr-3">
              Showing {((currentPage - 1) * pageSize) + 1} to{' '}
              {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} entries
            </span>
            <div>
              <Button 
                variant="outline-primary" 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="mr-2"
              >
                Previous
              </Button>
              <Button 
                variant="outline-primary" 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
        expandableRows
        expandableRowsComponent={({ data: sessionItem }) => (
          <div className="p-3 bg-light">
          <h5>Additional Session Details</h5>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Full Name</th>
                <td>{`${sessionItem.fname} ${sessionItem.mname || ''} ${sessionItem.lname || ''}`.trim()}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{sessionItem.email}</td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>{sessionItem.phone}</td>
              </tr>
              <tr>
                <th>Vehicle Type</th>
                <td>{sessionItem.vehicletype || 'N/A'}</td>
              </tr>
              <tr>
                <th>Submission Date</th>
                <td>{new Date(sessionItem.submission_date).toLocaleString()}</td>
              </tr>
              <tr>
                <th>Training Status</th>
                <td>{sessionItem.training_status}</td>
              </tr>
              <tr>
                <th>Certificate Number</th>
                <td>{sessionItem.certificate_no || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        )}
        customStyles={{
          header: { style: { backgroundColor: "#007bff", color: "white" } },
          rows: { style: { fontSize: "14px" } },
        }}
      />
      {loading && (
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
      )}
  
    </div>
  );
}

export default TotalSessionWise;