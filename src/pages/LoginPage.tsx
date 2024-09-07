import { useEffect, useState } from 'react';
import { supabaseClient } from '../db/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [session, setSession] = useState<Session | null>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for error message
  const navigate = useNavigate();

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null); // Reset error state
    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      navigate('/');
    } catch (err) {
      setError('Invalid credentials or user does not exist'); // Set error message
    } finally {
      // setEmail('');
      setPassword('');
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Sign in</h1>
      <form onSubmit={handleLogin} noValidate>
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

export default Login;