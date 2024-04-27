import React from "react";
import "../Proposals.css";
const HelpSection = ({ onClose }) => {
  return (
    <div className="help-section">
      <h3 style={{ color: "#0056b3" }}>Help</h3>
      <div className="help-desc">
        <span className="help-title">Active Proposals: </span>
        You have been allocated or are actively engaged in work for these projects. You are currently in the process of discussing and collaborating with the client. Best of luck with your ongoing proposals!
      </div>
      <div className="help-desc">
        <span className="help-title">Submitted Proposals: </span>
        Proposals you've sent to potential clients for projects you're
        interested in. Awaiting client response.
      </div>

      <div className="help-desc">
        <span className="help-title">Offers: </span>
        These are proposals that have been sent to you by clients who are interested in your services. You have received an offer for the job, and you can decide whether to accept or decline it.
      </div>

      <button className="btnClose" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default HelpSection;
