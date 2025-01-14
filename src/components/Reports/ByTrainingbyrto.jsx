import React, { useState, useEffect } from "react";
import { Dropdown, Container, Row, Col, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Select from "react-select";
import * as XLSX from "xlsx";
import instance from "../../api/AxiosInstance";
import axios from "axios";
import { ThreeDots } from 'react-loader-spinner';

const ByTrainingbyrto = () => {
  // Hardcoded data from the provided array



  const [yearFilter, setYearFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [weekFilter, setWeekFilter] = useState('');
  const [totaltrainingwisecount, setTotaltrainingwisecount] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReportData();
    generateYears()
  
    return () => {
      // Cleanup logic if needed (currently empty)
    };
  }, []);
  const generateYears = () => {
    const currentYear = new Date().getFullYear(); // Get the current year
    const startYear = 2016; // Starting year
    const years = [];

    for (let year = currentYear; year >= startYear; year--) {
      years.push(year.toString()); // Add year as a string
    }

    return years;
  };
  // Get unique years, months, and weeks
  const uniqueYears = generateYears();;
  // const uniqueYears = filteredData.map(item => item.year.toString());
  const uniqueMonths = [
    { id: "01", name: "January" },
    { id: "02", name: "February" },
    { id: "03", name: "March" },
    { id: "04", name: "April" },
    { id: "05", name: "May" },
    { id: "06", name: "June" },
    { id: "07", name: "July" },
    { id: "08", name: "August" },
    { id: "09", name: "September" },
    { id: "10", name: "October" },
    { id: "11", name: "November" },
    { id: "12", name: "December" }
  ]
    ; // Based on the current data
  const uniqueWeeks = [
    "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
    "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
    "31", "32", "33", "34", "35", "36", "37", "38", "39", "40",
    "41", "42", "43", "44", "45", "46", "47", "48", "49", "50",
    "51", "52"
  ]
    ; // Based on the current data

  // Convert to options for react-select
  const yearOptions = uniqueYears.map((year) => ({
    label: year,
    value: year,
  }));

  const monthOptions = uniqueMonths.map((month) => ({
    label: month.name.toString(),
    value: month.id,
  }));

  const weekOptions = uniqueWeeks.map((week) => ({
    label: week.toString(),
    value: week,
  }));

  // Columns for year data
  const yearColumns = [
    {
      name: 'Year',
      selector: (row) => row.year,
      sortable: true
    },
    {
      name: 'Training Category',
      selector: (row) => row.stats[0].TrainingCategory,
      sortable: true
    },
    {
      name: 'Total Sessions',
      selector: (row) => row.stats[0].NoOfSessions,
      sortable: true
    },
    {
      name: 'Total People Attended',
      selector: (row) => row.stats[0].TotalPeopleAttended,
      sortable: true
    }
  ];

  // Columns for month data
  const monthColumns = [
    {
      name: 'Month',
      selector: (row) => row.MonthName,
      sortable: true
    },
    {
      name: 'Training Category',
      selector: (row) => row.TrainingCategory,
      sortable: true
    },
    {
      name: 'Total Sessions',
      selector: (row) => row.NoOfSessions,
      sortable: true
    },
    {
      name: 'Total People Attended',
      selector: (row) => row.TotalPeopleAttended,
      sortable: true
    }
  ];

  // Columns for week data
  const weekColumns = [
    {
      name: 'Week',
      selector: (row) => row.WeekNumber,
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
    }
  ];

  // Handle search/filter

  const fetchReportData = async () => {
    const apiUrl = 'http://localhost:8000/report/trainingTypeWiseCountRTO'; // API endpoint
    setLoading(true);
    setFilteredData([])
    try {
      // Retrieve the token from AsyncStorage
      const token = localStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', 'No access token found. Please log in again.');
        return;
      }

      // Make the API POST request
      const response = await axios.post(
        apiUrl,
        {

          year: yearFilter,
          month: monthFilter,
          week: weekFilter,
        }, // Add payload here if required
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle the response
      if (response?.data?.data) {
        setFilteredData(response.data.data);
        setTotaltrainingwisecount(response?.data?.overallStats);
        setLoading(false);
        console.log('Fetched data:', response.data.data);
      } else {
        throw new Error('Invalid response structure.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error more specifically if needed
      Alert.alert('Error', 'There was an issue fetching the data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheetData = filteredData.flatMap(yearItem =>
      yearItem.months.flatMap(month =>
        month.weeks.map(week => ({
          Year: yearItem.year,
          Month: month.MonthName,
          Week: week.WeekNumber,
          Sessions: week.NoOfSessions,
          PeopleAttended: week.TotalPeopleAttended
        }))
      )
    );

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Training Data");
    XLSX.writeFile(workbook, "training_summary.xlsx");
  };

  return (
    <div className="p-4 bg-light">{
      loading ?  // Check loading state
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#000"
            ariaLabel="three-dots-loading"

            visible={true}
          />
        </div> : null}
      <h2 className="text-primary mb-4">Training Data Summary</h2>

      {/* Filters */}
      <div className="mb-4 d-flex justify-content-end gap-3 flex-wrap">

        {/* Year Filter */}
        <div style={{ minWidth: "200px" }}>

          <Select
            options={yearOptions}
            value={yearFilter ? { label: yearFilter, value: yearFilter } : null}
            onChange={(selectedOption) => setYearFilter(selectedOption ? selectedOption.value : null)}
            placeholder={yearFilter || "Select Year"}
          />
        </div>

        {/* Month Filter */}
        <div style={{ minWidth: "200px" }}>
          <Select
            options={monthOptions}
            value={monthFilter ?
              {
                label: uniqueMonths.find(m => m.id === monthFilter)?.name || monthFilter,
                value: monthFilter
              } : null}
            onChange={(selectedOption) => setMonthFilter(selectedOption ? selectedOption.value : null)}
            placeholder={monthFilter
              ? uniqueMonths.find(m => m.id === monthFilter)?.name || monthFilter
              : "Select Month"}
          />
        </div>

        {/* Week Filter */}
        <div style={{ minWidth: "200px" }}>
          <Select
            options={weekOptions}
            value={weekFilter ? { label: `Week ${weekFilter}`, value: weekFilter } : null}
            onChange={(selectedOption) => setWeekFilter(selectedOption ? selectedOption.value : null)}
            placeholder={weekFilter ? `Week ${weekFilter}` : "Select Week"}
          />
        </div>

        {/* Buttons */}
        <Button variant="primary" onClick={() => fetchReportData()}>
          Search
        </Button>
        <Button variant="danger" onClick={() => { fetchReportData(), setYearFilter(''), setMonthFilter(''), setWeekFilter('') }}>
          Clear
        </Button>
        <Button variant="success" onClick={exportToExcel}>
          Download Excel
        </Button>
      </div>

      {/* Overall Statistics */}
      <div className="mb-4">
        <h4 className="text-secondary mb-3">Overall Statistics</h4>
        <div className="row g-3">
          {/* Total Sessions Card */}
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

          {/* Total Attendees Card */}
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
        columns={yearColumns}
        data={filteredData}
        expandableRows
        expandableRowsComponent={({ data: yearData }) => (
          <DataTable
            title={`Months for ${yearData.year}`}
            columns={monthColumns}
            data={yearData.months}
            expandableRows
            expandableRowsComponent={({ data: monthData }) => (
              <DataTable
                title={`Weeks for ${monthData.MonthName}`}
                columns={weekColumns}
                data={monthData.weeks}
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

export default ByTrainingbyrto;