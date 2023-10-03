import Link from "next/link";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthConnect";
import styles from "app/components/page.module.css";

const Navbar = () => {
  const { user, googleSignIn, logOut } = UserAuth();
  const [loading, setLoading] = useState(true);

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  return (
    <div>
      <div className={styles.desktop2}>
        <ul>
          <li className={styles.home}>
            <Link href="/">Home</Link>
          </li>

          <li className={styles.about}>
            <Link href="/about">About</Link>
          </li>

          {!user ? (
            <li className={styles.profile}>
              <Link href="/profile">Profile</Link>
            </li>
          ) : null}
        </ul>
        {loading ? null : !user ? (
          <ul>
            <li className={styles.signIn} onClick={handleSignIn}>
              Login
            </li>
            <li className={styles.signUp}>
              <Link href="/signup">Signup</Link>
            </li>
          </ul>
        ) : (
          <div>
            <p className={styles.signout} onClick={handleSignOut}>
              Signout
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
