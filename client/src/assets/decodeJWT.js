export default (token) => {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) {
    console.error("Invalid JWT format");
    return null;
  }

  try {
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));

    return JSON.parse(decoded);
  } catch (e) {
    console.error("Failed to decode JWT:", e);
    return null;
  }
};
