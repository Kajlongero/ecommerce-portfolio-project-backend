"use client";
import { useContext, useEffect, useState } from "react";
import { Within } from "@theme-toggles/react";
import cookie from "js-cookie";
import "@theme-toggles/react/css/Classic.css";

type Props = {
  isDark: boolean;
};

export const DarkModeButton = ({ isDark }: Props) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const dark = localStorage.getItem("theme");
    if (dark === "dark" && isDark) setDarkMode(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      cookie.set("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      cookie.set("theme", "light");
    }
  }, [isDark, darkMode]);

  const onToggle = (toggled: boolean) => {
    setDarkMode(toggled);
  };

  return (
    <div className="w-8 h-8">
      <Within
        title="Toggle theme"
        aria-label="Toggle theme"
        duration={750}
        placeholder="Toggle theme"
        toggled={darkMode}
        onToggle={onToggle}
      />
    </div>
  );
};
