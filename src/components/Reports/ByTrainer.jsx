import React, { useState, useEffect } from "react";
import { Dropdown, Container, Row, Col, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Select from "react-select";
import * as XLSX from "xlsx"; // Import the xlsx library
import instance from "../../api/AxiosInstance";

// Columns for weekly data
const weekColumns = [
    { name: "Week", selector: (row) => row.week, sortable: true },
    { name: "Total Slot Count", selector: (row) => row.totalSlotCount, sortable: true },
    { name: "Total Booking Form Count", selector: (row) => row.totalBookingFormCount, sortable: true },
];

// Component for weeks (inside expandable rows for each month)
const WeekTable = ({ weeks }) => (
    <DataTable
        title="Weekly Data"
        columns={weekColumns}
        data={weeks}
        noHeader
        pagination={false}
        dense
    />
);

const ByTrainer = () => {
    const [data, setData] = useState([]); // Data state
    const [yearFilter, setYearFilter] = useState([]); // Year filter state
    const [monthFilter, setMonthFilter] = useState([]); // Month filter state
    const [weekFilter, setWeekFilter] = useState([]); // Week filter state
    const [filteredData, setFilteredData] = useState([]); // Filtered data state
    const [expandedRows, setExpandedRows] = useState([]); // Expanded rows state
    const [selectedTrainer, setSelectedTrainer] = useState(""); // Trainer filter state
    const [getadmin_data, setadmin_data] = useState([]);
    const getdata_admin = () => {
        instance.get('trainer/get-trainers')
            .then((res) => {
                setadmin_data(res.data.responseData || []);
                console.log("res.data.responseData", res.data.responseData);
                
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        getdata_admin();
    }, []);
    // Fetch data from API based on selected trainer
    const fetchData = async (trainerName) => {
        try {
            const response = await instance.get(
                `search/searchByTrainer?trainer=${encodeURIComponent(trainerName)}`
            );
            const result = response.data || []; // Fallback to an empty array if data is null/undefined
            if (Array.isArray(result)) {
                setData(result);
            } else {
                console.error("Unexpected API response: data is not an array", result);
                setData([]); // Reset to an empty array if the response is unexpected
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]); // Reset to an empty array on error
        }
    };

    useEffect(() => {
        if (selectedTrainer) {
            fetchData(selectedTrainer); // Fetch data whenever the selected trainer changes
        }
    }, [selectedTrainer]);

    // Get the unique years, months, and weeks for dropdowns
    const uniqueYears = [...new Set(data.map((item) => item.year))];
    const uniqueMonths = [
        ...new Set(data.flatMap((item) => item.months.map((month) => month.month))),
    ];
    const uniqueWeeks = [
        ...new Set(data.flatMap((item) =>
            item.months.flatMap((month) => month.weeks.map((week) => week.week))
        )),
    ];

    // Convert uniqueYears, uniqueMonths, and uniqueWeeks to { label, value } format for react-select
    const yearOptions = uniqueYears.map((year) => ({
        label: year,
        value: year,
    }));

    const monthOptions = uniqueMonths.map((month) => ({
        label: month,
        value: month,
    }));

    const weekOptions = uniqueWeeks.map((week) => ({
        label: week,
        value: week,
    }));

    // Function to filter data based on selected years, months, and weeks
    const handleSearch = () => {
        const result = data
            .filter((item) => {
                return yearFilter.length > 0 ? yearFilter.includes(item.year) : true;
            })
            .map((item) => ({
                ...item,
                months: item.months
                    .filter((month) => {
                        return monthFilter.length > 0 ? monthFilter.includes(month.month) : true;
                    })
                    .map((month) => ({
                        ...month,
                        weeks: month.weeks.filter((week) =>
                            weekFilter.length > 0 ? weekFilter.includes(week.week) : true
                        ),
                    }))
                    .filter((month) => month.weeks.length > 0), // Remove months with no matching weeks
            }))
            .filter((item) => item.months.length > 0); // Remove years with no matching months

        setFilteredData(result); // Update filtered data state
    };

    // Function to handle the expansion of months
    const toggleExpand = (monthName) => {
        setExpandedRows((prev) =>
            prev.includes(monthName)
                ? prev.filter((name) => name !== monthName)
                : [...prev, monthName]
        );
    };

    // Function to calculate the total slot count and booking form count for the month
    const calculateMonthTotals = (month) => {
        let totalSlotCount = 0;
        let totalBookingFormCount = 0;

        month.weeks.forEach((week) => {
            totalSlotCount += week.totalSlotCount;
            totalBookingFormCount += week.totalBookingFormCount;
        });

        return { totalSlotCount, totalBookingFormCount };
    };

    // Function to calculate the total slot count and booking form count for the year
    const calculateYearTotals = (yearData) => {
        let totalSlotCount = 0;
        let totalBookingFormCount = 0;

        yearData.months.forEach((month) => {
            month.weeks.forEach((week) => {
                totalSlotCount += week.totalSlotCount;
                totalBookingFormCount += week.totalBookingFormCount;
            });
        });

        return { totalSlotCount, totalBookingFormCount };
    };

    const exportToExcel = () => {
        const worksheetData = filteredData.map((yearData) => {
            const yearTotals = calculateYearTotals(yearData);
            return {
                Year: yearData.year,
                "Total Slot Count": yearTotals.totalSlotCount,
                "Total Booking Form Count": yearTotals.totalBookingFormCount,
                Months: yearData.months.map((month) => {
                    const monthTotals = calculateMonthTotals(month);
                    return {
                        Month: month.month,
                        "Total Slot Count": monthTotals.totalSlotCount,
                        "Total Booking Form Count": monthTotals.totalBookingFormCount,
                        Weeks: month.weeks.map((week) => ({
                            Week: week.week,
                            "Total Slot Count": week.totalSlotCount,
                            "Total Booking Form Count": week.totalBookingFormCount,
                        })),
                    };
                }),
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Summary");

        // Trigger file download
        XLSX.writeFile(workbook, "data_summary.xlsx");
    };

    return (
        <div className="p-4 bg-light">
            {/* Category Dropdown */}
            <div className="mb-4">
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
            </div>

            {/* Filters */}
            <div className="mb-4 d-flex justify-content-end gap-3 flex-wrap">
                {/* Year Filter */}
                <div style={{ minWidth: "200px" }}>
                    <Select
                        isMulti
                        options={yearOptions}
                        value={yearFilter.map((year) => ({ label: year, value: year }))}
                        onChange={(selectedOptions) => setYearFilter(selectedOptions.map((option) => option.value))}
                        placeholder="Select Years"
                    />
                </div>

                {/* Month Filter */}
                <div style={{ minWidth: "200px" }}>
                    <Select
                        isMulti
                        options={monthOptions}
                        value={monthFilter.map((month) => ({ label: month, value: month }))}
                        onChange={(selectedOptions) => setMonthFilter(selectedOptions.map((option) => option.value))}
                        placeholder="Select Months"
                    />
                </div>

                {/* Week Filter */}
                <div style={{ minWidth: "200px" }}>
                    <Select
                        isMulti
                        options={weekOptions}
                        value={weekFilter.map((week) => ({ label: week, value: week }))}
                        onChange={(selectedOptions) => setWeekFilter(selectedOptions.map((option) => option.value))}
                        placeholder="Select Weeks"
                    />
                </div>

                {/* Buttons */}
                <Button variant="primary" onClick={handleSearch}>
                    Search
                </Button>
                <Button variant="success" onClick={exportToExcel}>
                    Download Excel
                </Button>
            </div>

            {/* Data Table */}
            <DataTable
                title="Yearly Data"
                columns={[
                    { name: "Year", selector: (row) => row.year, sortable: true },
                    { name: "Total Slot Count", selector: (row) => row.totalSlotCount, sortable: true },
                    { name: "Total Booking Form Count", selector: (row) => row.totalBookingFormCount, sortable: true },
                ]}
                data={filteredData.map((yearData) => ({
                    year: yearData.year,
                    totalSlotCount: calculateYearTotals(yearData).totalSlotCount,
                    totalBookingFormCount: calculateYearTotals(yearData).totalBookingFormCount,
                }))}
                expandableRows
                expandOnRowClicked
                onRowClicked={(row) => toggleExpand(row.year)}
                expandComponent={({ data }) => (
                    <div className="p-3">
                        {data.months.map((month) => (
                            <div key={month.month}>
                                <h5>
                                    {month.month} - Total Slot Count: {calculateMonthTotals(month).totalSlotCount},
                                    Total Booking Form Count: {calculateMonthTotals(month).totalBookingFormCount}
                                </h5>
                                <WeekTable weeks={month.weeks} />
                            </div>
                        ))}
                    </div>
                )}
            />
        </div>
    );
};

export default ByTrainer;
