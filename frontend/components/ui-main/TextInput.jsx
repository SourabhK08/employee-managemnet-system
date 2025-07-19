import React from "react";

const TextInput = ({
  label,
  type = "text",
  name,
  placeholder,
  required,
  classname,
  error,
  register,
}) => {
  return (
    <div className="mt-4">
      {label && (
        <label htmlFor={name} className={` p-2 ${classname}`}>
          {" "}
          {label} {required && <span className="text-red-500"> *</span>}{" "}
        </label>
      )}
      <div className="p-2 px-2">
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          maxLength={name === "phone" ? 10 : undefined}
          className={`border p-2 w-full rounded-md ${classname} `}
          {...(register ? register(name) : {})}
        />
      </div>

      {error && (
        <div className="mt-1 text-red-500 text-sm px-2">{error.message}</div>
      )}
    </div>
  );
};

export default TextInput;
