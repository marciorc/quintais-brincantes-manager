const React = require('react');

module.exports = ({ record, property }) => {
  const date = record.params[property.name];
  return React.createElement('span', null, date || '-');
};