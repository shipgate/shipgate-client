"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";


const safeJson = async (res) => {
  const text = await res.text();
  return text ? JSON.parse(text) : {};
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      /* ================= REGISTER ================= */
      register: async (payload) => {
        set({ isLoading: true, error: null });

        try {
          const res = await fetch(
            "https://shipgate-application.onrender.com/api/auth/register",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          const data = await safeJson(res);

          if (!res.ok) {
            throw new Error(
              data.message || data.error || "Registration failed"
            );
          }

          set({
            user: data.user || null,
            token: data.token || null,
            isLoading: false,
          });

          return data;
        } catch (err) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },

      /* ================= LOGIN ================= */
      login: async (payload) => {
        set({ isLoading: true, error: null });

        try {
          const res = await fetch(
            "https://shipgate-application.onrender.com/api/auth/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          const data = await safeJson(res);

          if (!res.ok) {
            throw new Error(data.message || "Invalid email or password");
          }

          const token = data.accessToken || data.token;
          const userData = data.user || {
            id: data.userId,
            fullName: data.fullName,
            email: data.email,
            role: data.role,
          };

          if (!token || !userData?.id) {
            throw new Error("Invalid email or password");
          }

          set({ user: userData, token, isLoading: false });
          return userData;
        } catch (err) {
          set({ error: err.message || "Login failed", isLoading: false });
          throw err;
        }
      },

      /* ================= LOGOUT ================= */
      logout: () => {
        set({ user: null, token: null });
      },

      /* ================= VERIFY EMAIL ================= */
      verifyEmail: async (payload) => {
        set({ isLoading: true, error: null });

        try {
          const res = await fetch(
            "https://shipgate-application.onrender.com/api/auth/verify-email",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          const data = await safeJson(res);

          if (!res.ok) {
            throw new Error(data.message || "Email verification failed");
          }

          set({ user: data.user ?? null, isLoading: false });
          return data;
        } catch (err) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },

      /* ================= RESEND VERIFICATION ================= */
      resendVerification: async (payload) => {
        set({ isLoading: true, error: null });

        try {
          const res = await fetch(
            "https://shipgate-application.onrender.com/api/auth/resend-verification",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          const data = await safeJson(res);

          if (!res.ok) {
            throw new Error(data.message || "Resend failed");
          }

          set({ isLoading: false });
          return data;
        } catch (err) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },

      /* ================= GOOGLE AUTH ================= */
      googleAuth: async (payload) => {
        set({ isLoading: true, error: null });

        try {
          const res = await fetch(
            "https://shipgate-application.onrender.com/api/auth/google",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          const data = await safeJson(res);

          if (!res.ok) {
            throw new Error(data.message || "Google auth failed");
          }

          set({
            user: data.user,
            token: data.token,
            isLoading: false,
          });

          return true;
        } catch (err) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },

      /* ================= CREATE ADMIN ================= */
      createAdmin: async (payload) => {
        set({ isLoading: true, error: null });

        try {
          const token = get().token;
          if (!token) throw new Error("Unauthorized");

          const res = await fetch(
            "https://shipgate-application.onrender.com/api/super-admin/create-admin",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(payload),
            }
          );

          const data = await safeJson(res);

          if (!res.ok) {
            throw new Error(data.message || "Failed to create admin");
          }

          set({ isLoading: false });
          return data;
        } catch (err) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },

      /* ================= USERS ================= */
      getAllUsers: async () => {
        set({ isLoading: true, error: null });

        try {
          const token = get().token;
          const res = await fetch(
            "https://shipgate-application.onrender.com/api/super-admin/all-users",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const data = await safeJson(res);

          if (!res.ok) throw new Error(data.message || "Failed");

          set({ isLoading: false });
          return {
            users: Array.isArray(data)
              ? data
              : data.users ?? data.data ?? [],
          };
        } catch (err) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },

      getUsersByRole: async (role) => {
        const token = get().token;

        const res = await fetch(
          `https://shipgate-application.onrender.com/api/super-admin/all-users/${role}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await safeJson(res);
        if (!res.ok) throw new Error(data.message || "Failed");
        return data;
      },

      getActiveUsers: async () => {
        const token = get().token;

        const res = await fetch(
          "https://shipgate-application.onrender.com/api/super-admin/active-users",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await safeJson(res);
        if (!res.ok) throw new Error(data.message || "Failed");
        return data;
      },

      /* ================= DELETE USER ================= */
      deleteUser: async (id) => {
        set({ isLoading: true, error: null });

        try {
          const token = get().token;
          const res = await fetch(
            `https://shipgate-application.onrender.com/api/super-admin/users/${id}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!res.ok) throw new Error("Delete failed");

          set({ isLoading: false });
          return true;
        } catch (err) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },
    }),
    { name: "auth-storage" }
  )
);



