import { useState } from 'react';

export const useFormValidation = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      onSubmit(values, () => setIsSubmitting(false));
    }
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleSubmit
  };
};

export default useFormValidation;
