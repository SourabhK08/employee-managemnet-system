import React from "react";

const SelectInput = ({
  label,
  options,
  value,
  onChange,
  className,
  placeholder = "Select...",
}) => {
  return (
    <div className="mt-4 m-2">
      {label && (
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          {label}
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
    </div>
  );
};

export default SelectInput;
