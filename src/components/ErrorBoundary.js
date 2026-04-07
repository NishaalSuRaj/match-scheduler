import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.errorBox}>
            <h1 style={styles.title}>⚠️ Oops! Something went wrong</h1>
            <p style={styles.message}>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <details style={styles.details}>
                <summary style={styles.summary}>Error Details (Development Only)</summary>
                <pre style={styles.errorText}>
                  {this.state.error && this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <button
              onClick={this.resetError}
              style={styles.button}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#0a6bba'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#1976d2'}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  errorBox: {
    background: 'white',
    borderRadius: '24px',
    padding: '40px',
    maxWidth: '600px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    textAlign: 'center'
  },
  title: {
    color: '#2a3d8f',
    marginBottom: '1rem',
    fontSize: '2rem',
    fontWeight: '700'
  },
  message: {
    color: '#666',
    fontSize: '1.1rem',
    marginBottom: '2rem',
    lineHeight: '1.6'
  },
  details: {
    marginBottom: '2rem',
    textAlign: 'left',
    background: '#f5f5f5',
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid #e0e0e0'
  },
  summary: {
    cursor: 'pointer',
    fontWeight: '600',
    color: '#666'
  },
  errorText: {
    marginTop: '1rem',
    background: '#fff',
    padding: '1rem',
    borderRadius: '8px',
    overflow: 'auto',
    maxHeight: '300px',
    fontSize: '0.85rem',
    color: '#d32f2f',
    fontFamily: "'Courier New', monospace"
  },
  button: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '30px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }
};

export default ErrorBoundary;
