import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Modal, OverlayTrigger, Tooltip, Col, Row, Badge } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import instance from "../../api/AxiosInstance";

const Slotsfromtoday = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(15); // Default to 10 records per page
    const [totalRows, setTotalRows] = useState(0); // Total number of rows
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]); // Data for the current page

    const fetchTeam = async () => {
        setLoading(true);
        try {
            const response = await instance.get("Sessionslot/fetchSlots");
            const allData = response.data.data?.reverse(); // Reverse data if needed
            setTotalRows(allData.length); // Set total rows
            // Paginate data for the current page
            const start = (currentPage - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            setData(allData.slice(start, end));
        } catch (error) {
            console.error("Error fetching team:", error.response || error.message || error);
            alert("Failed to fetch data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, [currentPage, rowsPerPage]); // Refetch data when the page or rows per page change

    const formatTimeTo12Hour = (time) => {
        const [hour, minute] = time.split(':');
        const hours = parseInt(hour, 10);
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHour = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
        return `${formattedHour}:${minute} ${period}`;
    };

    const convertDateFormat = (date) => {
        const [month, day, year] = date.split('/');
        return `${day}/${month}/${year}`;
    };

    const CustomHeader = ({ name }) => (
        <div style={{ fontWeight: "bold", color: "black", fontSize: "18px" }}>
            {name}
        </div>
    );

    const tableColumns = [
        {
            name: <CustomHeader name="Sr. No." />,
            selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
        },
        
        {
            name: <CustomHeader name="Slot Date" />,
            cell: (row) => <span>{convertDateFormat(row.slotdate)}</span>,
        },
        {
            name: <CustomHeader name="Time" />,
            cell: (row) => <span>{formatTimeTo12Hour(row.time)}</span>,
            sortable: true,
        },
        {
            name: <CustomHeader name="Trainer" />,
            cell: (row) => (
                row.trainer ? (
                    <span>{row.trainer}</span>
                ) : (
                    <span>--</span>
                )
            ),
        },
        {
            name: <CustomHeader name="Category" />,
            cell: (row) => <span>{row.category}</span>,
        },
        {
            name: <CustomHeader name="Institution Name" />,
            cell: (row) => (
                row.slotRegisterInfos.length > 0
                    ? <span>{row.slotRegisterInfos[0].institution_name}</span>
                    : <span>--</span>
            ),
        },
        {
            name: <CustomHeader name="Institution Email" />,
            cell: (row) => (
                row.slotRegisterInfos.length > 0
                    ? <span>{row.slotRegisterInfos[0].institution_email}</span>
                    : <span>--</span>
            ),
        },
       
        {
            name: <CustomHeader name="Coordinator Name" />,
            cell: (row) => (
                row.slotRegisterInfos.length > 0
                    ? <span>{row.slotRegisterInfos[0].coordinator_name}</span>
                    : <span>--</span>
            ),
        },
        {
            name: <CustomHeader name="Principal Manager" />,
            cell: (row) => (
                row.slotRegisterInfos.length > 0
                    ? <span>{row.slotRegisterInfos[0].hm_principal_manager_mobil}</span>
                    : <span>--</span>
            ),
        },
        {
            name: <CustomHeader name="Principal Manager" />,
            cell: (row) => (
                row.slotRegisterInfos.length > 0
                    ? <span>{row.slotRegisterInfos[0].hm_principal_manager_name}</span>
                    : <span>--</span>
            ),
        },
    ];

    return (
        <>
        <h5>Traning Type Table</h5>
            <DataTable
                columns={tableColumns}
                data={data}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangePage={(page) => setCurrentPage(page)}
                onChangeRowsPerPage={(newPerPage) => setRowsPerPage(newPerPage)}
                highlightOnHover
                dense
                progressPending={loading}
                noDataComponent={
                    <div className="text-center my-3">
                        <p>There is no record to display.</p>
                    </div>
                }
            />
        </>
    );
};

export default Slotsfromtoday;
