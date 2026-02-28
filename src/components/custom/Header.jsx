import React, { useEffect, useState } from "react";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function Header() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Persist dark mode in localStorage
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  // Listen for theme changes in other tabs
  useEffect(() => {
    const syncTheme = (e) => {
      if (e.key === 'theme') {
        setDark(e.newValue === 'dark');
      }
    };
    window.addEventListener('storage', syncTheme);
    return () => window.removeEventListener('storage', syncTheme);
  }, []);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.error(error),
  });

  useEffect(() => {
    console.log(user);
  }, [user]);

  const GetUserProfile = (tokenInfo) => {
    setLoading(true);
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((resp) => {
        console.log(resp.data);
        localStorage.setItem("user", JSON.stringify(resp.data));
        setUser(resp.data);
        setOpenDialog(false);
        // Trigger storage event for other tabs/components
        window.dispatchEvent(new Event('storage'));
        toast.success(`Welcome back, ${resp.data.name}!`);
      })
      .catch((err) => {
        console.error("Failed to fetch user profile:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass backdrop-blur-xl shadow-lg border-b border-border'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 sm:px-6 py-4">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a href="/" className="flex items-center gap-2">
              <img
                src="/new.svg"
                alt="Logo"
                className="h-10 sm:h-12 w-auto"
              />
              <span className="hidden sm:inline-block font-bold text-xl gradient-text">
                
              </span>
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <motion.button
              aria-label="Toggle dark mode"
              className="relative p-3 rounded-full glass hover:scale-110 transition-transform"
              onClick={() => setDark((d) => !d)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {dark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiSun className="text-accent w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -180, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiMoon className="text-primary w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {user ? (
              <>
                <motion.a
                  href="/create-trip"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-md hover:shadow-xl transition-all">
                    + Create Trip
                  </button>
                </motion.a>
                
                <motion.a
                  href="/my-trips"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button className="px-6 py-2.5 rounded-xl glass font-semibold text-foreground hover:bg-muted transition-all">
                    My Trips
                  </button>
                </motion.a>

                <Popover>
                  <PopoverTrigger asChild>
                    <motion.div
                      className="relative h-11 w-11 rounded-full overflow-hidden cursor-pointer ring-2 ring-primary/50 hover:ring-accent transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <img
                        src={user?.picture}
                        alt="User Avatar"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                    </motion.div>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 glass backdrop-blur-xl border-border p-2">
                    <motion.div className="flex flex-col gap-1">
                      <div className="px-3 py-2 border-b border-border">
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      
                      <motion.a
                        href="/profile"
                        className="cursor-pointer hover:bg-primary/10 dark:hover:bg-accent/10 p-3 rounded-lg transition font-medium flex items-center gap-3 group"
                        whileHover={{ x: 5 }}
                      >
                        <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-secondary">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="gradient-text">Profile</span>
                      </motion.a>

                      <hr className="border-border my-1" />
                      
                      <motion.button
                        className="cursor-pointer text-red-500 hover:bg-red-500/10 p-3 rounded-lg transition font-medium flex items-center gap-3 text-left w-full group"
                        onClick={() => {
                          googleLogout();
                          localStorage.clear();
                          toast.success("Logged out successfully");
                          window.location.href = "/";
                        }}
                        whileHover={{ x: 5 }}
                      >
                        <div className="p-1.5 rounded-lg bg-red-500/20">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        Logout
                      </motion.button>
                    </motion.div>
                  </PopoverContent>
                </Popover>
              </>
            ) : (
              <motion.button
                onClick={() => setOpenDialog(true)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold shadow-md hover:shadow-xl transition-all relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Sign In</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-secondary"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <motion.button
              aria-label="Toggle dark mode"
              className="p-2 rounded-full glass"
              onClick={() => setDark((d) => !d)}
              whileTap={{ scale: 0.9 }}
            >
              {dark ? <FiSun className="text-accent w-5 h-5" /> : <FiMoon className="text-primary w-5 h-5" />}
            </motion.button>

            <motion.button
              aria-label="Toggle menu"
              className="p-2 rounded-full glass"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden glass backdrop-blur-xl border-t border-border"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-6 space-y-3">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 pb-3 border-b border-border">
                      <img src={user?.picture} alt="Avatar" className="h-10 w-10 rounded-full ring-2 ring-primary" />
                      <div>
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <a href="/create-trip" className="block p-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-center">
                      + Create Trip
                    </a>
                    <a href="/my-trips" className="block p-3 rounded-xl glass text-center font-semibold">
                      My Trips
                    </a>
                    <a href="/profile" className="block p-3 rounded-xl glass text-center font-semibold">
                      Profile
                    </a>
                    <button
                      onClick={() => {
                        googleLogout();
                        localStorage.clear();
                        toast.success("Logged out successfully");
                        window.location.href = "/";
                      }}
                      className="w-full p-3 rounded-xl bg-red-500/10 text-red-500 font-semibold"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setOpenDialog(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full p-3 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Sign In Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="glass backdrop-blur-xl border-border">
          <DialogHeader>
            <DialogTitle className="sr-only">Sign in Dialog</DialogTitle>
            <DialogDescription className="flex flex-col items-center justify-center text-center">
              <motion.img
                src="/new.svg"
                alt="Logo"
                className="h-16"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
              />
              <motion.h2
                className="text-3xl font-bold mt-5 gradient-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Welcome Back!
              </motion.h2>
              <motion.p
                className="text-muted-foreground mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Sign in with Google to save and access your trips
              </motion.p>
              <motion.button
                disabled={loading}
                onClick={login}
                className="mt-6 px-8 py-3 rounded-xl glass hover:bg-muted flex items-center gap-3 font-semibold transition-all hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <FcGoogle className="h-6 w-6" />
                {loading ? "Signing in..." : "Sign in with Google"}
              </motion.button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Header;
