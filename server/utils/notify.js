import Notification from "../models/Notification.js";

// In-app notifications only — never sends email.
export async function notify({ user, type = "system", title, body = "", link = "" }) {
  try {
    if (!user || !title) return null;
    return await Notification.create({ user, type, title, body, link });
  } catch (error) {
    console.error("notify error:", error.message);
    return null;
  }
}
