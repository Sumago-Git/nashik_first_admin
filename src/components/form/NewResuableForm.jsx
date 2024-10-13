
// // //  sir form
// import React, { useState, useEffect } from "react";
// import { Form } from "react-bootstrap";
// import JoditEditor from 'jodit-react'; // Import JoditEditor
// const NewReusableForm = ({
//   label,
//   name,
//   placeholder,
//   type,
//   textarea,
//   min,
//   max,
//   step,
//   onChange,
//   initialData,
// }) => {
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     setFormData(initialData || {});
//   }, [initialData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     if (onChange) {
//       onChange(name, value);
//     }
//   };

//   return (
   
//       <Form.Group className="mb-3" controlId={`form${name}`}>
//         <Form.Label>{label}</Form.Label>
//         {type === "file" ? (
//           <Form.Control
//             type="file"
//             name={name}
//             onChange={handleChange}
//             placeholder={placeholder}
//             accept="image/*"
//           />
//         ) : (
//           <Form.Control
//             type={type}
//             name={name}
//             value={formData[name] || ""}
//             onChange={handleChange}
//             placeholder={placeholder}
//             min={min}
//             max={max}
//             step={step}
//             as={textarea ? "textarea" : undefined}
//           />
//         )}
//       </Form.Group>
  
//   );
// };

// export default NewReusableForm;













//////////  sos 
// import React, { useState, useEffect } from "react";
// import { Form } from "react-bootstrap";
// import JoditEditor from "jodit-react";

// const NewReusableForm = ({
//   label,
//   name,
//   placeholder,
//   type,
//   textarea,
//   useJodit, // use this editor as prop
//   onChange,
//   initialData,
// }) => {
//   const [value, setValue] = useState(initialData[name] || "");

//   useEffect(() => {
//     setValue(initialData[name] || "");
//   }, [initialData, name]);

//   const handleChange = (e) => {
//     const { value, files } = e.target;
//     setValue(type === "file" ? files[0] : value);
//     onChange(name, type === "file" ? files[0] : value);
//   };

//   return (
  
//     <Form.Group>
//     <Form.Label>{label}</Form.Label>



//       {type === "file" ? (
//         <Form.Control
//           type={type}
//           accept="image/*,.pdf,.doc,.docx" 
//           onChange={handleChange}
//           required
//         />
//     ) : useJodit ? (
//       <JoditEditor
//         value={value}
//         onChange={(newContent) => {
//           setValue(newContent);
//           onChange(name, newContent);
//         }}
//       />
//     ) : textarea ? ( 
//       <Form.Control
//         as="textarea"
//         placeholder={placeholder}
//         value={value}
//         onChange={handleChange}
//         required
//       />
//     ) : (
//       <Form.Control
//         type={type}
//         placeholder={placeholder}
//         value={value}
//         onChange={handleChange}
//         required
//       />
//     )}
//   </Form.Group>
//   );
// };

// export default NewReusableForm;









////sos final

// import React, { useState, useEffect } from "react";
// import { Form } from "react-bootstrap";
// import JoditEditor from "jodit-react";

// const NewReusableForm = ({
//   label,
//   name,
//   placeholder,
//   type,
//   textarea,
//   useJodit,
//   onChange,
//   initialData,
//   error,
//   imageDimensiion 
// }) => {
//   const [value, setValue] = useState(initialData[name] || "");

//   useEffect(() => {
//     setValue(initialData[name] || "");
//   }, [initialData, name]);

//   const handleChange = (e) => {
//     const { value, files } = e.target;
//     setValue(type === "file" ? files[0] : value);
//     onChange(name, type === "file" ? files[0] : value);
//   };

//   const handleEditorChange = (newContent) => {
//     setValue(newContent);
//     onChange(name, newContent);
//   };

//   return (
//     <Form.Group>
//       <Form.Label>{label}</Form.Label>
    
//       {imageDimensiion && (
//           <span className="form-text text-danger ms-2">
//             ({imageDimensiion})
//           </span>
//         )}
//       {type === "file" ? (
//         <>
//           <Form.Control
//             type={type}
//             accept="image/*,.pdf,.doc,.docx"
//             onChange={handleChange}
//             isInvalid={!!error} // shows error if any
//           />
//           {error && <div className="invalid-feedback d-block">{error}</div>}
//         </>
//       ) : useJodit ? (
//         <>
//           <JoditEditor
//             value={value}
//             onChange={handleEditorChange}
//           />
//           {error && <div className="invalid-feedback d-block">{error}</div>}
//         </>
//       ) : textarea ? (
//         <>
//           <Form.Control
//             as="textarea"
//             placeholder={placeholder}
//             value={value}
//             onChange={handleChange}
//             isInvalid={!!error} // shows error if any
//           />
//           {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
//         </>
//       ) : (
//         <>
//           <Form.Control
//             type={type}
//             placeholder={placeholder}
//             value={value}
//             onChange={handleChange}
//             isInvalid={!!error} // shows error if any
//           />
//           {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
//         </>
//       )}
//     </Form.Group>
//   );
// };

// export default NewReusableForm;

















////
import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import JoditEditor from "jodit-react";

const NewReusableForm = ({
  label,
  name,
  placeholder,
  type,
  textarea,
  useJodit,
  onChange,
  initialData,
  error,
  imageDimensiion,
  charLimit,
  onSubmit,
}) => {
  const [value, setValue] = useState(initialData[name] || "");
  const [charError, setCharError] = useState("");

  useEffect(() => {
    setValue(initialData[name] || "");
  }, [initialData, name]);

  const handleChange = (e) => {
    const { value, files } = e.target;
    const newValue = type === "file" ? files[0] : value;

    if (charLimit && newValue.length > charLimit) {
      setCharError(`Character limit of ${charLimit} exceeded`);
    } else {
      setCharError("");
      setValue(newValue);
      onChange(name, newValue);
    }
  };

  const handleEditorChange = (newContent) => {
    if (charLimit && newContent.length > charLimit) {
      setCharError(`Character limit of ${charLimit} exceeded`);
    } else {
      setCharError("");
      setValue(newContent);
      onChange(name, newContent);
    }
  };

  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      {imageDimensiion && (
        <span className="form-text text-danger ms-2">
          ({imageDimensiion})
        </span>
      )}
      {charLimit && (
        <span className="form-text text-danger ms-2">
          (Max {charLimit} characters)
        </span>
      )}
      {type === "file" ? (
        <>
          <Form.Control
            type={type}
            accept="image/*,.pdf,.doc,.docx, video/*"
            onChange={handleChange}
            isInvalid={!!error || !!charError}
          />
          {(error || charError) && (
            <div className="invalid-feedback d-block">
              {error || charError}
            </div>
          )}
        </>
      ) : useJodit ? (
        <>
          <JoditEditor
            value={value}
            onChange={handleEditorChange}
          />
          {(error || charError) && (
            <div className="invalid-feedback d-block">
              {error || charError}
            </div>
          )}
          {charLimit && (
            <div className="text-muted">
              {value.length}/{charLimit}
            </div>
          )}
        </>
      ) : textarea ? (
        <>
          <Form.Control
            as="textarea"
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            isInvalid={!!error || !!charError}
          />
          {charLimit && (
            <div className="text-muted">
              {value.length}/{charLimit}
            </div>
          )}
          {(error || charError) && (
            <Form.Control.Feedback type="invalid">
              {error || charError}
            </Form.Control.Feedback>
          )}
        </>
      ) : (
        <>
          <Form.Control
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            isInvalid={!!error || !!charError}
          />
          {charLimit && (
            <div className="text-muted">
              {value.length}/{charLimit}
            </div>
          )}
          {(error || charError) && (
            <Form.Control.Feedback type="invalid">
              {error || charError}
            </Form.Control.Feedback>
          )}
        </>
      )}
    </Form.Group>
  );
};

export default NewReusableForm;


