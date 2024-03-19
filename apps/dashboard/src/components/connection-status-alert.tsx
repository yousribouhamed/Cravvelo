"use client";

import React, { useState, useEffect } from "react";

const ConnectionStatusAlert = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="w-full h-[100px] bg-pink-200">
      {isOnline ? (
        <p>Connected</p>
      ) : (
        <p>Lost connection. Please check your internet connection.</p>
      )}
    </div>
  );
};

export default ConnectionStatusAlert;
