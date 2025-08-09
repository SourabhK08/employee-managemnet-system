import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const SelectInputTwo = ({
  label,
  options,
  value,
  required,
  onChange,
  className,
  error,
  placeholder = "Select...",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef(null);
  const dropdownRef = useRef(null);

  // Filter options based on search term
  const filteredOptions =
    options?.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Get selected option for display
  const selectedOption = options?.find((option) => option.id === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle option selection
  const handleOptionSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Calculate dropdown position to ensure it opens downward
  const getDropdownStyle = () => {
    if (!selectRef.current || !isOpen) return {};

    const rect = selectRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = Math.min(200, filteredOptions.length * 40 + 40); // Approximate height

    // Always try to open downward first
    if (spaceBelow >= dropdownHeight) {
      return {
        top: "100%",
        maxHeight: "200px",
      };
    } else {
      // If not enough space below, open upward
      return {
        bottom: "100%",
        maxHeight: "200px",
      };
    }
  };

  return (
    <div className="mt-2 mx-2 sm:mt-4 sm:mx-2">
      {label && (
        <label className="block font-semibold text-gray-700 mb-2 text-sm sm:text-base">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative" ref={selectRef}>
        {/* Select Button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            ${className}
            w-full px-3 py-2.5 sm:py-3 
            text-left bg-white border rounded-md shadow-sm
            flex items-center justify-between
            transition-all duration-200
            text-sm sm:text-base
            ${
              disabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : "hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            }
            ${
              error
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300"
            }
            ${isOpen ? "ring-2 ring-blue-500 border-blue-500" : ""}
          `}
        >
          <span
            className={`block truncate ${
              selectedOption ? "text-gray-900" : "text-gray-500"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 z-50 bg-white border border-gray-300 rounded-md shadow-lg"
            style={getDropdownStyle()}
          >
            {/* Search Input */}
            {filteredOptions.length > 5 && (
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Options List */}
            <div className="max-h-40 sm:max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOptionSelect(option.id)}
                    className={`
                      w-full px-3 py-2 sm:py-2.5 text-left hover:bg-gray-50 
                      transition-colors duration-150 text-sm sm:text-base
                      ${
                        value === option.id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-900"
                      }
                    `}
                  >
                    <span className="block truncate">{option.label}</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  {searchTerm ? "No options found" : "No options available"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-1 text-red-500 text-xs sm:text-sm">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default SelectInputTwo;
