
////final

// import React from "react";
// import { Button, Form, Row, Col } from "react-bootstrap";

// const SearchInput = ({ searchQuery, onSearch, onExport, showExportButton = true }) => {
//   return (
//     <Row className="align-items-center mb-3">
//       <Col md={{ span: 3, offset: 9 }} className="d-flex justify-content-end">
//         <Form.Control
//           type="text"
//           placeholder="Search"
//           value={searchQuery}
//           onChange={(e) => onSearch(e.target.value)}
//           className="mr-2" // Adds some space between the search box and the button
//         />
//         {showExportButton && (
//           <Button onClick={onExport} size="sm" className="ms-4">
//             Download
//           </Button>
//         )}
//       </Col>
//     </Row>
//   );
// };

// export default SearchInput;


import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";

// SearchInput.js
const SearchInput = ({ searchQuery, onSearch, onExport, showExportButton = true }) => {
  return (
    <Row className="align-items-center mb-3">
      <Col className="d-flex justify-content-end">
        <Form.Control
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          style={{ maxWidth: '300px' }} // Adjust the width as needed
        />
        {showExportButton && (
          <Button onClick={onExport} size="sm" className="ms-2">
            Download
          </Button>
        )}
      </Col>
    </Row>
  );
};

export default SearchInput;