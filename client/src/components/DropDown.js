import React from 'react';

function DropDown(props) {
  const { options, onChange, idKey} = props;

  return (
    <select id={idKey} onChange={onChange} defaultValue="Select an option">
      <option disabled>Select an option</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default DropDown;
