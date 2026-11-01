import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import Field from '../components/ui/Field.jsx';
import { useAuth } from '../hooks/useAuth.js';

const RegisterPage = () => {
  const { user, register } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={location.state?.from?.pathname || '/'} replace />;

  const updateField = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await register(form);
    } catch (registerError) {
      setError(registerError.message);
      setSubmitting(false);
    }
  };

  return (
    <section className="panel auth-box">
      <h1 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>ساخت حساب جدید</h1>

      <form onSubmit={handleSubmit}>
        <Field label="نام و نام خانوادگی">
          <input className="input" required autoComplete="name" value={form.name} onChange={updateField('name')} />
        </Field>
        <Field label="ایمیل">
          <input className="input" type="email" required autoComplete="email" dir="ltr" value={form.email} onChange={updateField('email')} />
        </Field>
        <Field label="رمز عبور" hint="حداقل ۸ کاراکتر">
          <input className="input" type="password" required minLength={8} autoComplete="new-password" dir="ltr" value={form.password} onChange={updateField('password')} />
        </Field>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'در حال ثبت‌نام…' : 'ثبت‌نام'}
        </button>
      </form>

      <p className="auth-box__switch">
        قبلاً ثبت‌نام کرده‌اید؟ <Link to="/login">وارد شوید</Link>
      </p>
    </section>
  );
};

export default RegisterPage;
