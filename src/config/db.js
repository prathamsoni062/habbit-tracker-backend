import dns from "dns";
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Some local DNS resolvers block MongoDB SRV lookups. Use public DNS servers for Atlas SRV resolution.
    dns.setServers(["8.8.8.8", "1.1.1.1"]);

    const connect = await mongoose.connect(process.env.CONNECTION_STRING, {
      // Mongoose 8+ uses the modern parser by default.
    });
    console.log(
      "MongoDB connected...",
      connect.connection.host,
      connect.connection.name
    );
  } catch (error) {
    console.log(error);
    // console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};