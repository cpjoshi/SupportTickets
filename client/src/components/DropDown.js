import React from 'react';

function DropDown(props) {
  const { options, onChange, key } = props;

  return (
    <select id={key} onChange={onChange} >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default DropDown;
