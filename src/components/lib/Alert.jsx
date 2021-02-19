import React from "react";

export const AlertError = ({ message }) => {
  return (
    <div className="block pl-2 font-semibold text-xl self-start text-red-500">
      <h2 className="leading-relaxed">{message.title}</h2>
      <p className="text-sm text-red-600 font-normal leading-relaxed">
        <li>{message.message}</li>
      </p>
    </div>
  );
};

export const AlertSuccess = ({ message }) => {
  return (
    <div className="block pl-2 font-semibold text-xl self-start text-green-500">
      <h2 className="leading-relaxed">{message.title}</h2>
      <p className="text-sm text-green-600 font-normal leading-relaxed">
        <li>{message.message}</li>
      </p>
    </div>
  );
};
