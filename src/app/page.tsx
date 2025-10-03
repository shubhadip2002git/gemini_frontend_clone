"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/authSlice";
import { storage } from "@/utils/localStorage";
import OTPLogin from "@/components/auth/OTPLogin";
import Dashboard from "@/components/dashboard/Dashboard";
import { Loader, Center } from "@mantine/core";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const savedUser = storage.getAuth();
    if (savedUser) {
      dispatch(setUser(savedUser));
    }
    setLoading(false);
  }, [dispatch]);

  const handleLoginSuccess = (phoneNumber: string, countryCode: string) => {
    const user = {
      id: `user-${Date.now()}`,
      phoneNumber,
      countryCode,
    };
    dispatch(setUser(user));
    storage.setAuth(user);
  };

  if (loading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  return isAuthenticated ? (
    <Dashboard />
  ) : (
    <OTPLogin onSuccess={handleLoginSuccess} />
  );
}
