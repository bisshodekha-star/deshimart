"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * ক্লায়েন্ট সাইডে অ্যাডমিন লগইন স্ট্যাটাস ট্র্যাক করে।
 * কুকি HttpOnly তাই সরাসরি পড়া যায় না — তাই প্রটেক্টেড API-র
 * রেসপন্স কোড (401 = লগইন নেই) দিয়েই স্ট্যাটাস জানা যায়।
 */
export function useAdminSession() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  const check = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/categories", { cache: "no-store" });
      setAuthed(res.ok);
    } catch {
      setAuthed(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  return { authed, checking, setAuthed, recheck: check };
}
