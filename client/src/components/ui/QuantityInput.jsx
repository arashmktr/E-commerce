import { formatNumber } from '../../utils/format.js';

const QuantityInput = ({ value, max, onChange }) => (
  <div className="quantity">
    <button type="button" aria-label="کم کردن" disabled={value <= 1} onClick={() => onChange(value - 1)}>
      −
    </button>
    <output aria-live="polite">{formatNumber(value)}</output>
    <button type="button" aria-label="زیاد کردن" disabled={value >= max} onClick={() => onChange(value + 1)}>
      +
    </button>
  </div>
);

export default QuantityInput;
