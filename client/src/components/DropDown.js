import React from 'react';

function DropDown(props) {
  const { options, onChange, id } = props;

  return (
    <select id={id} onChange={onChange} >
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default DropDown;
