import React, { useState, FormEvent, useEffect } from 'react'
import './forgetpassword.css'
import '../signup/signup.css'

const Forgetpassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const validateFields = () => {
    let validationErrors: { email?: string; } = {};
    // Email validation
    if (!email) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = 'Email is invalid';
    }
    return validationErrors;
  };

  useEffect(() => {
    if (isSubmitted) {
      const validationErrors = validateFields();
      setErrors(validationErrors);
    }
  }, [email, isSubmitted]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    // Validate fields
    const validationErrors = validateFields();
    setErrors(validationErrors);

    // If there are validation errors, exit the function
    if (Object.keys(validationErrors).length > 0) {
      return; // Prevent form submission
    }

    // If validation passes, submit the form (e.g., call an API)
    console.log('Form submitted:', { email });
  };

  return(
    <div className="forgetpwd-wrapper">
      <div className="forgetpwd-header">
        Forgot Your Password?
      </div>

      <div className="forgetpwd-info">
        Enter the email address registered to your account.<br></br>
        An e-mail will be sent to that address containing a link to<br></br>
        <div className="forgetpwd-info-purple">reset your password.</div>
      </div>

      <form onSubmit={handleSubmit}>
        <input type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="error">{errors.email}</p>}
      
        <div className="button">
          <button type="submit">CONFIRM</button> {/*Call backend perform sending of email*/}
        </div>
      </form>
    </div>
  );
}

export default Forgetpassword;