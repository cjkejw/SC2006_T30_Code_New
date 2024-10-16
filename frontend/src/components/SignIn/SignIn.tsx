import './signin.css';
import '../signup/signup.css';
import React, { useState, FormEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Signin: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const validateFields = () => {
    let validationErrors: { email?: string; password?: string } = {};

    // Email validation
    if (!email) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!password) {
      validationErrors.password = 'Password is required';
    }

    return validationErrors;
  };

  useEffect(() => {
    if (isSubmitted) {
      const validationErrors = validateFields();
      setErrors(validationErrors);
    }
  }, [email, password, isSubmitted]);

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
    console.log('Form submitted:', { email, password });
  };

  return (
    <div className="signin-wrapper">
      <div className="grad-hat-image">
        <img src="../../assets/grad-hat.png" alt="grad-hat" />
      </div>
      <div className="login-font">
        <b>Login</b>
      </div>
      <form onSubmit={handleSubmit}>
        <input 
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input 
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <div className="button-container">
          <button type="submit">LOGIN</button>
        </div>
        <div className="links-container">
          <div className="forgotpwd-link">
            <Link to="/forgetpassword">Forgot Password</Link>
          </div>
          <div className="signup-link">
            <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Signin;
