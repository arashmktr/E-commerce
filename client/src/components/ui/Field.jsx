// برچسب و ورودی را به هم وصل می‌کند: <Field label="نام"><input className="input" /></Field>
const Field = ({ label, error, hint, className = '', children }) => (
  <label className={`field ${className}`}>
    <span>{label}</span>
    {children}
    {hint && !error && <small className="field__hint">{hint}</small>}
    {error && <small className="field__error">{error}</small>}
  </label>
);

export default Field;
