import { useState, useCallback } from 'react';
import { SmetaAPI, setAuthToken } from '../services/api';

export function useSmetaApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticate = useCallback(async (username: string, role = 'ENGINEER') => {
    setLoading(true);
    setError(null);
    try {
      const res = await SmetaAPI.login(username, role);
      if (res.token) {
        setAuthToken(res.token);
      }
      return res;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProjectsAndEstimates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsRes, estimatesRes] = await Promise.all([
        SmetaAPI.getProjects(),
        SmetaAPI.getEstimates()
      ]);
      return { projects: projectsRes.projects, estimates: estimatesRes.estimates };
    } catch (err: any) {
      setError(err.message);
      return { projects: [], estimates: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, authenticate, fetchProjectsAndEstimates };
}
