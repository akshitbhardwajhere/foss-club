import prisma from "./prisma";

/**
 * Connect to PostgreSQL Database
 * 
 * Invokes Prisma Client's connection process.
 * If the connection cannot be established, logs the error and terminates the process
 * to prevent the API server from serving requests in an unhealthy state.
 */
const connectDB = async () => {
  try {
    // Force Prisma to connect to the database immediately
    await prisma.$connect();
    if (process.env.NODE_ENV !== "production") {
      console.log("Database connected");
    }
  } catch (error: any) {
    console.error(`Database connection error: ${error.message}`);
    // Exit process with failure code if database link fails
    process.exit(1);
  }
};

export default connectDB;
