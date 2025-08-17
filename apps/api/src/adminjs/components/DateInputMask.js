// apps/api/src/adminjs/components/DateInputMask.js
const React = require('react');
const InputMask = require('react-input-mask').default;

module.exports = (props) => {
  const { property, record, onChange } = props;
  
  const handleChange = (e) => {
    const value = e.target.value;
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '');
    
    // Aplica a máscara DD/MM/YYYY
    let maskedValue = '';
    if (digits.length > 0) maskedValue = digits.substring(0, 2);
    if (digits.length > 2) maskedValue += '/' + digits.substring(2, 4);
    if (digits.length > 4) maskedValue += '/' + digits.substring(4, 8);
    
    onChange(property.name, maskedValue);
  };

  return (
    React.createElement(InputMask, {
      mask: "99/99/9999",
      maskChar: null,
      alwaysShowMask: false,
      value: record.params[property.name] || '',
      onChange: handleChange,
      placeholder: "DD/MM/AAAA",
      className: "adminjs_TextInput",
      style: { padding: '8px 12px' }
    })
  );
};