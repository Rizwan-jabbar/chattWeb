import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../../rtk/thunks/loginThunk/loginThunk";
import { getLoggedInUserThunk } from "../../rtk/thunks/userProfileThunk/userProfileThunk";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function IconBubble() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <path d="M7 10.5h10M7 14.5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M12 3C6.925 3 3 6.425 3 10.75c0 2.177.996 4.165 2.67 5.59L5 21l4.109-2.054c.91.204 1.876.304 2.891.304 5.075 0 9-3.425 9-7.75S17.075 3 12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
    );
}

function IconMail() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M4 7.5 12 13l8-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    );
}

function IconLock() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <rect x="5" y="10" width="14" height="10" rx="3" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function IconEye({ open }) {
    return open ? (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    ) : (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M3 3 21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M10.585 10.586A2 2 0 0 0 13.414 13.415" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M6.53 6.53C4.144 8.133 2.5 12 2.5 12s3.5 6.5 9.5 6.5a9.9 9.9 0 0 0 4.2-.892" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.88 5.72A10.3 10.3 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16.76 16.76 0 0 1-2.91 3.72" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function StatCard({ icon, label, value }) {
    return (
        <div className="rounded-[1.6rem] border border-white/10 bg-slate-900/70 p-4">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                {icon}
            </div>
            <p className="text-xs text-slate-400">{label}</p>
            <p className="mt-1 text-lg font-semibold text-white">{value}</p>
        </div>
    );
}

function Login () {
    const [loginData , setLoginData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, success } = useSelector((state) => state.login);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await dispatch(loginThunk(loginData)).unwrap();
            await dispatch(getLoggedInUserThunk()).unwrap();
            setLoginData({
                email: '',
                password: ''
            });
            navigate('/');
        } catch (err) {
            console.error("Login/profile fetch error:", err);
        }
    }

    return (
        <>
            <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.18),_transparent_24%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)]" />
                <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

                <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                        <section className="hidden rounded-[1.9rem] border border-white/10 bg-white/5 p-7 shadow-2xl shadow-cyan-950/30 backdrop-blur xl:block">
                            <div className="max-w-xl">
                                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-200">
                                    <IconBubble />
                                    Real-time Messaging
                                </span>
                                <h1 className="mt-6 text-[2.5rem] font-semibold leading-tight tracking-[-0.03em] text-white">
                                    Welcome back to the conversation hub.
                                </h1>
                                <p className="mt-4 max-w-lg text-[13px] leading-7 text-slate-300">
                                    A focused, modern sign-in experience for the chat platform you are building. Clean, calm, and designed to feel trustworthy on every screen size.
                                </p>

                                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                                    <StatCard icon={<IconBubble />} label="Response" value="Instant" />
                                    <StatCard icon={<IconMail />} label="Presence" value="Live" />
                                    <StatCard icon={<IconLock />} label="Access" value="Secure" />
                                </div>
                            </div>
                        </section>

                        <section className="mx-auto w-full max-w-lg lg:justify-self-end">
                            <div className="rounded-[1.9rem] border border-white/10 bg-slate-900/82 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur sm:p-7">
                                <div className="mb-7">
                                    <div className="mb-4 inline-flex h-13 w-13 items-center justify-center rounded-[1.15rem] bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/30">
                                        <IconBubble />
                                    </div>
                                    <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-cyan-200/80">
                                        Sign In
                                    </p>
                                    <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.03em] text-white">
                                        Continue your chats
                                    </h2>
                                    <p className="mt-3 text-[13px] leading-6 text-slate-400">
                                        Access your messages, groups, and ongoing conversations from one place.
                                    </p>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Email Address</label>
                                        <div className="flex items-center gap-3 rounded-[1.1rem] border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-400 transition focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-400/20">
                                            <IconMail />
                                            <input
                                                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500 selection:bg-cyan-300 selection:text-slate-950"
                                                value={loginData.email}
                                                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                                                type="text"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Password</label>
                                        <div className="flex items-center gap-3 rounded-[1.1rem] border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-400 transition focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-400/20">
                                            <IconLock />
                                            <input
                                                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500 selection:bg-cyan-300 selection:text-slate-950"
                                                value={loginData.password}
                                                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                className="text-slate-400 transition hover:text-cyan-200"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                <IconEye open={showPassword} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="rounded-[1rem] border border-white/10 bg-slate-950/40 px-4 py-3">
                                        <p className="text-[12px] text-slate-400">Need help accessing your account?</p>
                                        <p className="mt-1"><Link to="/forgetPassword" className="font-semibold text-cyan-300 transition hover:text-cyan-200 text-[12px]">
                                            Forgot your password?
                                        </Link></p>
                                    </div>

                                    {error && (
                                        <div className="rounded-[1.1rem] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-xs text-rose-200 sm:text-sm">
                                            {error}
                                        </div>
                                    )}

                                    {success && (
                                        <div className="rounded-[1.1rem] border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-xs text-emerald-200 sm:text-sm">
                                            Login successful.
                                        </div>
                                    )}

                                    <div className="pt-1.5">
                                        <button
                                            type="submit"
                                            className="flex w-full items-center justify-center gap-2 rounded-[1.1rem] bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:scale-[0.99] hover:shadow-lg hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                                            disabled={loading}
                                        >
                                            <IconBubble />
                                            {loading ? "Signing in..." : "Login"}
                                        </button>
                                    </div>
                                </form>

                                <p className="mt-6 text-center text-xs text-slate-400 sm:text-sm">
                                    New here?{" "}
                                    <Link to="/register" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
                                        Create an account
                                    </Link>
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
