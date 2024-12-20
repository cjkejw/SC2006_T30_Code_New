import React, { useState, FormEvent, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext';
import './signup.css'

interface Errors {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

const Signup: React.FC = () => {
  useEffect(() => {
    document.title = "Sign Up";
  }, []);

  const { login } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const validateFields = () => {
    let validationErrors: Errors = {};

    // Email validation
    if (!email) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = 'Email is invalid';
    }

    // First name validation
    if (!firstName) {
      validationErrors.firstName = 'First name is required';
    }

    // Last name validation
    if (!lastName) {
      validationErrors.lastName = 'Last name is required';
    }

    // Password validation
    if (!password) {
      validationErrors.password = 'Password is required';
    } else if (password.length < 8) {
      validationErrors.password = 'Password must be at least 8 characters long.';
    } else if (!/[A-Z]/.test(password)) {
        validationErrors.password = 'Password must contain at least 1 uppercase letter.';
    } else if (!/[a-z]/.test(password)) {
        validationErrors.password = 'Password must contain at least 1 lowercase letter.';
    } else if (!/[0-9]/.test(password)) {
        validationErrors.password = 'Password must contain at least 1 number.';
    }

    // Confirm password validation
    if (!confirmPassword) {
      validationErrors.confirmPassword = 'Confirmation password is required';
    } else if (confirmPassword !== password) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    return validationErrors;
  };

  useEffect(() => {
    if (isSubmitted) {
      const validationErrors = validateFields();
      setErrors(validationErrors);
    }
  }, [email, firstName, lastName, password, confirmPassword, isSubmitted]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    // Check for validation errors before submitting
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Prevent form submission
    }

    try {
      const response = await axios.post('http://localhost:5073/account/register', {
          // Must match the names in backend usually is caps, in this case the lower case is the var in typescript
          Email: email, 
          FirstName: firstName,
          LastName: lastName,
          Password: password,
          ConfirmPassword: confirmPassword,
      });

      console.log('Sign up successful:', response.data); 
      // store token that would be used for authorization for other routes
      localStorage.setItem('token', response.data.token);
      login(response.data.token);
      setSignUpError(null);
      setShouldNavigate(true);
    } 
    catch (error) {
      if (axios.isAxiosError(error))
      {
        if (error.response && error.response.status == 401){
          setSignUpError(error.response.data);
        }
        else
        {
          console.error('There was an error during sign up:', error);
        }
      }
    }
    
    console.log('Form submitted:', { email, firstName, lastName, password, confirmPassword });
  };

  if (shouldNavigate) {
    return <Navigate to="/" />;
  }

  return (
    <div className="signup-wrapper">
      <div className="information-wrapper">
        <div className="books-pile-image">
          <img src="../../assets/books-pile.png" alt="books-pile" />
        </div>
        <ul className="signup-list">
          <li>All-in-one information</li>
          <li>
            Find the&nbsp;<span className="signup-font2"><b>MOST SUITABLE</b></span>&nbsp;school
          </li>
          <li>Not sure which school?</li>
          <div className="signup-font2">
            <b>COMPARE!</b>
          </div>
          <div className="signup-font3">
            <div className="signup-font1">Sign up&nbsp;<div className="signup-font2">NOW</div>&nbsp;for&nbsp;<div className="signup-font2">FREE</div>!</div>
          </div>
        </ul>
      </div>
      <div className="form-wrapper">
        <div className="signup-header">
          <b>Sign Up</b>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error">{errors.email}</p>}
          
          <div className="name-fields-wrapper">
            <div className="name-field">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstName && <p className="error">{errors.firstName}</p>}
            </div>

            <div className="name-field">
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastName && <p className="error">{errors.lastName}</p>}
            </div>
          </div>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              id="terms"
              required
            />
            <label htmlFor="terms" className="label">
              I have read and agreed to the&nbsp;
              <Link to ="/terms-condition" className="terms-link" target="_blank" rel="noopener noreferrer">
                Terms & Conditions
              </Link>.
            </label>
          </div>
          {errors.terms && <p className="error">{errors.terms}</p>}

          {signUpError && <p className="error">{signUpError}</p>}

          <button type="submit">CONFIRM</button>

          <div className="signin-link">
            Already have an account? <Link to="/signin">Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;