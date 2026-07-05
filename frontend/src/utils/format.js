export const apiRoot = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");

export const bookImage = (image) => {
  if (!image) return "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80";
  return image.startsWith("/uploads") ? `${apiRoot}${image}` : image;
};

export const money = (value = 0) => `Rs. ${Number(value).toLocaleString("en-IN")}`;

export const shortId = (id = "") => `#${id.slice(-6).toUpperCase()}`;

export const statusTone = (status = "") => {
  const normalized = status.toLowerCase();
  if (["paid", "delivered", "success"].includes(normalized)) return "success";
  if (["cancelled", "failed"].includes(normalized)) return "danger";
  if (["shipped", "processing"].includes(normalized)) return "info";
  return "warning";
};

