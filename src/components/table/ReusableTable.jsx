// ////sos
// import React, { useState, useEffect } from "react";
// import { Button, Table } from "react-bootstrap";
// import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";

// const ReusableTable = ({ columns, data, onEdit, onDelete, onShow }) => {
//   const [eyeVisibilityById, setEyeVisibilityById] = useState({});

//   useEffect(() => {
//     // Initialize eyeVisibilityById with the current visibility state of each item
//     const initialVisibility = data.reduce((acc, item) => {
//       acc[item.id] = item.isVisible; // Assuming each item has an `isVisible` field
//       return acc;
//     }, {});
//     setEyeVisibilityById(initialVisibility);
//   }, [data]);

//   const toggleVisibility = (id) => {
//     console.log(`Current visibility for ID ${id}: ${eyeVisibilityById[id]}`);

//     const updatedVisibility = !eyeVisibilityById[id];
//     console.log(`New visibility for ID ${id}: ${updatedVisibility}`);

//     const updatedEyeVisibilityById = {
//       ...eyeVisibilityById,
//       [id]: updatedVisibility,
//     };
//     setEyeVisibilityById(updatedEyeVisibilityById);

//     console.log("Updated eyeVisibilityById:", updatedEyeVisibilityById);
//   };

//   return (
//     <Table striped bordered hover responsive>
//       <thead>
//         <tr>
//           {columns.map((col) => (
//             <th key={col.key}>{col.label}</th>
//           ))}
//           <th>Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((item) => (
//           <tr key={item.id}>
//             {columns.map((col) => (
//               <td key={col.key}>
//                 {col.render ? col.render(item[col.key]) : item[col.key]}
//               </td>
//             ))}
//             <td>
//               <div className="d-flex">
//                 <Button className="ms-1" onClick={() => onEdit(item.id)}>
//                   <FaEdit />
//                 </Button>
//                 <Button className="ms-1" onClick={() => onDelete(item.id)}>
//                   <FaTrash />
//                 </Button>
//                 <Button
//                   className="ms-1"
//                   onClick={() => toggleVisibility(item.id)}
//                 >
//                   {eyeVisibilityById[item.id] ? <FaEyeSlash /> : <FaEye />}
//                 </Button>
//               </div>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </Table>
//   );
// };

// export default ReusableTable;












////s1
import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";

const ReusableTable = ({ columns, data, onEdit, onDelete, onShow }) => {
  const [eyeVisibilityById, setEyeVisibilityById] = useState({});

  useEffect(() => {
    const initialVisibility = data.reduce((acc, item) => {
      acc[item.id] = item.isVisible;
      return acc;
    }, {});
    setEyeVisibilityById(initialVisibility);
  }, [data]);

  const toggleVisibility = (id) => {
    const updatedVisibility = !eyeVisibilityById[id];
    const updatedEyeVisibilityById = {
      ...eyeVisibilityById,
      [id]: updatedVisibility,
    };
    setEyeVisibilityById(updatedEyeVisibilityById);
    onShow(id, updatedVisibility);
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
                  onClick={() => toggleVisibility(item.id)}
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

export default ReusableTable;

















////tst hide and show functionality for eye
// import React, { useState } from "react";
// import { Button, Table } from "react-bootstrap";
// import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";

// const ReusableTable = ({ columns, data, onEdit, onDelete, onShow }) => {
//   const initialVisibility = data.reduce((acc, item) => {
//     acc[item.id] = true;
//     return acc;
//   }, {});

//   const [eyeVisibilityById, setEyeVisibilityById] = useState(initialVisibility);

//   const toggleVisibility = (id) => {
//     const updatedEyeVisibilityById = {
//       ...eyeVisibilityById,
//       [id]: !eyeVisibilityById[id],
//     };
//     setEyeVisibilityById(updatedEyeVisibilityById);
//     onShow(id, updatedEyeVisibilityById[id]);
//   };

//   return (
//     <Table striped bordered hover responsive>
//       <thead>
//         <tr>
//           <th>#</th>
//           {columns.map((col) => (
//             <th key={col.key}>{col.label}</th>
//           ))}
//           <th>Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((item, index) => (
//           <tr key={item.id}>
//             <td>{index + 1}</td>
//             {columns.map((col) => (
//               <td key={col.key}>
//                 {eyeVisibilityById[item.id] ? item[col.key] : "******"}
//               </td>
//             ))}
//             <td>
//               <div className="d-flex">
//                 <Button className="ms-1" onClick={() => onEdit(item.id)}>
//                   <FaEdit />
//                 </Button>
//                 <Button className="ms-1" onClick={() => onDelete(item.id)}>
//                   <FaTrash />
//                 </Button>
//                 <Button
//                   className="ms-1"
//                   onClick={() => toggleVisibility(item.id)}
//                 >
//                   {eyeVisibilityById[item.id] ?<FaEye /> :  <FaEyeSlash /> }
//                 </Button>
//               </div>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </Table>
//   );
// };

// export default ReusableTable;
