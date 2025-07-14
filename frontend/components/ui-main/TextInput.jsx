import React from "react";

const TextInput = ({
  label,
  type = 'text',
  name,
  placeholder,
  required,
  classname,
  error,
  register
}) => {
  return (
    <div className="">
      {label && (
        <label htmlFor={name} className={`${classname}`}>
          {" "}
          {label} {required && <span className="text-red-500"> *</span>}{" "}
        </label> 
      )}
      <div className="mt-1 p-2 px-2">
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          className={`border ${classname}`}
          {...(register ? register(name) : {})}
        />
      </div>

      {
        error && (
            <div className="mt-2 text-red-500 text-sm">
                {error.message}
            </div>
        )
      }
    </div>
  );
};

export default TextInput;
