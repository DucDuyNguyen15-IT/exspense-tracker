import React, { useState } from "react";
import { login, register, loginWithGoogle } from "../firebase";
import { useAppContext } from "../context/AppContext";

const GoogleIcon = () => <svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>;
const FacebookIcon = () => <svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
const GithubIcon = () => <svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>;
const XIcon = () => <svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>;

export default function LoginPage() {
  const { theme, toggleTheme, language, toggleLanguage, t } = useAppContext();
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ displayName: "", email: "", password: "", confirmPassword: "" });

  const handleAuth = async (e, type) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (type === 'reg' && regForm.password !== regForm.confirmPassword) {
      setError(language === 'vi' ? "Mật khẩu không khớp!" : "Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      if (type === 'login') await login(loginForm.email, loginForm.password);
      else await register(regForm.email, regForm.password, regForm.displayName);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = (name) => {
    if (name === 'google') loginWithGoogle();
    else alert(t('not_supported'));
  };

  return (
    <div className="auth-container">
      <div style={{ position: 'fixed', top: '2rem', right: '2rem', zIndex: 1000, display: 'flex', gap: '1.2rem' }}>
        <div className={`switch-track ${theme === 'light' ? 'active' : ''}`} onClick={toggleTheme}>
          <span className="switch-icon left">🌙</span>
          <span className="switch-icon right">☀️</span>
          <div className="switch-thumb"></div>
        </div>
        <div className={`switch-track ${language === 'en' ? 'active' : ''}`} onClick={toggleLanguage}>
          <span className="switch-icon left">VI</span>
          <span className="switch-icon right">EN</span>
          <div className="switch-thumb"></div>
        </div>
      </div>

      <div className={`auth-box ${isActive ? 'active' : ''}`}>
        <div className="form-container sign-up-container">
          <form className="auth-form" onSubmit={(e) => handleAuth(e, 'reg')}>
            <h1 style={{ fontWeight: 800, fontSize: '2.5rem', marginBottom: '1rem' }}>{t('register_title')}</h1>
            
            <div className="social-container">
              <div className="social-icon" onClick={() => handleSocialClick('google')} title="Google"><GoogleIcon /></div>
              <div className="social-icon" onClick={() => handleSocialClick('fb')} title="Facebook"><FacebookIcon /></div>
              <div className="social-icon" onClick={() => handleSocialClick('github')} title="Github"><GithubIcon /></div>
              <div className="social-icon" onClick={() => handleSocialClick('x')} title="X"><XIcon /></div>
            </div>
            
            <span style={{ fontSize: '13px', color: 'var(--dim)', marginBottom: '1rem' }}>{t('or')}</span>
            
            <input className="auth-input" type="text" placeholder={t('display_name')} value={regForm.displayName} onChange={e => setRegForm({...regForm, displayName: e.target.value})} required />
            <input className="auth-input" type="text" placeholder={t('email')} value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} required />
            <input className="auth-input" type="password" placeholder={t('password')} value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})} required />
            <input className="auth-input" type="password" placeholder={t('confirm_password')} value={regForm.confirmPassword} onChange={e => setRegForm({...regForm, confirmPassword: e.target.value})} required />
            
            {error && !isActive && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '10px' }}>{error}</p>}
            <button className="btn-primary" disabled={loading}>{loading ? "..." : t('sign_up_btn')}</button>
          </form>
        </div>

        <div className="form-container sign-in-container">
          <form className="auth-form" onSubmit={(e) => handleAuth(e, 'login')}>
            <h1 style={{ fontWeight: 800, fontSize: '2.5rem', marginBottom: '1rem' }}>{t('login_title')}</h1>
            
            <div className="social-container">
              <div className="social-icon" onClick={() => handleSocialClick('google')} title="Google"><GoogleIcon /></div>
              <div className="social-icon" onClick={() => handleSocialClick('fb')} title="Facebook"><FacebookIcon /></div>
              <div className="social-icon" onClick={() => handleSocialClick('github')} title="Github"><GithubIcon /></div>
              <div className="social-icon" onClick={() => handleSocialClick('x')} title="X"><XIcon /></div>
            </div>
 
            <span style={{ fontSize: '13px', color: 'var(--dim)', marginBottom: '1rem' }}>{t('or')}</span>
            
            <input className="auth-input" type="text" placeholder={t('email')} value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} required />
            <input className="auth-input" type="password" placeholder={t('password')} value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} required />
            
            {error && isActive && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '10px' }}>{error}</p>}
            <button className="btn-primary" disabled={loading}>{loading ? "..." : t('sign_in_btn')}</button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel" style={{ left: 0, transform: isActive ? 'translateX(0)' : 'translateX(-20%)' }}>
              <h1 style={{ fontWeight: 800, fontSize: '2.5rem', marginBottom: '1.5rem' }}>{t('back_title')}</h1>
              <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '2.5rem' }}>{t('back_desc')}</p>
              <button className="ghost-btn" onClick={() => setIsActive(false)}>{t('sign_in_btn')}</button>
            </div>
            
            <div className="overlay-panel" style={{ right: 0, transform: isActive ? 'translateX(20%)' : 'translateX(0)' }}>
              <h1 style={{ fontWeight: 800, fontSize: '2.5rem', marginBottom: '1.5rem' }}>{t('welcome_title')}</h1>
              <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '2.5rem' }}>{t('welcome_desc')}</p>
              <button className="ghost-btn" onClick={() => setIsActive(true)}>{t('sign_up_btn')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
