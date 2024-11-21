import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { MdDelete } from 'react-icons/md';
import instance from '../../api/AxiosInstance';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useSearchExport } from '../../context/SearchExportContext';
import DataTable from 'react-data-table-component';  // Import DataTable component
import * as XLSX from 'xlsx'; // Import the xlsx library
import "../../assets/contactform.css";

function Individual() {
    const [getAdminData, setAdminData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);  // Track selected rows
    const [selectAll, setSelectAll] = useState(false);  // Track "Select All" state
    const { searchQuery, handleSearch, handleExport, setData, filteredData } = useSearchExport();

    const columns = [
        {
            name: 'Sr. No',
            selector: (row, index) => index + 1,
            sortable: true,
        },
        {
            name: 'Full Name',
            selector: row => row.fname,
            sortable: true,
        },
        {
            name: 'Middle Name',
            selector: row => row.mname,
            sortable: true,
        },
        {
            name: 'Last Name',
            selector: row => row.lname,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Contact',
            selector: row => row.phone,
            sortable: true,
        },
        {
            name: 'Action',
            button: true,
            cell: (row) => (
                <>
                    <Button variant="danger" className="m-2" onClick={() => handleDelete(row.id)}>
                        <MdDelete />
                    </Button>
                </>
            ),
        },
    ];

    const getdata_admin = () => {
        instance.get('Individuals/get-Individualss')
            .then((res) => {
                setAdminData(res.data.responseData || []);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        getdata_admin();
    }, []);

    const handleDelete = (id) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this entry?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await instance.delete(`Individuals/delete-Individuals/${id}`);
                            getdata_admin(); // Refresh data after deletion
                        } catch (error) {
                            console.error("Error deleting data:", error);
                        }
                    }
                },
                {
                    label: 'No'
                }
            ]
        });
    };

    const handleRowSelected = (state) => {
        setSelectedRows(state.selectedRows);
    };

    const handleExportToExcel = async () => {
        if (selectedRows.length > 0) {
            // Map selected rows to include only the specified fields
            const exportData = selectedRows.map(row => ({
                learningNo: "0  ", // Rename field to match desired header
                fname: row.fname,
                mname: row.mname,
                lname: row.lname,
                email: row.email,
                phone: row.phone
            }));

            // Create a worksheet from the mapped data
            const ws = XLSX.utils.json_to_sheet(exportData);

            // Create a workbook and append the worksheet
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Selected Data");

            // Write the workbook to a file
            XLSX.writeFile(wb, "selected_data.xlsx");
            try {
                const deletePromises = selectedRows.map(row =>
                    instance.delete(`Individuals/delete-Individuals/${row.id}`)
                );
                await Promise.all(deletePromises);

                // Refresh the data after successful deletion
                getdata_admin();
                setSelectedRows([]); // Clear selected rows
                alert("Exported and deleted successfully!");
            } catch (error) {
                console.error("Error deleting records:", error);
                alert("Export successful, but some records could not be deleted.");
            }
        } else {
            alert("No rows selected");
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedRows([]); // Deselect all
        } else {
            setSelectedRows(getAdminData); // Select all rows
        }
        setSelectAll(!selectAll); // Toggle the Select All state
    };

    return (
        <Container>
            <Card>
                <Card.Header className="d-flex justify-content-between">
                    <b>Details</b>
                    {/* <Button variant="primary" onClick={handleSelectAll} className="ml-3">
                        {selectAll ? 'Deselect All' : 'Select All'}
                    </Button> */}
                </Card.Header>
                <Card.Body>
                    {getAdminData.length > 0 ? (
                        <>
                            <Button variant="primary" onClick={handleExportToExcel} className="mb-3">
                                Export Selected to XLS
                            </Button>
                            <DataTable
                                columns={columns}
                                data={filteredData.length > 0 ? filteredData : getAdminData}
                                pagination
                                responsive
                                striped
                                noDataComponent="No Data Available"
                                // onChangePage={(page) => setCurrentPage(page)}
                                // onChangeRowsPerPage={(rowsPerPage) => setRowsPerPage(rowsPerPage)}
                                selectableRows
                                onSelectedRowsChange={handleRowSelected} // Listen to row selection change
                                clearSelectedRows={selectedRows.length === 0} // Optional: Clear selection if no rows are selected
                            />
                        </>
                    ) : (
                        <Alert variant="warning" className="text-center">
                            No data found
                        </Alert>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Individual;
