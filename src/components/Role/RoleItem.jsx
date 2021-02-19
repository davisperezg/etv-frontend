import React from "react";

export const RoleItem = ({ role }) => {
  return (
    <>
      <option value={role.name}>{role.name}</option>
    </>
  );
};
