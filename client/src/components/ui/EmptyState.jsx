import { Link } from 'react-router-dom';

const EmptyState = ({ title, text, actionLabel, actionTo }) => (
  <div className="state-box">
    <h3>{title}</h3>
    {text && <p>{text}</p>}
    {actionLabel && (
      <Link to={actionTo} className="btn btn-primary">
        {actionLabel}
      </Link>
    )}
  </div>
);

export default EmptyState;
