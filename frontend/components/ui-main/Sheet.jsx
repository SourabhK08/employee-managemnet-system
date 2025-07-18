"use client";

import React from "react";
import { X } from "lucide-react";

const SheetDrawer = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = "md" 
}) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl"
  };

  if (!isOpen) return null;

  return (
    <>
    
      <div 
        className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      
      <div className={`fixed right-0 top-0 h-full ${sizeClasses[size]} w-full bg-gray-100 shadow-xl z-50 transform transition-transform duration-300 ease-in-out rounded-l-4xl`}>
      
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        
        <div className="p-4 overflow-y-auto h-full pb-20">
          {children}
        </div>
      </div>
    </>
  );
};

export default SheetDrawer;