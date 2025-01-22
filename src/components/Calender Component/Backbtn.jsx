import React from 'react';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button'; // Import Button directly from React Bootstrap

const Backbtn = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <Button variant="primary" onClick={handleBack} style={{ margin: '10px' }}>
            Back
        </Button>
    );
};

export default Backbtn;
