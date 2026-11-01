import { ORDER_STATUS } from '../../utils/constants.js';

const TONE_CLASS = { warn: 'badge--warn', ok: 'badge--ok', danger: 'badge--danger', info: '' };

const StatusBadge = ({ status }) => {
  const { label, tone } = ORDER_STATUS[status] ?? { label: status, tone: 'info' };
  return <span className={`badge ${TONE_CLASS[tone]}`}>{label}</span>;
};

export default StatusBadge;
