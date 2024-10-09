import './layout.css'
import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
        <div className="container">
            <div className="logo-wrapper">
                <span className="circlelogo"></span>
                <span className="whiteboxtoplogo"></span>
                <span className="whiteboxbottomlogo"></span>
            </div>
            <div className="link-wrapper">
                <Link to="/schools" className="link-text">SCHOOLS</Link>{/*Need build*/}
                <Link to="/compare-schools" className="link-text">COMPARE SCHOOLS</Link>{/*Need build*/}
                <Link to="/recommendations" className="link-text">RECOMMENDATIONS</Link>{/*Need build*/}
                <Link to="/forum" className="link-text">FORUM</Link>{/*Need build*/}
            </div>
            <div className="rectangle-wrapper">
                <Link to="/signin" className="signin-rectangle">SIGN IN</Link>
                <Link to="/signup" className="signup-rectangle">SIGN UP</Link>
            </div>
        </div>
        <main className="content">{children}</main>
        <footer className="footer">
            {/* Optional footer content */}
        </footer>
    </>
  );
};

export default Layout;