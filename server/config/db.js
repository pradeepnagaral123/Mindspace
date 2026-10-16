import mongoose from "mongoose";
import dns from "dns";

// Node's c-ares resolver can fail SRV lookups (querySrv ECONNREFUSED) against
// some local/ISP DNS servers on Windows, which breaks mongodb+srv:// URIs.
// In development only, fall back to public resolvers. Production uses the
// platform's DNS (Render/Vercel work fine).
if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
}

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is not set. Add it in the Render dashboard (Environment tab) or server/.env"
      );
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
