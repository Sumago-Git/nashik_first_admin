import React, { useContext, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FaEdit } from 'react-icons/fa'; // Import an edit icon

const HomeCounter = () => {
    const [formData, setFormData] = useState({
        training_imparted: '',
        lives_changed: '',
        children: '',
        adult: '',
    });

    // Single static data entry
    const [data, setData] = useState([
        {
            training_imparted: 'Digital Literacy Training',
            lives_changed: 100,
            children: 20,
            adult: 80,
        },
    ]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [id]: value,
        }));
    };

    const handleEdit = (row) => {
        // Populate the form with the data of the selected row
        setFormData(row);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setData((prevData) => [...prevData, formData]);
        setFormData({
            training_imparted: '',
            lives_changed: '',
            children: '',
            adult: '',
        });
    };

    const columns = [
        { name: 'Training Imparted', selector: row => row.training_imparted, sortable: true },
        { name: 'Lives Changed', selector: row => row.lives_changed, sortable: true },
        { name: 'Children', selector: row => row.children, sortable: true },
        { name: 'Adult', selector: row => row.adult, sortable: true },
        {
            name: 'Actions',
            cell: row => (
                <button onClick={() => handleEdit(row)} className="text-blue-500">
                    <FaEdit />
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <div className="max-w-xxl mx-auto bg-white shadow-lg rounded-lg p-8 dark:bg-gray-800">

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="training_imparted" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Training Imparted</label>
                        <input type="text" id="training_imparted" value={formData.training_imparted} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter training details" required />
                    </div>
                    <div>
                        <label htmlFor="lives_changed" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Lives Changed</label>
                        <input type="number" id="lives_changed" value={formData.lives_changed} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Number of lives changed" required />
                    </div>
                    <div>
                        <label htmlFor="children" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Children</label>
                        <input type="number" id="children" value={formData.children} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Number of children" required />
                    </div>
                    <div>
                        <label htmlFor="adult" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Adult</label>
                        <input type="number" id="adult" value={formData.adult} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Number of adults" required />
                    </div>
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </form>

            <div className="mt-8">
                <DataTable
                    title="Home Counter"
                    columns={columns}
                    data={data}
                    pagination
                    paginationComponentOptions={{
                        rowsPerPageText: 'Rows per page:',
                        rangeSeparatorText: 'of',
                        selectAllRowsItem: false,
                        selectAllRowsItemText: 'All',
                    }}
                />
            </div>

        </div>

    );
};

export default HomeCounter;
