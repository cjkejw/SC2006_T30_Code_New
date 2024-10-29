import './signin.css';
import '../signup/signup.css';
import React, { useState, FormEvent, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';


const Signin: React.FC = () => {
  useEffect(() => {
    document.title = "Sign In";
  }, []);

  const { login } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitted(true);
    
    // Validate fields
    const validationErrors = validateFields();
    setErrors(validationErrors);

    // If there are validation errors, exit the function
    if (Object.keys(validationErrors).length > 0) {
      return; // Prevent form submission
    }

    try {
      const response = await axios.post('http://localhost:5073/account/login', {
          // Must match the names in backend usually is caps, in this case the lower case is the var in typescript
          Email: email, 
          Password: password 
      });

      console.log('Login successful:', response.data); 
      // Clear the existing token, if any
      localStorage.removeItem('token');
      // store token that would be used for authorization for other routes
      localStorage.setItem('token', response.data.token);
      login(response.data.token);
      localStorage.setItem('firstName', response.data.firstName);
      localStorage.setItem('lastName', response.data.lastName);
      setLoginError(null);
      setShouldNavigate(true);
    } 
  catch (error) {
      if (axios.isAxiosError(error))
      {
        if (error.response && error.response.status == 401)
          // set login error as the error returned from backend
          setLoginError(error.response.data); 
        else
        {
          console.error('There was an error during login:', error);
        }
      }
    }
  };

if (shouldNavigate) {
    return <Navigate to="/" />;
  }

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

        {/* This would display the error on the UI  */}
        {loginError && <p className="error">{loginError}</p>}

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
