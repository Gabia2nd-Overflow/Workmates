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
        <label className="input-label">
          {label}
        </label>
      )}

      <input
        ref={ref}  // ✅ react-hook-form 연결 핵심
        className={cn(
          'input',
          error && 'input--error',
          className
        )}
        {...props}
      />
      {error && (
        <p className="input-help input-help--error">{error}</p>
      )}
    </div>
  );
});

export default Input;
