"use client";
import PhoneForm from "@/components/phone-form";
import { useEffect, useState } from "react";

// User interface
interface User {
  id: string;
  email: string;
  phoneNumber: string | null;
  name: string | null;
}

export default function Home() {
  const [userData, setuserData] = useState<User | null>(null);
  const fetchUser = async () => {
    const res = await fetch("http://localhost:3000/user/me", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    setuserData(data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="font-sans min-h-[80vh] p-8 pb-20 gap-16 sm:p-20">
      <main className="flex items-center justify-center h-full">
        <div className="flex flex-col gap-4">
          {userData?.phoneNumber ? (
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold">Welcome {userData.name}</h1>
              <p className="text-lg">
                Your phone number is {userData.phoneNumber}
              </p>
              <p className="text-lg">
                You get a reminder on this number for the event you registered
                on google calender
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    localStorage.removeItem("token");
                    //Remove token cookies from browser
                    document.cookie.split(";").forEach((cookie) => {
                      document.cookie =
                        cookie.split("=")[0].trim() +
                        "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    });
                    window.location.reload();
                  }}
                >
                  Logout
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    localStorage.removeItem("token");
                    fetchUser();
                  }}
                >
                  Update Phone Number
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    localStorage.removeItem("token");
                    fetchUser();
                  }}
                >
                  View Upcoming Events
                </button>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    localStorage.removeItem("token");
                    fetchUser();
                  }}
                >
                  Remove Phone Number
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold">Enter Your Phone Number</h1>
              <PhoneForm />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
