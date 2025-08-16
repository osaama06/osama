'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');

    const { first_name, last_name, email, phone, password, confirmPassword } = form;

    if (!first_name || !last_name || !email || !phone || !password || !confirmPassword) {
      setMessage('⚠️ الرجاء تعبئة جميع الحقول.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('❌ كلمة المرور وتأكيدها غير متطابقتين.');
      return;
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name, last_name, email, phone, password }),
      });

      const data = await res.json();

      if (data.success) {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          router.push('/');
        }, 1000);
      } else {
        setMessage('❌ ' + (data.message || 'حدث خطأ أثناء التسجيل.'));
      }
    } catch (err) {
      setMessage('⚠️ فشل في الاتصال بالخادم.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(to right, #fceabb, #f8b500)',
      fontFamily: 'Arial, sans-serif',
      position: 'relative'
    }}>
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#4BB543',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }}>
          ✅ تم التسجيل بنجاح، سيتم تحويلك...
        </div>
      )}

      <form onSubmit={handleSignup} style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>📝 تسجيل حساب جديد</h2>

        {[
          { name: "first_name", type: "text", placeholder: "الاسم الأول" },
          { name: "last_name", type: "text", placeholder: "الاسم الأخير" },
          { name: "email", type: "email", placeholder: "البريد الإلكتروني" },
          { name: "phone", type: "text", placeholder: "رقم الجوال" },
          { name: "password", type: "password", placeholder: "كلمة المرور" },
          { name: "confirmPassword", type: "password", placeholder: "تأكيد كلمة المرور" }
        ].map((field) => (
          <input
            key={field.name}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={form[field.name]}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
          />
        ))}

        <button type="submit" style={{
          backgroundColor: '#f8b500',
          color: '#fff',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease-in-out'
        }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d49500'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8b500'}>
          تسجيل
        </button>

        {message && (
          <p style={{ marginTop: '1rem', color: message.includes("تم") ? "green" : "red" }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
