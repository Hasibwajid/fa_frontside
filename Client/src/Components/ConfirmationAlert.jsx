import React from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const ConfirmationAlert = (props) => {
    const { title, message, onConfirm } = props;
  
    const showConfirmation = () => {
      confirmAlert({
        title: title || "Confirmation",
        message: message || "Are you sure?",
        buttons: [
          {
            label: "Yes",
            onClick: onConfirm,
          },
          {
            label: "No",
            onClick: () => {}, // Do nothing if the user clicks "No"
          },
        ],
      });
    };
  
    // Call the showConfirmation function to show the dialog
    showConfirmation();
  
    return null; // Return null as the component doesn't render anything
  };
  
  export default ConfirmationAlert;