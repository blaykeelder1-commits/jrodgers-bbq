import { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '3rem 1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: '#3E2723', marginBottom: '0.5rem' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#8D6E63', marginBottom: '1.5rem' }}>
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#D84315',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: 'Georgia, serif',
                  fontSize: '1rem'
                }}
              >
                Refresh Page
              </button>
              <Link
                to="/"
                onClick={() => this.setState({ hasError: false })}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '2px solid #5D4037',
                  color: '#5D4037',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontFamily: 'Georgia, serif',
                  fontSize: '1rem'
                }}
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
