import React, { useState, FormEvent, useEffect } from 'react'
import './resetpassword.css'
import '../signup/signup.css'

const Resetpassword: React.FC = () => {
    const [newpassword, setNewPassword] = useState<string>('');
    const [confirmpassword, setConfirmPassword] = useState<string>('');
    const [errors, setErrors] = useState<{ newpassword?: string; confirmpassword?: string }>({});
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const validateFields = () => {
        let validationErrors: { newpassword?: string; confirmpassword?: string; } = {};

        // New Passowrd validation
        if (!newpassword) {
          validationErrors.newpassword = 'Password is required';
        } else if (newpassword.length < 8) {
          validationErrors.newpassword = 'Password must be at least 8 characters long.';
        } else if (!/[A-Z]/.test(newpassword)) {
          validationErrors.newpassword = 'Password must contain at least 1 uppercase letter.';
        } else if (!/[a-z]/.test(newpassword)) {
          validationErrors.newpassword = 'Password must contain at least 1 lowercase letter.';
        } else if (!/[0-9]/.test(newpassword)) {
          validationErrors.newpassword = 'Password must contain at least 1 number.';
        }

        // Confirm Passowrd validation
        if (!confirmpassword) {
          validationErrors.confirmpassword = 'Password is required';
        } else if (confirmpassword != newpassword){
          validationErrors.confirmpassword = "Password does not match."
        }

        return validationErrors;
    };

    useEffect(() => {
      if (isSubmitted) {
        const validationErrors = validateFields();
        setErrors(validationErrors);
      }
    }, [newpassword, confirmpassword]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitted(true);
      
      // Check for validation errors before submitting
      const validationErrors = validateFields();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return; // Prevent form submission
      }
  
      // If validation passes, submit the form (e.g., call an API)
      console.log('Form submitted:', { newpassword, confirmpassword });
      setIsSuccess(true); 
    };

    return(
      <div className="resetpwd-wrapper">
        {isSuccess ? (
          <div>
            <div className="resetpwd-header">
              Reset Your Password
            </div>
            <div className="success-font">
              🎉<br></br>Success! :D
            </div>
          </div>
        ) : (
          <>
            <div className="resetpwd-header">
              Reset Your Password
            </div>
            <div className="resetpwd-info">
              Passwords must be at least 8 characters, consisting of at least<br></br>
              1 upper case character, 1 lower case character, and 1 number.
            </div>
            <form onSubmit={handleSubmit}>
              <input type="newpassword"
                placeholder="New Password"
                value={newpassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {errors.newpassword && <p className="error">{errors.newpassword}</p>}

              <input type="confirmpassword"
              placeholder="Confirm Password"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmpassword && <p className="error">{errors.confirmpassword}</p>}

              <div className="button">
                <button type="submit">CONFIRM</button> {/*Call backend perform validation/storage*/}
              </div>
            </form>
          </>
        )}
      </div>
    );
}

export default Resetpassword;