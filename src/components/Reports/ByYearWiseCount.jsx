
import React, { useState, useEffect } from "react";
import { Button, Dropdown } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Select from "react-select";
import * as XLSX from "xlsx";
import axios from "axios";
import { ThreeDots } from 'react-loader-spinner';
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const ByYearWiseCount = () => {
  // State for filters
  const [date, setDate] = useState(null); // Change to null initially
  const [yearFilter, setYearFilter] = useState(null);
  const [monthFilter, setMonthFilter] = useState(null);
  const [weekFilter, setWeekFilter] = useState(null);
  const [totaltrainingwisecount, setTotaltrainingwisecount] = useState({
    totalSessions: 0,
    totalAttendees: 0
  });
  const [filteredData, setFilteredData] = useState([]);
  const [institude, setInstitude] = useState([]);
  const [selectInstitude, setselectInstitude] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Format date to DD-MM-YYYY
  const formatDate = (dateObj) => {
    if (!dateObj) return '';
    const d = new Date(dateObj);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
    const day = String(d.getDate()).padStart(2, '0'); // Ensure two-digit day

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

  // Fetch report data
  const fetchReportData = async () => {
    const apiUrl = 'http://localhost:8000/report/trainingYearWiseCount';
    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('No access token found. Please log in again.');
        return;
      }

      const response = await axios.post(
        apiUrl,
        {
          year: yearFilter?.value || '',
          month: monthFilter?.value || '',
          week: weekFilter?.value || '',
          date: date ? formatDate(date) : '',
          institutionName: selectInstitude,
          trainingType: selectedCategory
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if response has data and data array is not empty
      if (response?.data?.data && response.data.data.length > 0) {
        setFilteredData(response.data.data);
        setTotaltrainingwisecount(response.data.overallStats || {
          totalSessions: 0,
          totalAttendees: 0
        });
        console.log('Fetched data:', response.data.data);
      } else {
        setTotaltrainingwisecount({
          totalSessions: 0,
          totalAttendees: 0
        });
        console.warn('No data available for the selected filters');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setFilteredData([]);
      setTotaltrainingwisecount({
        totalSessions: 0,
        totalAttendees: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const Totaltrainingwisecount = async () => {
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
        console.log('Fetched data:', response.data.data);
      } else {
        throw new Error('Invalid response structure.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('There was an issue fetching the data. Please try again.');
    }
  };

  // Reset filters
  const resetFilters = () => {
    setYearFilter(null);
    setMonthFilter(null);
    setWeekFilter(null);
    setSelectedCategory("");
    setselectInstitude("");
    setDate(null);
    fetchReportData();
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchReportData();
    Totaltrainingwisecount()
  }, []);

  return (
    <div className="p-4 bg-light">
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

      <h2 className="text-primary mb-4">Training Data Summary</h2>

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
                }}
                maxDate={new Date()}
              />
            </div>
          )}
        </div>
      </div>
      <div className="mb-4 d-flex justify-content-end gap-3 flex-wrap align-items-center">
        {date ? null : <div className="d-flex gap-3  ">
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
        }

          {/* Action Buttons */}
          <Button variant="primary" onClick={fetchReportData}>
            Search
          </Button>
          <Button variant="danger" onClick={resetFilters}>
            Clear
          </Button>
          <Button variant="success" onClick={() => {
            const worksheetData = filteredData.flatMap(yearItem =>
              yearItem.months.flatMap(month =>
                month.details.map(detail => ({
                  Year: yearItem.year,
                  MonthNumber: month.MonthNumber,
                  MonthName: month.MonthName,
                  TrainingType: detail.TrainingType,
                  InstitutionName: detail.InstitutionName,
                  SlotSession: detail.SlotSession,
                  NoOfSessions: detail.NoOfSessions,
                  TotalPeopleAttended: detail.TotalPeopleAttended,
                  WeekNumber: detail.WeekNumber
                }))
              )
            );

            const worksheet = XLSX.utils.json_to_sheet(worksheetData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Training Data");
            XLSX.writeFile(workbook, "training_summary.xlsx");
          }}>
            Download Excel
          </Button>
       
      </div>

      {/* Rest of the component remains the same */}
      {/* Overall Statistics and Data Table */}
      <div className="mb-4">
        <h4 className="text-secondary mb-3">Overall Statistics</h4>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h5 className="card-title text-primary">Total Sessions</h5>
                <p className="card-text fs-4 fw-bold">
                  {totaltrainingwisecount.totalSessions}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h5 className="card-title text-primary">Total Attendees</h5>
                <p className="card-text fs-4 fw-bold">
                  {totaltrainingwisecount.totalAttendees}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Years Data Table */}
      <DataTable
        title="Yearly Data"
        columns={[
          {
            name: 'Year',
            selector: (row) => row.year,
            sortable: true
          },
          {
            name: 'Total Sessions',
            selector: (row) => row.stats.totalSessions,
            sortable: true
          },
          {
            name: 'Total People Attended',
            selector: (row) => row.stats.totalAttendees,
            sortable: true
          }
        ]}
        data={filteredData}
        expandableRows
        expandableRowsComponent={({ data: yearData }) => (
          <DataTable
            title={`Months for ${yearData.year}`}
            columns={[
              {
                name: 'Month Number',
                selector: (row) => row.MonthNumber,
                sortable: true
              },
              {
                name: 'Month Name',
                selector: (row) => row.MonthName,
                sortable: true
              }
            ]}
            data={yearData.months}
            expandableRows
            expandableRowsComponent={({ data: monthData }) => (
              <DataTable
                title={`Details for ${monthData.MonthName}`}
                columns={[
                  {
                    name: 'Training Type',
                    selector: (row) => row.TrainingType,
                    sortable: true
                  },
                  {
                    name: 'Institution Name',
                    selector: (row) => row.InstitutionName,
                    sortable: true
                  },
                  {
                    name: 'Slot Session',
                    selector: (row) => row.SlotSession,
                    sortable: true
                  },
                  {
                    name: 'Sessions',
                    selector: (row) => row.NoOfSessions,
                    sortable: true
                  },
                  {
                    name: 'People Attended',
                    selector: (row) => row.TotalPeopleAttended,
                    sortable: true
                  },
                  {
                    name: 'Week Number',
                    selector: (row) => row.WeekNumber,
                    sortable: true
                  }
                ]}
                data={monthData.details}
                pagination={false}
              />
            )}
            pagination={false}
          />
        )}
        pagination
        customStyles={{
          header: { style: { backgroundColor: "#007bff", color: "white" } },
          rows: { style: { fontSize: "14px" } },
        }}
      />
    </div>
  );
}

export default ByYearWiseCount;