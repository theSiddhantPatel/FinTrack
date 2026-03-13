import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const googleButtonRef = useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) {
      return undefined;
    }

    let isCancelled = false;
    let intervalId = null;

    const initializeGoogleButton = () => {
      if (
        isCancelled ||
        !window.google?.accounts?.id ||
        !googleButtonRef.current
      ) {
        return false;
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          if (!response.credential) {
            toast.error("Google login failed");
            return;
          }

          setLoading(true);
          try {
            await loginWithGoogle(response.credential);
            toast.success("Login successful");
            navigate("/dashboard");
          } catch (error) {
            toast.error(error.response?.data?.message || "Google login failed");
          } finally {
            setLoading(false);
          }
        },
      });

      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "pill",
        width: googleButtonRef.current.offsetWidth || 360,
      });

      return true;
    };

    if (!initializeGoogleButton()) {
      intervalId = window.setInterval(() => {
        if (initializeGoogleButton() && intervalId) {
          window.clearInterval(intervalId);
        }
      }, 300);
    }

    return () => {
      isCancelled = true;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [googleClientId, loginWithGoogle, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password)
      return toast.error("Email and password are required");

    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card dark:bg-slate-800">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Login
        </h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-300">
          Welcome back to FinTrack
        </p>

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm((p) => ({ ...p, password: e.target.value }))
            }
          />
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          <span>or</span>
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        {googleClientId ? (
          <div ref={googleButtonRef} className="flex min-h-11 justify-center" />
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Add <code>VITE_GOOGLE_CLIENT_ID</code> to enable Google login.
          </p>
        )}

        <p className="mt-4 text-sm text-slate-500 dark:text-slate-300">
          No account?{" "}
          <Link to="/register" className="text-emerald-600">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
