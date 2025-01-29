import React from "react";

const ErrorToast = ({ message, onClose }) => {
    return (
        <div
            className="position-fixed bottom-0 start-50 translate-middle-x bg-dark text-light p-3 rounded shadow border border-danger mb-3"
            style={{ zIndex: 1050, minWidth: "300px" }}
        >
            <div className="d-flex justify-content-between align-items-center">
                <div>{message}</div>
                <button
                    className="btn-close btn-close-white"
                    onClick={onClose}
                    aria-label="Close"
                ></button>
            </div>
        </div>
    );
};

export default ErrorToast;