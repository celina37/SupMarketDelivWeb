import '~css/style.css';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const TextInput = forwardRef(
  ({ label, type = 'text', className = '', isFocused = false, labelStyle = {}, options = [], ...props }, ref) => {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
      focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
      if (isFocused) {
        localRef.current?.focus();
      }
    }, [isFocused]);

    // Render radio buttons if 'type' is 'radio'
    if (type === 'radio') {
      return (
        <div className="input-group">
          {label && (
            <label className="input-label" style={labelStyle}>
              {label}
            </label>
          )}
          <div className="radio-buttons">
            {options.map((option, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name={props.name}
                  value={option.value}
                  checked={props.value === option.value}
                  onChange={props.onChange}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      );
    }

    // Default text input rendering
    return (
      <div className="input-group">
        {label && (
          <label className="input-label" style={labelStyle}>
            {label}
          </label>
        )}
        <input
          {...props}
          type={type}
          className={`custom-input ${className}`}
          ref={localRef}
        />
      </div>
    );
  }
);

export default TextInput;
