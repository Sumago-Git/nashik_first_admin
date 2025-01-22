

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

const ByYearWiseCount = () => {
  // State for filters
  const [date, setDate] = useState(null);
  const [yearFilter, setYearFilter] = useState(null);
  const [monthFilter, setMonthFilter] = useState(null);
  const [weekFilter, setWeekFilter] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [institude, setInstitude] = useState([]);
  const [selectInstitude, setselectInstitude] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Data state
  const [trainingTypeData, setTrainingTypeData] = useState([]);
  const [totalSessionsConducted, setTotalSessionsConducted] = useState({});

  // Format date to DD-MM-YYYY
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

  // Fetch training type data
  const fetchTrainingTypeData = async () => {
    const apiUrl = 'http://localhost:8000/report/yearWiseFinalSessionCount';
    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('No access token found. Please log in again.');
        return;
      }
      // Ensure "To Date" is mandatory if "From Date" is selected
      if (fromDate && !toDate) {
        alert("'To Date' is required when 'From Date' is selected.");
        return; // Stop execution if "To Date" is not provided
      }
     
      const response = await axios.post(
        apiUrl,
        {
          financialYear: yearFilter?.value || '',
          month: monthFilter?.value || '',
          week: weekFilter?.value || '',
          date: date ? formatDate(date) : '',
          schoolName: selectInstitude,
          trainingType: selectedCategory,
          page: currentPage,
          pageSize: pageSize,
          fromDate: formatDate(fromDate),
          toDate: formatDate(toDate),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if response has data and data array is not empty
      if (response?.data) {
        setTrainingTypeData(response.data.data);
        setTotalSessionsConducted(response.data.totalSessionConducted || 0);

        // Update pagination states
        if (response.data.pagination) {
          setCurrentPage(response.data.pagination.currentPage);
          setTotalPages(response.data.pagination.totalPages);
          setTotalRecords(response.data.pagination.totalRecords);
        }

        console.log('Fetched training type data:', response.data.data);
      } else {
        setTrainingTypeData([]);
        setTotalSessionsConducted(0);
        console.warn('No training type data available for the selected filters');
      }
    } catch (error) {
      console.error('Error fetching training type data:', error);
      setTrainingTypeData([]);
      setTotalSessionsConducted(0);
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

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  // Reset filters
  const resetFilters = () => {
    setYearFilter(null);
    setMonthFilter(null);
    setWeekFilter(null);
    setSelectedCategory("");
    setselectInstitude("");
    setDate(null);
    setCurrentPage(1);
    setPageSize(10);
    fetchTrainingTypeData();
    setToDate(null);
    setFromDate(null);
  };

  // Fetch data on component mount and when filters change
  // useEffect(() => {
  //   fetchTrainingTypeData();
  // }, [currentPage, pageSize, yearFilter, monthFilter, weekFilter, 
  //     selectedCategory, selectInstitude, date]);

  // Initial data fetch
  useEffect(() => {
    fetchInstitutionList();
    fetchTrainingTypeData();
  }, [currentPage, pageSize]);

  return (
    <div className="p-4 bg-light">


      <h2 className="text-primary mb-4">Year Wise Report</h2>

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
            <Dropdown.Item onClick={() => setSelectedCategory(null)}>
              Clear
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
            <Dropdown.Item onClick={() => setselectInstitude(null)}>
              Clear
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

       {/* Date Range Selection */}

       <div className="position-relative">
       <Button
         variant="primary"
         onClick={() => setShowFromCalendar(!showFromCalendar)}
         className="text-white"
       >
         {fromDate ? `From: ${formatDate(fromDate)}` : "Select From Date"}
       </Button>
       {showFromCalendar && (
         <div
           className="position-absolute mt-2 z-3 bg-white shadow p-3"
           style={{ zIndex: 1000, right: 0, top: "100%" }}
         >
           <Calendar
             value={fromDate}
             onChange={(selectedDate) => {
              setShowFromCalendar(false);
               setFromDate(selectedDate);
               setYearFilter(null);
               setMonthFilter(null);
               setWeekFilter(null);
               setDayFilter(null);
               
               if (toDate && selectedDate > toDate) {
                 setToDate(null);
               }
             }}
             maxDate={toDate || new Date()}
           />
           <div className="mt-2 text-center">
             <Button
               variant="secondary"
               onClick={() => {
                 setFromDate(null);
                 setToDate(null); // Clear "To Date" when "From Date" is cleared
                 setShowFromCalendar(false);
               }}
             >
               Clear
             </Button>
           </div>
         </div>
       )}
     </div>
   
     {/* To Date */}
     <div className="position-relative">
       <Button
         variant="primary"
         onClick={() => {
           if (!fromDate) {
             alert("'From Date' must be selected before selecting 'To Date'.");
           } else {
             setShowToCalendar(!showToCalendar);
           }
         }}
         className="text-white"
         disabled={!fromDate}
       >
         {toDate ? `To: ${formatDate(toDate)}` : "Select To Date"}
       </Button>
       {showToCalendar && fromDate && (
         <div
           className="position-absolute mt-2 z-3 bg-white shadow p-3"
           style={{ zIndex: 1000, right: 0, top: "100%" }}
         >
           <Calendar
             value={toDate}
             onChange={(selectedDate) => {
               setToDate(selectedDate);
               setShowToCalendar(false);
             }}
             minDate={fromDate}
             maxDate={new Date()}
           />
           <div className="mt-2 text-center">
             <Button
               variant="secondary"
               onClick={() => {
                 setToDate(null);
                 setShowToCalendar(false);
               }}
             >
               Clear
             </Button>
           </div>
         </div>
       )}
     </div>

      </div>
      <div className="mb-4 d-flex justify-content-end gap-3 flex-wrap align-items-center">
        {fromDate ? null : (
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
          </div>
        )}

        {/* Action Buttons */}
        <Button variant="primary" onClick={fetchTrainingTypeData}>
          Search
        </Button>
        <Button variant="danger" onClick={resetFilters}>
          Clear
        </Button>
        <Button variant="success" onClick={() => {
          // Excel export logic can be added here
          const worksheetData = trainingTypeData.flatMap(instituteItem =>
            instituteItem.years.flatMap(yearItem =>
              yearItem.months.flatMap(monthItem =>
                monthItem.weeks.flatMap(weekItem =>
                  weekItem.categories.map(categoryItem => ({
                    InstituteName: instituteItem.instituteName,
                    Year: yearItem.year,
                    Month: monthItem.monthName,
                    Week: weekItem.week,
                    Category: categoryItem.category,
                    SessionCount: categoryItem.sessionCount,
                    TotalSessions: categoryItem.totalSessions
                  }))
                )
              )
            )
          );

          const worksheet = XLSX.utils.json_to_sheet(worksheetData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Training Type Report");
          XLSX.writeFile(workbook, "training_type_report.xlsx");
        }}>
          Download Excel
        </Button>
      </div>

      {/* Overall Statistics */}
      <div className="mb-4">
        <h4 className="text-secondary mb-3">Overall Statistics</h4>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h5 className="card-title text-primary">Total Sessions Conducted</h5>
                <p className="card-text fs-4 fw-bold">
                  {totalSessionsConducted.totalNoSessions}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h5 className="card-title text-primary">Total Students</h5>
                <p className="card-text fs-4 fw-bold">
                  {totalSessionsConducted.totalNoOfStudent}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Training Type Data Table */}
      <DataTable
        title="Training Type Wise Report"
        columns={[
          {
            name: 'Institute Name',
            selector: (row) => row.rowLabel,
            sortable: true
          },
          {
            name: 'Session Count',
            selector: (row) => row.sessionCount,
            sortable: true
          },
          {
            name: 'Total Sessions',
            selector: (row) => row.totalNoOfStudent,
            sortable: true
          }
        ]}
        data={trainingTypeData}
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
        expandableRowsComponent={({ data: instituteItem }) => (
          <DataTable
            title={`Years for ${instituteItem.rowLabel}`}
            columns={[
              {
                name: 'Year',
                selector: (row) => row.year,
                sortable: true
              },
              {
                name: 'Session Count',
                selector: (row) => row.totalNoOfStudent,
                sortable: true
              },
              {
                name: 'Total Sessions',
                selector: (row) => row.totalNoSessions,
                sortable: true
              }
            ]}
            data={instituteItem.years}
            expandableRows
            expandableRowsComponent={({ data: yearItem }) => (
              <DataTable
                title={`Months for ${yearItem.year}`}
                columns={[
                  {
                    name: 'Month',
                    selector: (row) => row.month,
                    sortable: true
                  },
                  {
                    name: 'Session Count',
                    selector: (row) => row.totalNoOfStudent,
                    sortable: true
                  },
                  {
                    name: 'Total Sessions',
                    selector: (row) => row.totalNoSessions,
                    sortable: true
                  }
                ]}
                data={yearItem.months}
                expandableRows
                expandableRowsComponent={({ data: monthItem }) => (
                  <DataTable
                    title={`Weeks for ${monthItem.month}`}
                    columns={[
                      {
                        name: 'Week',
                        selector: (row) => row.week,
                        sortable: true
                      },
                      {
                        name: 'Session Count',
                        selector: (row) => row.totalNoOfStudent,
                        sortable: true
                      },
                      {
                        name: 'Total Sessions',
                        selector: (row) => row.totalNoSessions,
                        sortable: true
                      }
                    ]}
                    data={monthItem.weeks}
                    pagination={false}
                    customStyles={{
                      header: {
                        style: { backgroundColor: "#f8d7da", color: "#721c24" },
                      },
                      rows: { style: { fontSize: "14px", color: "#721c24" } },
                    }}
                  />
                )}
                pagination={false}
                customStyles={{
                  header: {
                    style: { backgroundColor: "#d1ecf1", color: "#0c5460" },
                  },
                  rows: { style: { fontSize: "14px", color: "#0c5460" } },
                }}
              />
            )}
            pagination={false}
            customStyles={{
              header: {
                style: { backgroundColor: "#d4edda", color: "#155724" },
              },
              rows: { style: { fontSize: "14px", color: "#155724" } },
            }}
          />
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

export default ByYearWiseCount;