////sos
import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";

const TestTable = ({ columns, data, onEdit, onDelete, onShow }) => {
  const [eyeVisibilityById, setEyeVisibilityById] = useState({});

  const toggleVisibility = (id) => {
    const updatedEyeVisibilityById = {
      ...eyeVisibilityById,
      [id]: !eyeVisibilityById[id],
    };
    setEyeVisibilityById(updatedEyeVisibilityById);
  };

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            {columns.map((col) => (
              <td key={col.key}>
                {col.render ? col.render(item[col.key]) : item[col.key]}
              </td>
            ))}
            <td>
              <div className="d-flex">
                <Button className="ms-1" onClick={() => onEdit(item.id)}>
                  <FaEdit />
                </Button>
                <Button className="ms-1" onClick={() => onDelete(item.id)}>
                  <FaTrash />
                </Button>
                <Button
                  className="ms-1"
                  onClick={() => {
                    toggleVisibility(item.id);
                    onShow(item.id, !eyeVisibilityById[item.id]);
                  }}
                >
                  {eyeVisibilityById[item.id] ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TestTable;








