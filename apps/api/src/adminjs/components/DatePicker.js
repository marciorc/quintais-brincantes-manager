const React = require('react');
const { DatePicker } = require('antd');
const moment = require('moment');

module.exports = function DatePickerComponent(props) {
  const { property, record, onChange } = props;
  
  const handleChange = (date) => {
    onChange(property.name, date ? date.format('YYYY-MM-DD') : null);
  };

  return (
    React.createElement(DatePicker, {
      format: "DD/MM/YYYY",
      value: record.params[property.name] ? moment(record.params[property.name]) : null,
      onChange: handleChange,
      style: { width: '100%' }
    })
  );
};