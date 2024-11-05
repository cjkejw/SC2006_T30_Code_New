import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';


const CreatePost: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Create Post";
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title || !content) {
      setErrorMessage('Please provide both title and content for the post.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('You must be logged in to create a post.');
        navigate('/signin');
        return;
      }

      const response = await axios.post(
        'http://localhost:5073/post',
        { title, content },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Post created successfully:', response.data);
      navigate('/forum');
    } catch (error) {
      console.error('Error creating post:', error);
      setErrorMessage('An unexpected error occurred while creating the post.');
    }
  };

  return (
    <div className="create-post-container">
      <h1>Create a New Post</h1>

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="card-elements">
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input-field"
          />

          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            required
            className="input-field"
          />

          <button type="submit" className="submit-button">
            Submit Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;




// CreatePost.tsx
// import React, { useState } from 'react';
// import { TextField, Button, Container, Typography, Alert } from '@mui/material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const CreatePost: React.FC = () => {
//   // State variables for form fields and error messages
//   const [title, setTitle] = useState<string>('');
//   const [content, setContent] = useState<string>('');
//   const [errorMessage, setErrorMessage] = useState<string>('');
//   const navigate = useNavigate();

//   // Function to handle form submission
//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault(); // Prevent default form submission behavior

//     // Basic form validation
//     if (!title || !content) {
//       setErrorMessage('Please provide both title and content for the post.');
//       return;
//     }

//     try {
//       // Retrieve the JWT token from localStorage
//       const token = localStorage.getItem('token');

//       if (!token) {
//         // If no token is found, prompt the user to log in
//         setErrorMessage('You must be logged in to create a post.');
//         navigate('/signin'); // Adjust the route to your sign-in page
//         return;
//       }

//       // Make the POST request to the backend API
//       const response = await axios.post(
//         'http://localhost:5073/post', // Adjust the URL to match your backend endpoint
//         { title, content },
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`, // Include the JWT token
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       console.log('Post created successfully:', response.data);

//       // Redirect the user to the forum page or the post details page
//       navigate('/forum'); // Adjust the route as needed
//     } catch (error) {
//       console.error('Error creating post:', error);

//       // Handle errors and set an appropriate error message
//       if (axios.isAxiosError(error) && error.response) {
//         //setErrorMessage(error.response.data);
//       } else {
//         setErrorMessage('An unexpected error occurred while creating the post.');
//       }
//     }
//   };

//   return (
//     <Container maxWidth="sm" sx={{ mt: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         Create a New Post
//       </Typography>

//       {/* Display error message if any */}
//       {errorMessage && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {errorMessage}
//         </Alert>
//       )}

//       {/* Form for creating a new post */}
//       <form onSubmit={handleSubmit}>
//         <TextField
//           label="Title"
//           fullWidth
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           sx={{ marginBottom: 2 }}
//           required // HTML5 validation
//         />
//         <TextField
//           label="Content"
//           fullWidth
//           multiline
//           rows={6}
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           sx={{ marginBottom: 2 }}
//           required // HTML5 validation
//         />
//         <Button type="submit" variant="contained" color="primary" fullWidth>
//           Submit Post
//         </Button>
//       </form>
//     </Container>
//   );
// };

// export default CreatePost;

