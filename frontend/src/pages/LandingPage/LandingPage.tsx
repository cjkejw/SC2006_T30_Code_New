import './landingpage.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NavBar from '../../components/NavBar/NavBar'
import Signup from '../../components/SignUp/SignUp'
import Signin from '../../components/SignIn/SignIn'
import Forgetpassword from '../../components/ForgetPassword/ForgetPassword'
import SchoolSearchPage from '../SchoolSearchPage/SchoolSearchPage'
import SearchResultsPage from '../SearchResultsPage/SearchResultsPage'
import CompareSchoolsPage from '../CompareSchoolsPage/CompareSchoolsPage'
import RecommendationsPage from '../RecommendationsPage/RecommendationsPage'
// import Resetpassword from '../components/resetpassword/ResetPassword.tsx' //FOR TESTING ONLY

function Landingpage() {
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

          {/* Reset Pwd Route FOR TESTING ONLY */}
          {/* <Route path="/resetpassword" element={<Resetpassword />} /> -----> Shldn't be seen by public, only accessible thru unique link */}

          {/* School Search Route */}
          <Route path="/schools" element={<SchoolSearchPage />} />

          {/* Search Results Route */}
          <Route path="/search-results" element={<SearchResultsPage />} />

          {/* Compare Schools Route */}
          <Route path="/compare-schools" element={<CompareSchoolsPage />} />

          {/* Recommendations Route */}
          <Route path="/recommendations" element={<RecommendationsPage />} />

          {/* Forum Route */}
          {/* <Route path="/forum" element={<ForumPage/>} /> */}

          {/* Handle 404 Not Found */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </NavBar>
    </Router>
  );
}

export default Landingpage;