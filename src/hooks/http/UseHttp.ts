import { useCallback, useState } from "react";
import HttpResponse from "../../types/HttpResponse";

const METHODS_WITH_BODY = ["POST", "PUT", "PATCH"];

const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const resetState = () => {
    setLoading(false);
    setError(false);
  };

  const sendHttp = useCallback(
    async <T>(configs: { url: string; method?: string; body?: object }) => {
      setLoading(true);
      setError(false);
      if (!configs.method) {
        configs.method = "GET";
      }
      const requestConfigs = { method: configs.method, cache: "no-cache" } as {
        method: string;
        body: string;
        cache: "no-cache";
        headers: { "Content-Type": string };
      };
      if (METHODS_WITH_BODY.includes(configs.method) && configs.body) {
        requestConfigs.body = JSON.stringify(configs.body);
        requestConfigs.headers = { "Content-Type": "application/json" };
      }
      const response = await fetch(configs.url, requestConfigs).catch(
        (err) => err
      );
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
    },
    []
  );

  return { loading, error, sendHttp };
};

export default useHttp;
