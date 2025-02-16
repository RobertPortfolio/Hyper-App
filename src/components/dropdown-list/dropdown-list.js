import React from "react";

const DropdownList = ({ id, name, value, options, label, error, onChange, required }) => {

    const getClassNames = () =>
        `form-control input-custom text-light rounded-0 ${error ? 'is-invalid' : ''} select-with-arrow`;

    return (
        <div className="form-group mb-3">
            {label && (
                <label htmlFor={id} className="text-light mb-1">
                    {label}
                </label>
            )}
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className={getClassNames()}
                required={required}
            >
                <option value="" disabled hidden></option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.ruName}
                    </option>
                ))}
            </select>
            {error && <div className="text-danger mt-1">{error}</div>}
        </div>
    )
}

export default DropdownList;