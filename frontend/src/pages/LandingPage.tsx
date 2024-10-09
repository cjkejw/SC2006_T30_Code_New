import './landingpage.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Layout from '../components/layout/Layout.tsx'
import Signup from '../components/signup/SignUp.tsx'
import Signin from '../components/signin/SignIn.tsx'
import Forgetpassword from '../components/forgetpassword/ForgetPassword.tsx'
import SchoolSearchPage from '../pages/SchoolSearchPage/SchoolSearchPage.tsx'
import SearchResultsPage from '../pages/SearchResultsPage/SearchResultsPage.tsx'
// import Resetpassword from '../components/resetpassword/ResetPassword.tsx'

function Landingpage() {
  return (
    <Router>
      <Layout>
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
          {/* <Route path="/compare-schools" element={<CompareSchoolsPage />} /> */}

          {/* Recommendations Route */}
          {/* <Route path="/recommendations" element={<RecommendationsPage/>} /> */}

          {/* Forum Route */}
          {/* <Route path="/forum" element={<ForumPage/>} /> */}

          {/* Handle 404 Not Found */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default Landingpage;