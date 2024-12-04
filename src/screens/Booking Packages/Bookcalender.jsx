import React, { useState, useEffect } from "react";
import { Container, Table, Col, Row, Form, Alert } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import './bookingpckg.css';
import leftarrow from "../../assets/Holiday/leftarrow.png";
import rightarrow from "../../assets/Holiday/rightarrow.png";
import { confirmAlert } from "react-confirm-alert";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { jsPDF } from "jspdf"; // Import jsPDF
import Categories from "../../components/Categories";
import instance from "../../api/AxiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { base64String } from "../../assets/base64font"
const Bookcalender = ({ tabKey }) => {
    const [show, setShow] = useState(false);
    const [slotInfo, setSlotInfo] = useState(null); // State to store slot data
    const navigate = useNavigate();
    // const [selectedDate, setSelectedDate] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const [dataByDateAndCategory, setDataByDateAndCategory] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [formatedDateData, setFormatedDate] = useState();
    const [searchQuery, setSearchQuery] = useState("");
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [printData, setPrintData] = useState([]);
    const [lgShow, setLgShow] = useState(false);
    const location = useLocation();
    const { selectedDate, selectedTime, category, slotsession } = location.state || {};

    useEffect(() => {
        if (!selectedDate || !selectedTime || !category) {
            console.log("State values are missing:", { selectedDate, selectedTime, category });
        } else {
            console.log("Selected Date:", selectedDate);
            console.log("Selected Time:", selectedTime);
            console.log("Category:", category);
        }
    }, [selectedDate, selectedTime, category]);


    const sessionSlotId = localStorage.getItem('slotsid');
    const category1 = localStorage.getItem('category')
    const getUserDataByCategoryAndDate = () => {

        const dateOnly = selectedDate.split(' ')[1];
        let data = {
            slotsession: slotsession,// Use the formatted date here
            sessionSlotId: sessionSlotId,
            category: category1
        };
        instance.post("bookingform/get-bookingentries-by-date-category1", data).then((result) => {
            console.log("result", result);
            setDataByDateAndCategory(result.data.responseData)
            setFilteredData(result.data.responseData);
        }).catch((error) => {
            console.log("error", error);

        })
    }

    useEffect(() => {
        getUserDataByCategoryAndDate()
    }, [])

    // const handlePrintAll = async () => {
    //     const attendedRows = filteredData.filter((row) => row.training_status === "Attended");

    //     if (attendedRows.length === 0) {
    //         alert("No rows with 'Attended' status found.");
    //         return;
    //     }

    //     const loadImage = (src) => {
    //         return new Promise((resolve, reject) => {
    //             const img = new Image();
    //             img.src = src;
    //             img.onload = () => resolve(img);
    //             img.onerror = (err) => reject(err);
    //         });
    //     };

    //     for (const item of attendedRows) {
    //         try {
    //             let image;
    //             if (item.category === "RTO – Learner Driving License Holder Training") {
    //                 image = (await import('../../assets/Holiday/learner.JPG')).default;
    //             } else if (item.category === "RTO – Training for School Bus Driver") {
    //                 image = (await import('../../assets/Holiday/CERTIFICATE - BUS - Final.jpg')).default;
    //             } else if (item.category === "RTO – Suspended Driving License Holders Training") {
    //                 image = (await import('../../assets/Holiday/suspended.jpg')).default;
    //             } else if (item.category === "College/Organization Training – Group") {
    //                 image = (await import('../../assets/Holiday/suspended.jpg')).default;
    //             }

    //             const img = await loadImage(image);

    //             const imgWidthPx = img.width;
    //             const imgHeightPx = img.height;

    //             const dpi = 96;
    //             const imgWidthMm = (imgWidthPx / dpi) * 25.4;
    //             const imgHeightMm = (imgHeightPx / dpi) * 25.4;

    //             const doc = new jsPDF({
    //                 orientation: imgWidthMm > imgHeightMm ? 'landscape' : 'portrait',
    //                 unit: 'mm',
    //                 format: [imgWidthMm, imgHeightMm],
    //             });

    //             doc.addImage(img, 'PNG', 0, 0, imgWidthMm, imgHeightMm);

    //             // Add user details
    //             const xPositionName = (imgWidthMm - doc.getTextWidth(`${item.fname} ${item.lname}`)) / 2;
    //             const yPositionName = imgHeightMm * 0.52;

    //             doc.setFont("Arial");
    //             doc.setFontSize(35);
    //             doc.setTextColor("#4e4e95");
    //             doc.text(`${item.fname} ${item.lname}`, xPositionName, yPositionName);

    //             const pdfBlob = doc.output("blob");
    //             const downloadLink = document.createElement('a');
    //             downloadLink.href = URL.createObjectURL(pdfBlob);
    //             downloadLink.download = `${item.fname}_${item.lname}_certificate.pdf`;
    //             downloadLink.click();
    //         } catch (err) {
    //             console.error("Error generating PDF:", err);
    //         }
    //     }
    // };

    const handlePrintAll = async () => {
        const attendedRows = filteredData.filter((row) => row.training_status === "Attended");
    
        if (attendedRows.length === 0) {
            alert("No rows with 'Attended' status found.");
            return;
        }
    
        const loadImage = (src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = () => resolve(img);
                img.onerror = (err) => reject(err);
            });
        };
    
        try {
            let combinedDoc;
    
            for (const [index, item] of attendedRows.entries()) {
                let image;
                if (item.category === "RTO – Learner Driving License Holder Training") {
                    image = (await import('../../assets/Holiday/learner.JPG')).default;
                } else if (item.category === "RTO – Training for School Bus Driver") {
                    image = (await import('../../assets/Holiday/CERTIFICATE - BUS - Final.jpg')).default;
                } else if (item.category === "RTO – Suspended Driving License Holders Training") {
                    image = (await import('../../assets/Holiday/suspended.jpg')).default;
                } else if (item.category === "College/Organization Training – Group") {
                    image = (await import('../../assets/Holiday/suspended.jpg')).default;
                }
    
                const img = await loadImage(image);
    
                const imgWidthPx = img.width;
                const imgHeightPx = img.height;
    
                const dpi = 96;
                const imgWidthMm = (imgWidthPx / dpi) * 25.4;
                const imgHeightMm = (imgHeightPx / dpi) * 25.4;
    
                const orientation = imgWidthMm > imgHeightMm ? 'landscape' : 'portrait';
    
                // Initialize the PDF document with correct dimensions and orientation for the first certificate
                if (index === 0) {
                    combinedDoc = new jsPDF({
                        orientation,
                        unit: 'mm',
                        format: [imgWidthMm, imgHeightMm],
                    });
                } else {
                    // Add a new page for subsequent certificates
                    combinedDoc.addPage([imgWidthMm, imgHeightMm], orientation);
                }
    
                // Skip adding the image but retain its dimensions for layout
    
                // Add user details
                const nameText = `${item.fname} ${item.lname}`;
                const xPositionName = (imgWidthMm - combinedDoc.getTextWidth(nameText)) / 2.2;
                const yPositionName = imgHeightMm * 0.52;
    
                combinedDoc.addFileToVFS("MyCustomFont.ttf", base64String); // Add the font
                combinedDoc.addFont("MyCustomFont.ttf", "MyCustomFont", "normal"); // Register the font
                combinedDoc.setFont("MyCustomFont");
                combinedDoc.setFontSize(95);
                combinedDoc.setTextColor("#f48633");
                combinedDoc.text(nameText, xPositionName, yPositionName);
    
                // Add certificate number (simple font)
                const certNoText = `${item.certificate_no}`;
                const xPositionCertNo = (imgWidthMm - combinedDoc.getTextWidth(certNoText)) / 1.09;
                const yPositionCertNo = imgHeightMm * 0.072;
    
                combinedDoc.setFont("helvetica", "normal"); // Use simple font
                combinedDoc.setFontSize(40);
                combinedDoc.setTextColor("#333333");
                combinedDoc.text(certNoText, xPositionCertNo, yPositionCertNo);
    
                // Add date (simple font)
                const dateText = `${new Date().toLocaleDateString()}`;
                const xPositionDate = (imgWidthMm - combinedDoc.getTextWidth(dateText)) / 1.03;
                const yPositionDate = imgHeightMm * 0.135;
    
                combinedDoc.setFont("helvetica", "normal"); // Use simple font
                combinedDoc.text(dateText, xPositionDate, yPositionDate);
            }
    
            // Open the combined PDF in a new tab
            const pdfBlob = combinedDoc.output("blob");
            const pdfUrl = URL.createObjectURL(pdfBlob);
    
            const newWindow = window.open(pdfUrl);
            if (!newWindow) {
                alert("Please allow pop-ups for this site to view the PDF.");
            }
        } catch (err) {
            console.error("Error generating combined PDF:", err);
        }
    };
    
    







    const [selectedBooking, setSelectedBooking] = useState(null); // New state for selected booking

    const [isEditing, setIsEditing] = useState(false); // State for edit mode

    const handleEdit = () => {
        setIsEditing(true); // Enable edit mode
    };

    const handleSave = () => {
        // Here you can add logic to save changes to your state or backend
        setIsEditing(false); // Disable edit mode
        let updatedBooking = { ...selectedBooking };

        instance.put(`bookingform/bookingform/${updatedBooking.id}`, updatedBooking).then((resp) => {
            console.log("resp", resp);
            getUserDataByCategoryAndDate(formatedDateData)

        }).catch((err) => {
            console.log("err", err);

        })
    };

    const handleClose = () => setShow(false);


    const handleShow1 = () => setShow1(true);
    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);




    const getSlotInfo = () => {

        let data = {
            sessionSlotId: sessionSlotId,
            category: category1
        };
        instance.post("bookingform/getSlotInfo", data).then((result) => {
            setSlotInfo(result.data.data)
            console.log(result.data.data)

        }).catch((error) => {
            console.log("error", error);

        })
    }

    useEffect(() => {
        getSlotInfo()
    }, [])

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const startingDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);
    const firstWeek = Array(startingDay).fill(null).concat(daysArray.slice(0, 7 - startingDay));

    const chunkArray = (arr, size) => {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    };

    const weeks = chunkArray(daysArray.slice(7 - startingDay), 7);
    weeks.unshift(firstWeek);

    const lastWeek = weeks[weeks.length - 1];
    lastWeek.push(...Array(7 - lastWeek.length).fill(null));

    const EditDate = (e) => {
        let value = e.target.value
        const date = new Date(value);

        // Define options for formatting
        const options = {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        const formattedDate = date.toLocaleDateString('en-GB', options).replace(',', '').replace('/', '');
        setSelectedBooking({ ...selectedBooking, slotdate: formattedDate })
    }

    const EditSubmissionDate = (e) => {
        let value = e.target.value
        const date = new Date(value);

        // Set the desired time (17:22:33.000)
        date.setHours(17, 22, 33, 0);

        // Convert to ISO string format
        const isoString = date.toISOString();

        setSelectedBooking({ ...selectedBooking, submission_date: isoString })


    }


    const handlePrintCertificate = async () => {
        // Dynamically select the image based on the booking category
        let image;
        if (selectedBooking.category === "RTO – Learner Driving License Holder Training") {
            image = await import('../../assets/Holiday/learner.JPG'); // Adjust the path to your image
        } else if (selectedBooking.category === "RTO – Training for School Bus Driver") {
            image = await import('../../assets/Holiday/CERTIFICATE - BUS - Final.jpg'); // Adjust the path to your image
        } else if (selectedBooking.category === "RTO – Suspended Driving License Holders Training") {
            image = await import('../../assets/Holiday/suspended.jpg'); // Adjust the path to your image
        } else if (selectedBooking.category === "College/Organization Training – Group") {
            image = await import('../../assets/Holiday/suspended.jpg'); // Adjust the path to your image
        }
        const imgData = image.default; // Get the image data

        // Load the image to get its original dimensions
        const img = new Image();
        img.src = imgData;
        img.onload = () => {
            const imgWidthPx = img.width;
            const imgHeightPx = img.height;

            // Assume 96 DPI for web images and convert pixels to mm
            const dpi = 96;
            const imgWidthMm = (imgWidthPx / dpi) * 25.4;
            const imgHeightMm = (imgHeightPx / dpi) * 25.4;

            // Create a custom-sized PDF to match the image aspect ratio
            const doc = new jsPDF({
                orientation: imgWidthMm > imgHeightMm ? 'landscape' : 'portrait',
                unit: 'mm',
                format: [imgWidthMm, imgHeightMm] // Custom page size matching the image dimensions
            });

            // Add the image to the PDF
            doc.addImage(img, 'PNG', 0, 0, imgWidthMm, imgHeightMm);

            // Set font, color, and size for the user's name

            doc.addFileToVFS("MyCustomFont.ttf", base64String);  // Add the font
            doc.addFont("MyCustomFont.ttf", "MyCustomFont", "normal"); // Register the font

            doc.setFont("MyCustomFont");
            doc.setFontSize(95);
            doc.setTextColor("#f48633");

            // Prepare user's name
            const nameText = `${selectedBooking.fname} ${selectedBooking.lname}`;
            const nameWidth = doc.getTextWidth(nameText);

            // Center the name horizontally
            const xPositionName = (imgWidthMm - nameWidth) / 2;
            const yPositionName = imgHeightMm * 0.52; // Adjust as needed for vertical positioning

            // Draw the user's name
            doc.text(nameText, xPositionName, yPositionName);

            // Set font and size for Sr and slotdate
            doc.setFont("Arial");

            // Set color and position for Sr (ID)
            doc.setTextColor("#4e4e95");
            doc.setFontSize(35);
            const srText = `${selectedBooking.certificate_no}`;
            const xPositionSr = imgWidthMm - 80; // Adjust x-position for Sr
            const yPositionSr = 45; // Adjust y-position for Sr
            doc.text(srText, xPositionSr, yPositionSr);

            // Set color and position for slotdate
            doc.setTextColor("#4e4e95");
            doc.setFontSize(35);
            const slotDateText = `: ${selectedBooking.slotdate}`;
            const xPositionSlotDate = imgWidthMm - 93; // Adjust x-position for slotdate
            const yPositionSlotDate = 85; // Adjust y-position for slotdate
            doc.text(slotDateText, xPositionSlotDate, yPositionSlotDate);

            doc.setTextColor("#4e4e95");
            doc.setFontSize(35);
            const formatTimeTo12Hour = (time) => {
                const [hour, minute] = time.split(':');
                const hours = parseInt(hour, 10);
                const period = hours >= 12 ? 'PM' : 'AM';
                const formattedHour = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
                return `${formattedHour}:${minute} ${period}`;
            };
            const slotTimeText = ` ${formatTimeTo12Hour(selectedBooking.sessionSlotTime)}`;
            const xPositionSlotTime = imgWidthMm - 93; // Adjust x-position for slotdate
            const yPositionSlotTime = 100; // Adjust y-position for slotdate
            doc.text(slotTimeText, xPositionSlotTime, yPositionSlotTime);

            // Open the PDF in a new window for printing
            const pdfWindow = window.open("");
            pdfWindow.document.write(
                `<iframe width='100%' height='100%' src='${doc.output("bloburl")}'></iframe>`
            );
        };
    };

    const handleEmailCertificate = async () => {
        // Dynamically select the image based on the booking category
        let image;
        if (selectedBooking.category === "RTO – Learner Driving License Holder Training") {
            image = await import('../../assets/Holiday/learner.JPG');
        } else if (selectedBooking.category === "RTO – Training for School Bus Driver") {
            image = await import('../../assets/Holiday/CERTIFICATE - BUS - Final.jpg');
        } else if (selectedBooking.category === "RTO – Suspended Driving License Holders Training") {
            image = await import('../../assets/Holiday/suspended.jpg');
        } else if (selectedBooking.category === "College/Organization Training – Group") {
            image = await import('../../assets/Holiday/suspended.jpg');
        }
        const imgData = image.default;

        // Load the image to get its original dimensions
        const img = new Image();
        img.src = imgData;

        img.onload = async () => {
            const imgWidthPx = img.width;
            const imgHeightPx = img.height;

            const dpi = 96; // DPI for web images
            const imgWidthMm = (imgWidthPx / dpi) * 25.4;
            const imgHeightMm = (imgHeightPx / dpi) * 25.4;

            const doc = new jsPDF({
                orientation: imgWidthMm > imgHeightMm ? 'landscape' : 'portrait',
                unit: 'mm',
                format: [imgWidthMm, imgHeightMm]
            });

            // Add image to PDF
            doc.addImage(img, 'PNG', 0, 0, imgWidthMm, imgHeightMm);

            doc.addFileToVFS("MyCustomFont.ttf", base64String);  // Add the font
            doc.addFont("MyCustomFont.ttf", "MyCustomFont", "normal"); // Register the font

            doc.setFont("MyCustomFont");
            doc.setFontSize(95);
            doc.setTextColor("#f48633");

            const nameText = `${selectedBooking.fname} ${selectedBooking.lname}`;
            const nameWidth = doc.getTextWidth(nameText);
            const xPositionName = (imgWidthMm - nameWidth) / 2;
            const yPositionName = imgHeightMm * 0.52;
            doc.text(nameText, xPositionName, yPositionName);

            doc.setFont("Arial");
            doc.setTextColor("#4e4e95");
            doc.setFontSize(35);

            const srText = `${selectedBooking.certificate_no}`;
            const xPositionSr = imgWidthMm - 80;
            const yPositionSr = 45;
            doc.text(srText, xPositionSr, yPositionSr);

            const slotDateText = `: ${selectedBooking.slotdate}`;
            const xPositionSlotDate = imgWidthMm - 93;
            const yPositionSlotDate = 85;
            doc.text(slotDateText, xPositionSlotDate, yPositionSlotDate);

            doc.setTextColor("#4e4e95");
            doc.setFontSize(35);
            const formatTimeTo12Hour = (time) => {
                const [hour, minute] = time.split(':');
                const hours = parseInt(hour, 10);
                const period = hours >= 12 ? 'PM' : 'AM';
                const formattedHour = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
                return `${formattedHour}:${minute} ${period}`;
            };
            const slotTimeText = ` ${formatTimeTo12Hour(selectedBooking.sessionSlotTime)}`;
            const xPositionSlotTime = imgWidthMm - 93; // Adjust x-position for slotdate
            const yPositionSlotTime = 100; // Adjust y-position for slotdate
            doc.text(slotTimeText, xPositionSlotTime, yPositionSlotTime);


            // Convert the generated PDF to a Blob for sending to backend
            const pdfBlob = doc.output("blob");

            // Prepare FormData to send PDF and email to the backend
            const formData = new FormData();
            formData.append('pdf', pdfBlob, 'certificate.pdf');
            formData.append('email', selectedBooking.email); // Include email field

            // Send the PDF and email to the backend API
            try {
                const response = await instance.post('/certificate/upload-certificate', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // if (response.status === 200 && response.data.success) {
                //     alert('Certificate sent successfully!');
                // } else {
                //     alert('Failed to send certificate.');
                // }
            } catch (error) {
                console.error('Error uploading certificate:', error);
                alert('An error occurred while sending the certificate.');
            }
        };
    };


    const handleEmailCertificatesingle = async (row) => {
        // Dynamically select the image based on the booking category
        let image;
        if (row.category === "RTO – Learner Driving License Holder Training") {
            image = await import('../../assets/Holiday/learner.JPG');
        } else if (row.category === "RTO – Training for School Bus Driver") {
            image = await import('../../assets/Holiday/CERTIFICATE - BUS - Final.jpg');
        } else if (row.category === "RTO – Suspended Driving License Holders Training") {
            image = await import('../../assets/Holiday/suspended.jpg');
        } else if (row.category === "College/Organization Training – Group") {
            image = await import('../../assets/Holiday/suspended.jpg');
        }
        const imgData = image.default;

        // Load the image to get its original dimensions
        const img = new Image();
        img.src = imgData;

        img.onload = async () => {
            const imgWidthPx = img.width;
            const imgHeightPx = img.height;

            const dpi = 96; // DPI for web images
            const imgWidthMm = (imgWidthPx / dpi) * 25.4;
            const imgHeightMm = (imgHeightPx / dpi) * 25.4;

            const doc = new jsPDF({
                orientation: imgWidthMm > imgHeightMm ? 'landscape' : 'portrait',
                unit: 'mm',
                format: [imgWidthMm, imgHeightMm]
            });

            // Add image to PDF
            doc.addImage(img, 'PNG', 0, 0, imgWidthMm, imgHeightMm);

            doc.addFileToVFS("MyCustomFont.ttf", base64String);  // Add the font
            doc.addFont("MyCustomFont.ttf", "MyCustomFont", "normal"); // Register the font

            doc.setFont("MyCustomFont");
            doc.setFontSize(95);
            doc.setTextColor("#f48633");

            const nameText = `${row.fname} ${row.lname}`;
            const nameWidth = doc.getTextWidth(nameText);
            const xPositionName = (imgWidthMm - nameWidth) / 2;
            const yPositionName = imgHeightMm * 0.52;
            doc.text(nameText, xPositionName, yPositionName);

            doc.setFont("Arial");
            doc.setTextColor("#4e4e95");
            doc.setFontSize(35);

            const srText = `${selectedBooking.certificate_no}`;
            const xPositionSr = imgWidthMm - 80;
            const yPositionSr = 45;
            doc.text(srText, xPositionSr, yPositionSr);

            const slotDateText = `: ${row.slotdate}`;
            const xPositionSlotDate = imgWidthMm - 93;
            const yPositionSlotDate = 85;
            doc.text(slotDateText, xPositionSlotDate, yPositionSlotDate);

            doc.setTextColor("#4e4e95");
            doc.setFontSize(35);
            const formatTimeTo12Hour = (time) => {
                const [hour, minute] = time.split(':');
                const hours = parseInt(hour, 10);
                const period = hours >= 12 ? 'PM' : 'AM';
                const formattedHour = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
                return `${formattedHour}:${minute} ${period}`;
            };
            const slotTimeText = ` ${formatTimeTo12Hour(selectedBooking.sessionSlotTime)}`;
            const xPositionSlotTime = imgWidthMm - 93; // Adjust x-position for slotdate
            const yPositionSlotTime = 100; // Adjust y-position for slotdate
            doc.text(slotTimeText, xPositionSlotTime, yPositionSlotTime);


            // Convert the generated PDF to a Blob for sending to backend
            const pdfBlob = doc.output("blob");

            // Prepare FormData to send PDF and email to the backend
            const formData = new FormData();
            formData.append('pdf', pdfBlob, 'certificate.pdf');
            formData.append('email', row.email); // Include email field

            // Send the PDF and email to the backend API
            try {
                const response = await instance.post('/certificate/upload-certificate', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // if (response.status === 200 && response.data.success) {
                //     alert('Certificate sent successfully!');
                // } else {
                //     alert('Failed to send certificate.');
                // }
            } catch (error) {
                console.error('Error uploading certificate:', error);
                alert('An error occurred while sending the certificate.');
            }
        };
    };

    const toggleStatus = (row) => {
        const newStatus = row.training_status === "Confirmed" ? "Attended" : "Confirmed";

        // Update backend
        instance.put(`bookingform/updateTrainingStatus`, { trainingStatus: newStatus, bookingId: row.id })
            .then(() => {
                // Update row status locally for immediate UI feedback
                setFilteredData(prevData =>
                    prevData.map(item =>
                        item.id === row.id ? { ...item, training_status: newStatus } : item
                    )
                );
                getUserDataByCategoryAndDate()
            })
            .catch((error) => console.error("Error updating status:", error));
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = dataByDateAndCategory.filter((item) =>
            item.fname.toLowerCase().includes(query) ||
            item.lname.toLowerCase().includes(query) ||
            item.email.toLowerCase().includes(query) ||
            item.phone.includes(query)
        );
        setFilteredData(filtered);
    };
    const columns = [
        {
            name: 'Sr No.',
            selector: (row, id) => id + 1,
            sortable: true,
        },
        {
            name: 'Full Name',
            selector: row => `${row.fname}   ${row.lname}`,
            sortable: true,
        },

        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'phone',
            selector: row => row.phone,
            sortable: true,
        },
        {
            name: 'Certificate No.',
            selector: row => row.certificate_no,
            sortable: true,
        },
        {
            name: 'Training Status',
            cell: row => (
                <Button
                    variant={row.training_status === "Confirmed" ? "success" : "secondary"}
                    className="w-100"
                    onClick={() => { toggleStatus(row); handleEmailCertificatesingle(row); }}
                    disabled={row.training_status === "Attended"} // Disable the button if the status is "Attended"
                >
                    {row.training_status === "Confirmed" ? "Confirmed" : "Attended"}
                </Button>
            ),
            sortable: true,
        },
    ];


    const handleRowClick = (a) => {
        console.log("aaaa", a);

        setSelectedBooking(a); // Set the selected booking data
        handleShow1();
    };


    const printPreview = async () => {
        const pdfPromises = printData.map(async (row) => {
            let image;

            // Determine which image to use based on the category of the booking
            if (row.category === "RTO – Learner Driving License Holder Training") {
                image = await import('../../assets/Holiday/learner.JPG');
            } else if (row.category === "RTO – Training for School Bus Driver") {
                image = await import('../../assets/Holiday/CERTIFICATE - BUS - Final.jpg');
            } else if (row.category === "RTO – Suspended Driving License Holders Training") {
                image = await import('../../assets/Holiday/suspended.jpg');
            } else if (row.category === "College/Organization Training – Group") {
                image = await import('../../assets/Holiday/suspended.jpg');
            }

            const imgData = image.default; // Get the image data

            // Load the image to get its original dimensions
            const img = new Image();
            img.src = imgData;
            return new Promise((resolve) => {
                img.onload = () => {
                    const imgWidthPx = img.width;
                    const imgHeightPx = img.height;

                    // Assume 96 DPI for web images and convert pixels to mm
                    const dpi = 96;
                    const imgWidthMm = (imgWidthPx / dpi) * 25.4;
                    const imgHeightMm = (imgHeightPx / dpi) * 25.4;

                    // Create a custom-sized PDF to match the image aspect ratio
                    const doc = new jsPDF({
                        orientation: imgWidthMm > imgHeightMm ? 'landscape' : 'portrait',
                        unit: 'mm',
                        format: [imgWidthMm, imgHeightMm] // Custom page size matching the image dimensions
                    });

                    // Add the image to the PDF
                    doc.addImage(img, 'PNG', 0, 0, imgWidthMm, imgHeightMm);

                    doc.addFileToVFS("MyCustomFont.ttf", base64String);  // Add the font
                    doc.addFont("MyCustomFont.ttf", "MyCustomFont", "normal"); // Register the font

                    doc.setFont("MyCustomFont");
                    doc.setFontSize(95);
                    doc.setTextColor("#f48633");
                    doc.setFontSize(95);
                    doc.setTextColor("#4e4e95");

                    // Prepare user's name
                    const nameText = `${row?.fname} ${row?.lname}`;
                    const nameWidth = doc.getTextWidth(nameText);

                    // Center the name horizontally
                    const xPositionName = (imgWidthMm - nameWidth) / 2;
                    const yPositionName = imgHeightMm * 0.52; // Adjust as needed for vertical positioning

                    // Draw the user's name
                    doc.text(nameText, xPositionName, yPositionName);

                    // Set font and size for Sr and slotdate
                    doc.setFont("Arial");

                    // Set color and position for Sr (ID)
                    doc.setTextColor("#4e4e95");
                    doc.setFontSize(35);
                    const srText = `${row?.certificate_no}`;
                    const xPositionSr = imgWidthMm - 80; // Adjust x-position for Sr
                    const yPositionSr = 45; // Adjust y-position for Sr
                    doc.text(srText, xPositionSr, yPositionSr);

                    // Set color and position for slotdate
                    doc.setTextColor("#4e4e95");
                    doc.setFontSize(35);
                    const slotDateText = row?.slotdate ? `: ${new Date(row?.slotdate).toLocaleDateString('en-GB')}` : '';
                    const xPositionSlotDate = imgWidthMm - 93; // Adjust x-position for slotdate
                    const yPositionSlotDate = 85; // Adjust y-position for slotdate
                    doc.text(slotDateText, xPositionSlotDate, yPositionSlotDate);
                    doc.setTextColor("#4e4e95");
                    doc.setFontSize(35);
                    const formatTimeTo12Hour = (time) => {
                        const [hour, minute] = time.split(':');
                        const hours = parseInt(hour, 10);
                        const period = hours >= 12 ? 'PM' : 'AM';
                        const formattedHour = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
                        return `${formattedHour}:${minute} ${period}`;
                    };
                    const slotTimeText = ` ${formatTimeTo12Hour(row.sessionSlotTime)}`;
                    const xPositionSlotTime = imgWidthMm - 93; // Adjust x-position for slotdate
                    const yPositionSlotTime = 100; // Adjust y-position for slotdate
                    doc.text(slotTimeText, xPositionSlotTime, yPositionSlotTime);

                    // Resolve the generated PDF document
                    resolve(doc);
                };
            });
        });

        // Wait for all PDFs to be generated and then open them for printing
        const pdfDocuments = await Promise.all(pdfPromises);
        const pdfWindow = window.open("", "", "width=800,height=600");

        // Embed all PDFs into the new window for printing
        pdfDocuments.forEach(doc => {
            pdfWindow.document.write(
                `<iframe width='100%' height='100%' src='${doc.output("bloburl")}'></iframe>`
            );
        });
    };


    const getColumns = () => {
        // Check if all rows belong to the specific category
        const isSchoolTrainingCategory = (category1 == "School Students Training – Group");

        if (isSchoolTrainingCategory) {
            // Show only the "Full Name" column
            return [
                {
                    name: 'Full Name',
                    selector: row => `${row.fname} ${row.lname}`,
                    sortable: true,
                },
                {
                    name: 'Training Status',
                    cell: row => (
                        <Button
                            variant={row.training_status === "Confirmed" ? "success" : "secondary"}
                            className="w-100"
                            onClick={() => { toggleStatus(row); handleEmailCertificatesingle(row); }}
                            disabled={row.training_status === "Attended"} // Disable the button if the status is "Attended"
                        >
                            {row.training_status === "Confirmed" ? "Confirmed" : "Attended"}
                        </Button>
                    ),
                    sortable: true,
                }
            ]
        }

        // Otherwise, show all columns
        return columns;
    };
    const sessionSlotDetailsCategories = [
        "College/Organization Training – Group",
        "School Students Training – Group"
    ];
    const bookingPage2Categories = [
        "RTO – Training for School Bus Driver",
        "RTO – Suspended Driving License Holders Training",
        "RTO – Learner Driving License Holder Training"
    ];
    return (
        <>
            <div className=" text-center pb-2 d-flex justify-content-between">
                <div>
                    <h5>{category1}-{selectedDate}</h5>
                </div>
                <div className="d-flex justify-content-end ">
                    {bookingPage2Categories.includes(category1) ? <><Button

                        onClick={() => {
                            localStorage.setItem('slotsids', sessionSlotId)
                            if (bookingPage2Categories.includes(category1)) {
                                navigate("/bookingpage2", {
                                    state: {
                                        selectedDate: selectedDate,
                                        selectedTime: selectedTime,
                                        category: category1
                                    }
                                });
                            }
                        }}

                    >Register</Button ></> : <></>}

                    {sessionSlotDetailsCategories.includes(category1) && filteredData.length == 0 && slotInfo ? <>    <Button

                        onClick={() => {
                            localStorage.setItem('slotsids', sessionSlotId)
                            navigate("/bookingpage", {
                                state: {
                                    selectedDate: selectedDate,
                                    selectedTime: selectedTime,
                                    category: category1
                                }
                            });
                        }}

                    >Add Group Slot Info</Button ></> : <></>}

                </div>
            </div>


            <div className="mb-3 d-flex justify-content-end">
                {sessionSlotDetailsCategories.includes(category1) ?
                    <>
                        {slotInfo ? (
                            <>
                                <div className="col">
                                    <div><strong>Institution Name:</strong> {slotInfo.institution_name}</div>
                                    <div><strong>Institution Email:</strong> {slotInfo.institution_email}</div>
                                    <div><strong>Institution Phone:</strong> {slotInfo.institution_phone}</div>

                                </div>
                                <div className="col">
                                    <div><strong>Coordinator Name:</strong> {slotInfo.coordinator_name}</div>
                                    <div><strong>Coordinator Mobile:</strong> {slotInfo.coordinator_mobile}</div>


                                </div>
                                <div className="col">

                                    <div><strong>Principal Name:</strong> {slotInfo.hm_principal_manager_name}</div>
                                    <div><strong>Principal Mobile:</strong> {slotInfo.hm_principal_manager_mobile}</div>

                                </div>
                            </>
                        ) : (
                            <Button onClick={() => {
                                navigate("/Sessionslotdetails", {
                                    state: {

                                        selectedDate: selectedDate,
                                        selectedTime: selectedTime,
                                        category: category1
                                    }
                                });
                            }
                            }>book a slot</Button>

                        )}
                    </> :
                    <></>
                }


            </div>



            {
                category1 !== "School Students Training – Group" ? (
                    <Row className="mb-3">
                        <Col className="d-flex justify-content-end">
                            <Form.Control
                                type="text"
                                placeholder="Search by First Name, Last Name, or Email"
                                value={searchQuery}
                                onChange={handleSearch}
                                style={{ width: '300px' }} // Optional: Set a custom width for the input
                            /> <Button variant="primary" onClick={handlePrintAll} className="mb-3 ms-5">
                                Print All
                            </Button>
                        </Col>

                    </Row>
                ) : (
                    <></>
                )
            }




            {
                filteredData.length > 0 ? (
                    <DataTable
                        columns={getColumns(filteredData)}
                        data={filteredData}
                        pagination
                        responsive
                        striped
                        noDataComponent="No Data Available"
                        onRowClicked={handleRowClick}
                    />
                ) : (
                    <Alert variant="warning" className="text-center">
                        No Data Found
                    </Alert>
                )
            }


            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                fullscreen
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        ({selectedDay}) {selectedDate}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs defaultActiveKey="tab1" id="modal-tabs" className="mb-3">
                        <Tab eventKey="tab1" title="Customer">

                        </Tab>
                        <Tab eventKey="tab2" title="Booking">
                            <p className="fw-bold ">Comming Soon</p>
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={show1} onHide={handleClose1} size="lg" className="modaldetail">
                <Modal.Header >
                    <Modal.Title>Candidate Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBooking && (
                        <div>
                            <Row>
                                {/* <Col lg={6} md={6} sm={12} className="pb-4">
                                    <b>User Id</b><br />
                                    {selectedBooking.id}<br />
                                </Col> */}
                                {/* <Col lg={6} md={6} sm={12}>
                                    <b>Status</b><br />
                                    <Button variant={selectedBooking.status === "APPROVED" ? "primary" : selectedBooking.status === "PENDING" ? "warning" : selectedBooking.status === "CANCELLED" && "danger"} onClick={() => setLgShow(true)} className="w-100">{selectedBooking.status}</Button>
                                </Col> */}
                                {/* <hr></hr> */}

                                {/* <Col lg={6} md={6} sm={12} className="pb-4">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <b>Booking Date</b><br />
                                        {isEditing ? (
                                            <Form.Control type="date" onChange={EditDate} />
                                        ) : (
                                            selectedBooking.slotdate
                                        )}
                                    </Form.Group>
                                </Col> */}
                                <hr />

                                {/* <Col lg={6} md={6} sm={12} className="pb-4">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <b>Submission Date</b><br />
                                        {isEditing ? (
                                            // <input
                                            //     type="date"
                                            //     defaultValue={selectedBooking.submission_date}
                                            //     onChange={EditSubmissionDate}
                                            // />
                                            <Form.Control type="date" defaultValue={selectedBooking.submission_date} onChange={EditSubmissionDate} />
                                        ) : (
                                            // Check if submission_date is a valid date and format it properly
                                            <span>
                                                {selectedBooking.submission_date
                                                    ? (() => {
                                                        const date = new Date(selectedBooking.submission_date);
                                                        const options = {
                                                            weekday: 'long',
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                        };
                                                        const formattedDate = date.toLocaleDateString('en-GB', options); // 'en-GB' uses day/month/year format
                                                        return formattedDate.replace(',', '').replace('/', '/'); // Remove commas and ensure proper formatting
                                                    })()
                                                    : selectedBooking.submission_date}
                                            </span>
                                        )}
                                    </Form.Group>
                                </Col> */}
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <b>First Name:</b><br />
                                        {isEditing ? (
                                            // <input
                                            //     type="text"
                                            //     defaultValue={selectedBooking.fname}
                                            //     onChange={(e) => setSelectedBooking({ ...selectedBooking, fname: e.target.value })}
                                            // />
                                            <Form.Control type="text" defaultValue={selectedBooking.fname} onChange={(e) => setSelectedBooking({ ...selectedBooking, fname: e.target.value })} />
                                        ) : (
                                            selectedBooking.fname
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <b>Middle Name:</b><br />
                                        {isEditing ? (
                                            // <input
                                            //     type="text"
                                            //     defaultValue={selectedBooking.fname}
                                            //     onChange={(e) => setSelectedBooking({ ...selectedBooking, fname: e.target.value })}
                                            // />
                                            <Form.Control type="text" defaultValue={selectedBooking.mname} onChange={(e) => setSelectedBooking({ ...selectedBooking, mname: e.target.value })} />
                                        ) : (
                                            selectedBooking.mname
                                        )}
                                    </Form.Group>
                                </Col>
                                <hr />

                                <Col lg={6} md={6} sm={12} className="">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <b>Last Name</b><br />
                                        {isEditing ? (
                                            // <input
                                            //     type="text"
                                            //     defaultValue={selectedBooking.lname}
                                            //     onChange={(e) => setSelectedBooking({ ...selectedBooking, lname: e.target.value })}
                                            // />
                                            <Form.Control type="text" defaultValue={selectedBooking.lname} onChange={(e) => setSelectedBooking({ ...selectedBooking, lname: e.target.value })} />
                                        ) : (
                                            selectedBooking.lname
                                        )}
                                    </Form.Group>
                                </Col>
                                {/* <Col lg={6} md={6} sm={12}>
                                    <b>Training For</b><br />

                                    {isEditing ? (
                                        <Form.Select
                                            defaultValue={selectedBooking.category}
                                            onChange={(e) => { setSelectedBooking({ ...selectedBooking, category: e.target.value }); }}
                                        >
                                            <option value="RTO – Learner Driving License Holder Training">RTO – Learner Driving License Holder Training</option>
                                            <option value="RTO – Suspended Driving License Holders Training">RTO – Suspended Driving License Holders Training</option>
                                            <option value="RTO – Training for School Bus Driver">RTO – Training for School Bus Driver</option>
                                            <option value="School Students Training – Group">School Students Training – Group</option>
                                            <option value="College/Organization Training – Group">College/Organization Training – Group</option>
                                        </Form.Select>
                                    ) : (
                                        selectedBooking.category
                                    )}


                                </Col>
                                 */}

                                {/* <Col lg={6} md={6} sm={12} className="pb-4">
                                    <b>Certificate Number</b><br />
                                    {selectedBooking.certificate_no}
                                </Col> */}
                                <Col lg={6} md={6} sm={12}>
                                    <b>Tranning Status</b><br />
                                    {isEditing ? (
                                        // <select
                                        //     defaultValue={selectedBooking.training_status}
                                        //     onChange={(e) => setSelectedBooking({ ...selectedBooking, training_status: e.target.value })}
                                        // >
                                        <Form.Select aria-label="Default select example" defaultValue={selectedBooking.training_status} onChange={(e) => setSelectedBooking({ ...selectedBooking, training_status: e.target.value })}>

                                            <option value="Attended">Attended</option>
                                            <option value="Confirmed">Confirmed</option>

                                            {/* Add other options as needed */}
                                        </Form.Select>
                                    ) : (
                                        selectedBooking.training_status
                                    )}
                                </Col>
                                <hr></hr>

                                <Col lg={6} md={6} sm={12} className="pb-4">
                                    <b>Learining Licenses Number</b><br />
                                    {selectedBooking.learningNo}
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        {/* <b>Email</b><br /> */}
                                        <Form.Label><b>Email</b></Form.Label><br />
                                        {isEditing ? (
                                            // <input
                                            //     type="text"
                                            //     defaultValue={selectedBooking.email}
                                            //     onChange={(e) => setSelectedBooking({ ...selectedBooking, email: e.target.value })}
                                            // />


                                            <Form.Control type="text" defaultValue={selectedBooking.email} onChange={(e) => setSelectedBooking({ ...selectedBooking, email: e.target.value })} />

                                        ) : (
                                            selectedBooking.email
                                        )}
                                    </Form.Group>
                                </Col>
                                <hr></hr>

                                <Col lg={6} md={6} sm={12} className="">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label><b>Phone Number</b></Form.Label><br />


                                        {isEditing ? (
                                            <Form.Control type="text" defaultValue={selectedBooking.phone} onChange={(e) => setSelectedBooking({ ...selectedBooking, phone: e.target.value })} />
                                        ) : (
                                            selectedBooking.phone
                                        )}
                                    </Form.Group>
                                </Col>

                                <hr />

                                {category1 === "School Students Training – Group" ? <></> : (
                                    <>
                                        <Col lg={12} md={12} sm={12} className="pb-4">

                                            <div>
                                                {/* Check if not in editing mode and training_status is not 'Confirmed' */}
                                                {!(isEditing || selectedBooking?.training_status === "Confirmed") && (
                                                    <>
                                                        <button
                                                            className="btn btn-success mx-2 mt-2 w-25"
                                                            onClick={handlePrintCertificate}
                                                        >
                                                            Print & Pdf
                                                        </button>
                                                        <Button variant="danger" className="mx-2 mt-2 w-25" onClick={handleEmailCertificate}>
                                                            Email
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </Col>
                                    </>
                                )}




                            </Row>
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="danger" onClick={() => { handleClose1(); setIsEditing(false); }}>
                        Return
                    </Button>
                    {isEditing ? (
                        <Button variant="primary" onClick={handleSave}>
                            Save
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={handleEdit}>
                            Edit
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>


            <Modal size="lg" show={lgShow} onHide={() => setLgShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    setSelectedBooking({ ...selectedBooking, status: "APPROVED" });
                                    setLgShow(false);
                                }}
                                className="w-100 m-2">
                                APPROVED
                            </Button>
                            <Button variant="warning"
                                onClick={() => {
                                    setSelectedBooking({ ...selectedBooking, status: "PENDING" })
                                    setLgShow(false);
                                }}
                                className="w-100 m-2">PENDING </Button>
                            <Button variant="danger" onClick={() => {
                                setSelectedBooking({ ...selectedBooking, status: "CANCELLED" })
                                setLgShow(false);
                            }} className="w-100 m-2">CANCELLED</Button>
                            <Button variant="secondary" onClick={() => setLgShow(false)} className="w-100 m-2">CLOSE</Button>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setLgShow(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showPrintModal} onHide={() => setShowPrintModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Print All Attended Records</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        {printData.map((row, index) => (
                            <div key={index}>
                                <h4>{row.fname} {row.lname}</h4>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPrintModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={printPreview}>
                        Print
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Bookcalender;
