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

const ByTrainerWise = () => {
  // State for filters
  const [date, setDate] = useState(null);
  const [yearFilter, setYearFilter] = useState(null);
  const [monthFilter, setMonthFilter] = useState(null);
  const [weekFilter, setWeekFilter] = useState(null);
  const [dayFilter, setDayFilter] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [totaltrainingwisecount, setTotaltrainingwisecount] = useState({
    totalSessions: 0,
    totalAttendees: 0
  });
  const [trainerData, setTrainerData] = useState([]);
  const [institude, setInstitude] = useState([]);
  const [selectInstitude, setselectInstitude] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRTO, setSelectedRTO] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(""); // Trainer filter state
  const [getadmin_data, setadmin_data] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const getdata_admin = () => {
    instance.get('trainer/get-trainers')
      .then((res) => {
        setadmin_data(res.data.responseData || []);
        console.log("res.data.responseData", res.data.responseData);

      })
      .catch((err) => console.log(err));
  };
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
  const dayOptions = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  ].map((day, index) => ({
    value: String(index + 1).padStart(2, '0'), // Ensures two-digit values (01, 02, etc.)
    label: day, // Sets the label to the proper weekday name
  }));


  // Fetch trainer-wise session data
  const fetchTrainerData = async () => {
    const apiUrl = 'http://localhost:8000/report/trainerWiseSessionsConducted';
    setLoading(true);
    setTrainerData([]);
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
          rtoSubCategory: selectedSubCategory
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if response has data and data array is not empty
      if (response?.data) {
        setTrainerData(response.data.data);
        console.log('Fetched trainer datad:', response.data.data);
      } else {
        setTrainerData([]);
        console.warn('No trainer data available for the selected filters');
      }
    } catch (error) {
      console.error('Error fetching trainer data:', error);
      setTrainerData([]);
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
    setSelectedSlot("");
    setSelectedRTO(false);
    setselectInstitude("");
    setSelectedTrainer("");
    setSelectedSubCategory("");
    setDate(null);
    fetchTrainerData();


  };

  // Fetch data on component mount
  useEffect(() => {
    fetchTrainerData();
    fetchInstitutionList();
    getdata_admin()
  }, []);

  // Columns for trainer data table
  const trainerColumns = [
    {
      name: 'Trainer Name',
      selector: (row) => row.trainerName,
      sortable: true,
    },
    {
      name: 'Total Sessions',
      selector: (row) => row.sessionCount,
      sortable: true,
    }
  ];

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

      <h2 className="text-primary mb-4">Trainer-wise Sessions</h2>

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
           <Dropdown.Toggle variant="primary" id="category-dropdown" className="text-white">
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
          <Dropdown.Toggle variant="primary" id="category-dropdown" className="text-white">
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
  <Dropdown.Toggle variant="primary" id="category-dropdown" className="text-white">
    {selectedSubCategory || "Select  Sub Category"}
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

        <Dropdown>
          <Dropdown.Toggle variant="primary" id="trainer-dropdown" className="text-white">
            {selectedTrainer || "Select Trainer"}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {
              getadmin_data.map((item, id) => {
                return (
                  <Dropdown.Item onClick={() => setSelectedTrainer(item.name)}>
                    {item.name}
                  </Dropdown.Item>
                )
              })
            }
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
            {/* day Filter */}
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
        }

        {/* Action Buttons */}
        <Button variant="primary" onClick={fetchTrainerData}>
          Search
        </Button>
        <Button variant="danger" onClick={() => resetFilters()}>
          Clear
        </Button>
        <Button variant="success" onClick={() => {
          // Flatten the data for Excel export
          const worksheetData = trainerData.flatMap(trainer =>
            trainer.years.flatMap(year =>
              year.months.flatMap(month =>
                month.weeks.map(week => ({
                  TrainerName: trainer.trainerName,
                  TotalSessionCount: trainer.sessionCount,
                  Year: year.year,
                  YearSessionCount: year.sessionCount,
                  Month: month.monthName,
                  MonthSessionCount: month.sessionCount,
                  Week: week.week,
                  WeekSessionCount: week.sessionCount,
                  CategoryName: week.categoryName,
                  ShortName: week.shortName
                }))
              )
            )
          );

          const worksheet = XLSX.utils.json_to_sheet(worksheetData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Trainer Sessions");
          XLSX.writeFile(workbook, "trainer_sessions.xlsx");
        }}>
          Download Excel
        </Button>
      </div>

      {/* Trainer Data Table */}
      <DataTable
        title="Trainer Sessions"
        columns={trainerColumns}
        data={trainerData}
        expandableRows
        expandableRowsComponent={({ data: trainerItem }) => (
          <DataTable
            title={`Years for ${trainerItem.trainerName}`}
            columns={[
              {
                name: 'Year',
                selector: (row) => row.year,
                sortable: true
              },
              {
                name: 'Session Count',
                selector: (row) => row.sessionCount,
                sortable: true
              }
            ]}
            data={trainerItem.years}
            expandableRows
            expandableRowsComponent={({ data: yearItem }) => (
              <DataTable
                title={`Months for ${yearItem.year}`}
                columns={[
                  {
                    name: 'Month',
                    selector: (row) => row.monthName,
                    sortable: true
                  },
                  {
                    name: 'Session Count',
                    selector: (row) => row.sessionCount,
                    sortable: true
                  }
                ]}
                data={yearItem.months}
                expandableRows
                expandableRowsComponent={({ data: monthItem }) => (
                  <DataTable
                    title={`Weeks for ${monthItem.monthName}`}
                    columns={[
                      {
                        name: 'Week',
                        selector: (row) => row.week,
                        sortable: true
                      },
                      {
                        name: 'Session Count',
                        selector: (row) => row.sessionCount,
                        sortable: true
                      },
                      {
                        name: 'Category',
                        selector: (row) => row.categoryName,
                        sortable: true
                      }
                    ]}
                    data={monthItem.weeks}
                    pagination={false}
                  />
                )}
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

export default ByTrainerWise;