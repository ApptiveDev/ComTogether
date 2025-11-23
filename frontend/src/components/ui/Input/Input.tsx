import React, { forwardRef } from "react";
import styles from "./input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
  helperText?: string;
  variant?: "default" | "filled";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      variant = "default",
      leftIcon,
      rightIcon,
      className = "",
      ...props
    },
    ref
  ) => {
    const inputClass = [
      styles.input,
      styles[variant],
      error && styles.error,
      leftIcon && styles.hasLeftIcon,
      rightIcon && styles.hasRightIcon,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={styles.container}>
        {label && (
          <label className={styles.label} htmlFor={props.id}>
            {label}
          </label>
        )}
        <div className={styles.inputWrapper}>
          {leftIcon && <div className={styles.leftIcon}>{leftIcon}</div>}
          <input ref={ref} className={inputClass} {...props} />
          {rightIcon && <div className={styles.rightIcon}>{rightIcon}</div>}
        </div>
        {(error || helperText) && (
          <div className={error ? styles.errorText : styles.helperText}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
