import { useCallback, useState } from "react";
import HttpResponse from "../../types/HttpResponse";

const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const resetState = () => {
    setLoading(false);
    setError(false);
  };

  const sendHttp = useCallback(async <T>(url: string) => {
    setLoading(true);
    setError(false);
    const response = await fetch(url).catch((err) => err);
    if (!response.ok) {
      setLoading(false);
      setError(true);
      return;
    }
    const jsonResponse = (await response.json()) as HttpResponse<T>;
    if (!(jsonResponse.errors === null || jsonResponse.errors.length === 0)) {
      setLoading(false);
      setError(true);
      return;
    }
    resetState();
    return jsonResponse;
  }, []);

  return { loading, error, sendHttp };
};

export default useHttp;
