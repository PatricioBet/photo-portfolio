import { useState, useCallback, useEffect, useRef } from "react";
import { Job, Build, Release } from "../types";
import * as api from "../api/client";

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getJobs({ limit: "50" });
      setJobs(res.items);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  // Poll for updates every 10 seconds if there are active jobs
  const hasActiveJobs = jobs.some(
    (j) => j.status === "queued" || j.status === "processing"
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (hasActiveJobs) {
      intervalRef.current = setInterval(fetch, 10000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hasActiveJobs, fetch]);

  return { jobs, loading, error, refresh: fetch };
}

export function useBuilds() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [triggering, setTriggering] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getBuilds();
      setBuilds(data);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const trigger = useCallback(async () => {
    setTriggering(true);
    try {
      const newBuild = await api.triggerBuild();
      setBuilds((prev) => [newBuild, ...prev]);
      return { success: true };
    } catch (e) {
      if (e instanceof Error) return { success: false, error: e.message };
      return { success: false, error: "Error desconocido" };
    } finally {
      setTriggering(false);
    }
  }, []);

  return { builds, loading, error, triggering, trigger, refresh: fetch };
}

export function useReleases() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rollingBack, setRollingBack] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getReleases();
      setReleases(data);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const rollback = useCallback(
    async (releaseId: string) => {
      setRollingBack(releaseId);
      try {
        await api.rollbackRelease(releaseId);
        await fetch();
        return { success: true };
      } catch (e) {
        if (e instanceof Error) return { success: false, error: e.message };
        return { success: false, error: "Error desconocido" };
      } finally {
        setRollingBack(null);
      }
    },
    [fetch]
  );

  return { releases, loading, error, rollingBack, rollback, refresh: fetch };
}
