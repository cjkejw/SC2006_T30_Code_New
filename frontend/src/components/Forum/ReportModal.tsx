import React, { useState } from 'react';

interface ReportProps {
  onReport: (reason: string) => void;
  closeModal: () => void;
}

const ReportModal: React.FC<ReportProps> = ({ onReport, closeModal }) => {
  const [reportReason, setReportReason] = useState('');

  const handleReport = () => {
    if (reportReason) {
      onReport(reportReason);
      setReportReason(''); // Clear the reason
      closeModal(); // Close modal after reporting
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Report Post</h2>
        <textarea
          name="reportReason"
          placeholder="Reason for reporting"
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
        />
        <button onClick={handleReport}>Submit Report</button>
        <button className="close-btn" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ReportModal;
