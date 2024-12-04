import React, { useState, useEffect } from "react";

const DynamicForm = () => {
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [selectedForm, setSelectedForm] = useState("personal");
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0); 
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); 
  const [saveMessage, setSaveMessage] = useState(""); 
  const [fieldMessages, setFieldMessages] = useState({});
  const [errorMessage, setErrorMessage] = useState(""); 

  
  const apiResponses = {
    personal: {
      fields: [
        { name: "firstName", type: "text", label: "First Name", required: true },
        { name: "lastName", type: "text", label: "Last Name", required: true },
        { name: "age", type: "number", label: "Age", required: false },
      ],
    },
    address: {
      fields: [
        { name: "street", type: "text", label: "Street", required: true },
        { name: "city", type: "text", label: "City", required: true },
        {
          name: "state",
          type: "dropdown",
          label: "State",
          options: ["California", "Texas", "New York"],
          required: true,
        },
        { name: "zipCode", type: "text", label: "Zip Code", required: false },
      ],
    },
    payment: {
      fields: [
        { name: "cardNumber", type: "text", label: "Card Number", required: true },
        { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
        { name: "cvv", type: "password", label: "CVV", required: true },
        { name: "cardholderName", type: "text", label: "Cardholder Name", required: true },
      ],
    },
  };

  
  useEffect(() => {
    const fetchFormFields = async () => {
      try {
        const response = apiResponses[selectedForm];
        if (response) {
          setFormFields(response.fields);
          setErrorMessage(""); 
        } else {
          throw new Error("Failed to load form structure.");
        }
      } catch (error) {
        setErrorMessage("Failed to load the form structure. Please try again.");
        console.error(error);
      }
    };

    fetchFormFields();
  }, [selectedForm]);

  
  useEffect(() => {
    const filledFields = Object.values(formData).filter((value) => value !== "").length;
    const totalFields = formFields.length;
    setProgress((filledFields / totalFields) * 100);
  }, [formData, formFields]);

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsFormSubmitted(true); 
    setShowModal(true); 
  };

  // Handle Save for each section
  const handleSave = () => {
    const saveMessage =
      selectedForm === "personal" ? "Saved Personal Data" : selectedForm === "address" ? "Saved Address Data" : "";
    setSaveMessage(saveMessage);
    setTimeout(() => {
      setSaveMessage(""); 
    }, 3000);
  };

  
  const handleNext = () => {
    if (selectedForm === "personal") {
      setSelectedForm("address");
    } else if (selectedForm === "address") {
      setSelectedForm("payment");
    }
  };

  
  const handleCloseModal = () => {
    setShowModal(false);
  };

  
  const handleDelete = (key) => {
    const newFormData = { ...formData };
    delete newFormData[key];
    setFormData(newFormData);

    setFieldMessages((prevMessages) => ({
      ...prevMessages,
      [key]: `Field "${key}" has been deleted.`,
    }));

    
    setTimeout(() => {
      setFieldMessages((prevMessages) => {
        const { [key]: _, ...rest } = prevMessages; 
        return rest;
      });
    }, 3000);
  };


  
  const handleEdit = (key) => {
    const fieldToEdit = document.getElementById(key);
    if (fieldToEdit) {
      fieldToEdit.focus();
      setFieldMessages((prevMessages) => ({
        ...prevMessages,
        [key]: `Field "${key}" is now editable.`,
      }));
      setTimeout(() => {
        setFieldMessages((prevMessages) => {
          const { [key]: _, ...rest } = prevMessages; 
          return rest;
        });
      }, 3000); 
    }
  };

  return (
    <div className="container">
      <h2>Dynamic Form</h2>

      
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="form-selector">
        <label htmlFor="formType">Select Form Type: </label>
        <select
          id="formType"
          value={selectedForm}
          onChange={(e) => setSelectedForm(e.target.value)}
        >
          <option value="personal">Personal Info</option>
          <option value="address">Address</option>
          <option value="payment">Payment Info</option>
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        {formFields.map((field) => (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name}>{field.label}</label>
            {field.type === "text" || field.type === "number" || field.type === "date" || field.type === "password" ? (
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                required={field.required}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
              />
            ) : field.type === "dropdown" ? (
              <select
                id={field.name}
                name={field.name}
                required={field.required}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
              >
                <option value="">Select {field.label}</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
        ))}

        {selectedForm !== "payment" && (
          <>
            <button type="button" onClick={handleSave}>Save</button>
            <button type="button" onClick={handleNext}>Next</button>
          </>
        )}
        {selectedForm === "payment" && (
          <button type="submit">Submit</button>
        )}
      </form>

      
      {saveMessage && <div className="save-message">{saveMessage}</div>}

      
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Sign Up Successful</h3>
            <p>Your form has been successfully submitted!</p>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
      <hr style={{ marginTop: '20px', height: '3px', background: 'black' }} />

      
      {showModal === false && isFormSubmitted && (
        <div className="data-table">

          <h3>Form Data:</h3>
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(formData).map(([key, value]) => (
                <React.Fragment key={key}>
                  <tr>
                    <td><strong>{key}</strong></td>
                    <td>
                      <input
                        id={key}
                        name={key}
                        value={formData[key]}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleDelete(key)}>Delete</button>
                      <button onClick={() => handleEdit(key)}>Edit</button>
                    </td>
                  </tr>
                  
                  {fieldMessages[key] && (
                    <tr>
                      <td colSpan="3">
                        <div className="field-message">{fieldMessages[key]}</div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <button onClick={handleSubmit} style={{ marginTop: '10px' }}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default DynamicForm;
