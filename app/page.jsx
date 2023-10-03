"use client";
import React, { useState } from "react";
import styles from "/mnt/c/Users/abhijeet/OneDrive/please/j/app/page.module.css";

const Home = () => {
  // Use useState to track the hover state
  const [isHovered, setIsHovered] = useState(false);

  const svgCode = `
  <svg
    width="385"
    height="366"
    viewBox="0 0 385 366"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M192.5 183V1C298.263 1 384 82.4842 384 183C384 283.516 298.263 365 192.5 365C139.623 365 89.0998 344.221 52.903 307.588L192.5 183Z"
      fill="#67C587"
      stroke="white"
    />
    <path
      d="M192.5 183L52.903 307.588C-19.4963 234.315 -15.6877 119.136 61.4097 50.3277C96.9159 18.6392 143.793 1 192.5 1V183Z"
      fill="#EAF6ED"
      stroke="white"
    />
  </svg>
`;

  // Create a Data URL from the inline SVG code
  const dataUrl = `data:image/svg+xml;base64,${btoa(svgCode)}`;
  const handleHover = () => {
    setIsHovered(!isHovered);
  };

  return (
    <div className={styles.desktop1}>
      <div className={styles.welcomeToHarmonyParent}>
        <div className={styles.welcomeToHarmonyContainer}>
          <p className={styles.welcomeToHarmony}>Welcome to Harmony</p>
        </div>
        <div className={styles.connect}>Connect</div>
      </div>
      <div className={styles.anAppUnitingContainer}>
        <p className={styles.anAppUniting}>
          An app uniting people by their music tastes. Music holds deep personal
        </p>
        <p className={styles.anAppUniting}>
          meaning, a topic we yearn to discuss. Often, there's no supportive
        </p>
        <p className={styles.anAppUniting}>
          community or unknown peers who share our passion. Genres sometimes
        </p>
        <p className={styles.anAppUniting}>
          suffer from overexposed artists, tarnishing their appeal. The graph
        </p>
        <p className={styles.anAppUniting}>
          shows dissatisfaction, but others must cherish better music. Do they
        </p>
        <p className={styles.anAppUniting}>{`accept subpar tunes? `}</p>
        <p className={styles.blankLine}>&nbsp;</p>
        <p className={styles.blankLine}>&nbsp;</p>
        <p className={styles.blankLine}>
          Hopefully not. They might possess superior
        </p>
        <p className={styles.blankLine}>
          artists, silenced by social discomfort or indifference. Let's
        </p>
        <p className={styles.blankLine}>
          transform this. Empower them to share, connect, and uplift. Enter
        </p>
        <p className={styles.blankLine}>
          HarmonyConnect—a haven. Users share, bolster underrated musicians,
        </p>
        <p className={styles.welcomeToHarmony}>
          building a connected universe of musical exploration
        </p>
      </div>
      <div className={styles.enthusiastsToConnect}>
        enthusiasts to connect with
      </div>
      <div
        className={styles.peopleFromTheir}
      >{`people from their shared `}</div>
      <div className={styles.loveForMusic}>love for music</div>
      <div className={styles.anAppMade}>{`An app made for music `}</div>
      <div>
        <div className={styles.graph1}>Graph</div>
        <div className={styles.graph}></div>
      </div>
      <button
        className={styles.rectangleParent}
        autoFocus={true}
        onMouseEnter={handleHover} // Add mouse enter event handler
        onMouseLeave={handleHover} // Add mouse leave event handler
      >
        <div className={styles.groupChild} />
        <div className={styles.graphContainer}>
          <div className={styles.graph}>
            <div className={styles.graph3}></div>
          </div>
        </div>
      </button>

      {/* Add the image with conditional rendering */}
      {isHovered && (
        <img
          className={styles.figpieIcon}
          alt=""
          src={dataUrl} // Use the Data URL as the image source
          style={{ display: "block", width: "385px", height: "366px" }}
        />
      )}
      <div className={styles.toExploreFurtherContainer}>
        <span>To explore further, visit the 'About' section</span>
        <span className={styles.toLogIn}>. To log in or register</span>
        <span>, simply click on the provided buttons</span>
        <span
          className={styles.toLogIn}
        >{`. For accessing your profile, `}</span>
        <span>please log in</span>
        <span className={styles.toLogIn}>.</span>
      </div>
      <div className={styles.frame}>
        <div className={styles.frameChild}></div>
      </div>
    </div>
  );
};

export default Home;
