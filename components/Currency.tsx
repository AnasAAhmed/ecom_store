'use client';
import { useRegion } from '@/lib/hooks/useCart';

const Currency = ({className}:{className:string}) => {
  const { currency, setCurrency } = useRegion();
  const handleCurrencyChange = (e: any) => {
    setCurrency(e.target.value);
  };

  return (
    <div className={className}>
      <select
        name="currency"
        value={currency}
        onChange={handleCurrencyChange}
        className="p-1 cursor-pointer border sh-8 border-gray-300 rounded"
      >
        <option value="USD">USD</option>
        <option value="PKR">PKR</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="AUD">AUD</option>
      </select>
    </div>
  );
};

export default Currency;
