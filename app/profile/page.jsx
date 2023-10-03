"use client";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthConnect";
import Link from "next/link";

const Page = () => {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true); // Corrected useState syntax

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  return (
    <div className="p-4">
      {user ? (
        <p>
          Welcome, {user.displayName} please click at the link below to access
          your account
          <li>
            <Link href="/yourpage">feed</Link>
          </li>
        </p>
      ) : (
        <p>You must be logged in to view this protected route.</p>
      )}
    </div>
  );
};

export default Page; // Corrected component name to start with a capital letter
