import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import Field from '../components/ui/Field.jsx';
import { useAuth } from '../hooks/useAuth.js';

const LoginPage = () => {
  const { user, login } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/';

  // بعد از ورود موفق، user پر می‌شود و همین‌جا کاربر به مقصد هدایت می‌شود.
  if (user) return <Navigate to={redirectTo} replace />;

  const updateField = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(form);
    } catch (loginError) {
      setError(loginError.message);
      setSubmitting(false);
    }
  };

  return (
    <section className="panel auth-box">
      <h1 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>ورود به حساب</h1>

      <form onSubmit={handleSubmit}>
        <Field label="ایمیل">
          <input className="input" type="email" required autoComplete="email" dir="ltr" value={form.email} onChange={updateField('email')} />
        </Field>
        <Field label="رمز عبور">
          <input className="input" type="password" required autoComplete="current-password" dir="ltr" value={form.password} onChange={updateField('password')} />
        </Field>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'در حال ورود…' : 'ورود'}
        </button>
      </form>

      <p className="auth-box__switch">
        حساب ندارید؟ <Link to="/register">ثبت‌نام کنید</Link>
      </p>
    </section>
  );
};

export default LoginPage;
