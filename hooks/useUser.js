'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    setLoading(true);
    try {
      const res = await api.get('/api/auth/me');
      if (res.ok) setUser(await res.json());
      else setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);
  return { user, loading, refreshUser };
}
