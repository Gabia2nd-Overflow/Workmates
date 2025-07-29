import { forwardRef } from 'react';
import { cn } from '../utils/cn';

const Input = forwardRef(({ 
  label, //텍스트 라벨 
  error,  // 믄자열 에러메세지
  className = '', // 외부에서 전달되는 스타일 
  ...props  // placeholder, name, onChange 등의 속성.
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}  // ✅ react-hook-form 연결 핵심
        className={cn(
          'input',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

export default Input;
