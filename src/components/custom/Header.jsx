import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
      .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: "application/json",
        },
      })
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
      <div className=" shadow-md flex justify-between items-center px-6 bg-purple-10">
        <div className="flex">
          <a href="/"><img src="/logoO.svg" alt="Logo" className="h-[60px] p-1 -px-5 items-baseline"/></a>
        </div>
        <div>
          {user ? (
            <div className="flex gap-5 items-center">
              <a href="/create-trip">
              <Button variant="outline" className="rounded-full text-black">+ Create Trip</Button>
              </a>
              <a href="/my-trips">
              <Button variant="outline" className="rounded-full text-black">My Trips</Button>
              </a>
              <Popover>
                <PopoverTrigger asChild>
                  <img
                    src={user?.picture}
                    className="h-[47px] w-[47px] rounded-full cursor-pointer"
                    alt="User Avatar"
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <h2
                    className="cursor-pointer"
                    onClick={() => {
                      googleLogout();
                      localStorage.clear();
                      window.location.reload();
                      window.location.href = '/';
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
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription className="flex flex-col items-center justify-center text-center">
              <img src="/logoO.svg" alt="Logo" className="h-[40px]" />
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