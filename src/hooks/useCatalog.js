import { useEffect, useState } from 'react';
import { catalog } from '../catalog.js';

export default function useCatalog() {
  const [state, setState] = useState({ status: 'loading', cars: [] });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState((previous) => ({ ...previous, status: 'loading' }));
    catalog
      .list({ signal: controller.signal })
      .then((cars) => {
        if (!controller.signal.aborted) setState({ status: 'ready', cars });
      })
      .catch((error) => {
        if (error.name !== 'AbortError' && !controller.signal.aborted)
          setState({ status: 'error', cars: [] });
      });
    return () => controller.abort();
  }, [attempt]);
  return { ...state, retry: () => setAttempt((a) => a + 1) };
}
