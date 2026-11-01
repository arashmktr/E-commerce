import { useCallback, useEffect, useState } from 'react';

// نتیجه‌ی یک درخواست را نگه می‌دارد. با عوض شدن deps دوباره درخواست می‌زند.
export const useFetch = (fetcher, deps = []) => {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let ignore = false;

    setState((previous) => ({ ...previous, loading: true, error: null }));

    fetcher()
      .then((data) => {
        if (!ignore) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (!ignore) setState({ data: null, loading: false, error: error.message });
      });

    // اگر کامپوننت بسته شد یا deps عوض شد، جواب قدیمی نادیده گرفته می‌شود.
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadCount]);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);

  return { ...state, reload };
};
