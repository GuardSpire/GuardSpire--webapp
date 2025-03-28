

const SignInForm = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <img src="src/assets/logo.png" className="auth-logo" alt="Logo" />
        <h2 className="auth-title">GUARD SPIRE</h2>

        <input className="auth-input" type="email" placeholder="Enter your email" />
        <input className="auth-input" type="password" placeholder="Enter your password" />
        <div className="auth-forgot">Forgot password?</div>

        <button className="auth-btn">Sign In</button>
        <div className="auth-link">Don't have an account? <span onClick={onClose}>Sign Up</span></div>

        <button className="google-btn">
          <img src="src/assets/search.png" className="google-icon" /> Continue with Google
        </button>
      </div>
    </div>
  );
};

export default SignInForm;
