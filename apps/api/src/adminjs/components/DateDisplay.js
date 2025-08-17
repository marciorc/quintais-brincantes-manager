const React = require('react');
const moment = require('moment');

module.exports = function DateDisplay({ record, property }) {
  const date = record.params[property.name];
  return React.createElement('span', null, date ? moment(date).format('DD/MM/YYYY') : '-');
};