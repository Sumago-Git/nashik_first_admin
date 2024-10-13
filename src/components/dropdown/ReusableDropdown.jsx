// src/components/dropdown/ReusableDropdown.jsx
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import instance from "../../api/AxiosInstance";

const ReusableDropdown = ({ label, name, onChange, initialData }) => {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(initialData[name] || "");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await instance.get("productname/find-productnames");
        setOptions(response.data.responseData);
      } catch (error) {
        console.error("Error fetching product names:", error);
      }
    };
    
    fetchOptions();
  }, []);

  const handleSelect = (e) => {
    const value = e.target.value;
    setSelectedValue(value);
    onChange(name, value);
  };

  return (
    <Form.Group controlId={name}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        as="select"
        value={selectedValue}
        onChange={handleSelect}
      >
        <option value="">Select Product Name</option>
        {options.map((option) => (
          <option key={option.id} value={option.productName}>
            {option.productName}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default ReusableDropdown;
