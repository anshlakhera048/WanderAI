import React, { useEffect, useState } from "react";
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

function Header() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

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
        window.location.reload();
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
      <header className="bg-white shadow-md">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center px-3 py-1 relative overflow-hidden">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/">
              <img
                src="/new.svg"
                alt="Logo"
                className="h-[60px] w-auto object-contain"
              />
            </a>
          </div>

          {/* User Actions */}
          {user ? (
            <div className="flex gap-3 items-center right-0">
              <a href="/create-trip">
                <Button variant="outline" className="rounded-full text-black">
                  + Create Trip
                </Button>
              </a>
              <a href="/my-trips">
                <Button variant="outline" className="rounded-full text-black">
                  My Trips
                </Button>
              </a>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="h-[40px] w-[40px] rounded-full overflow-hidden border cursor-pointer">
                    <img
                      src={user?.picture}
                      alt="User Avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent>
                  <h2
                    className="cursor-pointer"
                    onClick={() => {
                      googleLogout();
                      localStorage.clear();
                      window.location.reload();
                      window.location.href = "/";
                    }}
                  >
                    Logout
                  </h2>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <Button onClick={() => setOpenDialog(true)}>Sign In</Button>
          )}
        </div>
      </header>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="sr-only">Sign in Dialog</DialogTitle> {/* Required for accessibility */}
              <DialogDescription className="flex flex-col items-center justify-center text-center">
                <img src="/new.svg" alt="Logo" className="h-[40px]" />
                <h2 className="text-2xl font-bold mt-5">Sign in with Google</h2>
                <p>Sign in to the App with Google Authentication securely</p>
                <Button
                  disabled={loading}
                  onClick={login}
                  className=" mt-4 flex gap-4 items-center justify-center"
                >
                  <FcGoogle className="h-[20px]" />
                  Sign in with Google
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
    </>
  );
}

export default Header;
