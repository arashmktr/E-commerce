const ErrorMessage = ({ message, onRetry }) => (
  <div className="state-box" role="alert">
    <h3>دریافت اطلاعات انجام نشد</h3>
    <p>{message}</p>
    {onRetry && (
      <button type="button" className="btn btn-outline" onClick={onRetry} style={{ marginTop: '1rem' }}>
        تلاش دوباره
      </button>
    )}
  </div>
);

export default ErrorMessage;
