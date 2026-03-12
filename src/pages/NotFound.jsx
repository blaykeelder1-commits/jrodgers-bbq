import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import './NotFound.css';

function NotFound() {
  usePageTitle('Page Not Found');

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
          <Link to="/menu" className="btn btn-outline">
            View Menu
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
