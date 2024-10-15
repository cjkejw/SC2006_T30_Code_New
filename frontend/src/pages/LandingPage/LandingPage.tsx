import './landingpage.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import Signup from '../../components/SignUp/SignUp';
import Signin from '../../components/SignIn/SignIn';
import Forgetpassword from '../../components/ForgetPassword/ForgetPassword';
import SchoolSearchPage from '../SchoolSearchPage/SchoolSearchPage';
import SearchResultsPage from '../SearchResultsPage/SearchResultsPage';
import CompareSchoolsPage from '../CompareSchoolsPage/CompareSchoolsPage';
import RecommendationsPage from '../RecommendationsPage/RecommendationsPage';
import ForumPage from '../ForumPage';
import Forum from '../../components/Forum/Forum';
import CreatePost from '../CreatePost/CreatePost';
import { useState } from 'react'; // Import useState

function Landingpage() {
  // Define the newPost state with the expected properties
  const [newPost, setNewPost] = useState<{
    title: string;
    content: string;
    username: string;
  }>({
    title: '',
    content: '',
    username: '', // You might want to set this based on the logged-in user
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreatePost = () => {
    // Your post creation logic here
    console.log(newPost); // For testing
    // You might want to reset the newPost state after creating the post
    setNewPost({ title: '', content: '', username: '' });
  };

  return (
    <Router>
      <NavBar>
        <Routes>
          <Route path="/" element={
            <>
              <div className="relative-wrapper">
                <div className="school-image">
                  <img src="../assets/school-image.png" alt="School"/>
                </div>
              </div>
              <div className="welcome-banner">
                Welcome to <div className="welcome-font">School Picker</div>!
              </div>
            </>
          } />

          {/* Sign In Route */}
          <Route path="/signin" element={<Signin />} />
          
          {/* Sign Up Route */}
          <Route path="/signup" element={<Signup />} />

          {/* Forget Password Route */}
          <Route path="/forgetpassword" element={<Forgetpassword />} />

          {/* School Search Route */}
          <Route path="/schools" element={<SchoolSearchPage />} />

          {/* Search Results Route */}
          <Route path="/search-results" element={<SearchResultsPage />} />

          {/* Compare Schools Route */}
          <Route path="/compare-schools" element={<CompareSchoolsPage />} />

          {/* Recommendations Route */}
          <Route path="/recommendations" element={<RecommendationsPage />} />

          {/* Forum Route */}
          <Route path="/forum" element={<Forum /* Pass necessary props here */ />} />

          {/* Create Post Route - Pass the newPost state and handlers */}
          <Route path="/forum/createpost" element={<CreatePost 
              newPost={newPost}
              handleInputChange={handleInputChange}
              handleCreatePost={handleCreatePost}
              closeModal={() => { /* Logic to close modal */ }}
            />} 
          />

          {/* Handle 404 Not Found */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </NavBar>
    </Router>
  );
}

export default Landingpage;
