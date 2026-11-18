import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helper?: string;
}

export function Input({ label, error, helper, id, ...props }: InputProps) {
  const inputId = id ?? `input-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className="form-field">
      <label htmlFor={inputId} className="form-field__label">
        {label}
        {props.required && <span className="form-field__required" aria-hidden="true"> *</span>}
      </label>
      <input id={inputId} className={`form-field__input${error ? " form-field__input--error" : ""}`} aria-invalid={!!error} aria-describedby={`${inputId}-error${helper ? ` ${inputId}-helper` : ""}`} {...props} />
      {error && <span id={`${inputId}-error`} className="form-field__error" role="alert">{error}</span>}
      {helper && !error && <span id={`${inputId}-helper`} className="form-field__helper">{helper}</span>}
    </div>
  );
}
