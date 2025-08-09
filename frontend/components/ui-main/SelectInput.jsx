import React from "react";

const SelectInput = ({
  label,
  options,
  value,
  required,
  onChange,
  className,
  error,
  placeholder = "Select...",
}) => {
  return (
    <div className="mt-4 m-2">
      {label && (
        <label
          className="font-semibold"
          style={{ display: "block", marginBottom: "0.5rem" }}
        >
          {label} {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${className} p-[0.6rem] w-full rounded-md border`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <div className="mt-1 text-red-500 text-sm">{error.message}</div>
      )}
    </div>
  );
};

export default SelectInput;

/*

import Select from 'react-select';

const SelectInput = ({ label, options, value, onChange, required, error }) => {
  return (
    <div className="mt-4 m-2">
      {label && (
        <label className="font-semibold block mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Select
        value={options.find(option => option.id === value)}
        onChange={(selectedOption) => onChange(selectedOption?.id || "")}
        options={options.map((option) => ({
          value: option.id,
          label: option.label,
        }))}
        placeholder="Select..."
      />
      {error && <div className="mt-1 text-red-500 text-sm">{error.message}</div>}
    </div>
  );
};
*/
