import React from "react";

export const PlanItem = ({ plan }) => {
  return (
    <>
      <option value={plan.name}>{plan.name}</option>
    </>
  );
};
