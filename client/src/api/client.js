const BASE_URL = '/api/v1';
const DEFAULT_ERROR = 'مشکلی پیش آمد. دوباره تلاش کنید.';

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

const send = async (path, { method = 'GET', body } = {}) => {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => null);

  return { response, data };
};

const refreshAccessToken = async () => {
  const { response, data } = await send('/auth/refresh', { method: 'POST' });
  if (!response.ok) return false;

  setAccessToken(data.accessToken);
  return true;
};

const createError = (response, data) => {
  const error = new Error(data?.message || DEFAULT_ERROR);
  error.status = response.status;
  return error;
};

export const request = async (path, options = {}) => {
  let { response, data } = await send(path, options);

  // توکن کوتاه‌مدت منقضی شده؟ یک بار نشست را تمدید می‌کنیم و دوباره می‌فرستیم.
  const canRetry = response.status === 401 && !path.startsWith('/auth/');
  if (canRetry && (await refreshAccessToken())) {
    ({ response, data } = await send(path, options));
  }

  if (!response.ok) throw createError(response, data);
  return data;
};
