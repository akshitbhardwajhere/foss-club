import prisma from './prisma';

const connectDB = async () => {
  try {
    // Attempt to explicitly connect to the database via Prisma
    await prisma.$connect();
    console.log('PostgreSQL (Supabase) Connected Successfully');
  } catch (error: any) {
    console.error(`Error connecting to database: ${error.message}`);
    console.error('Note: If you are seeing connection timeouts, you likely need to use the IPv4 connection pooling string from Supabase instead of the direct db.[projectId].supabase.co string.');
    process.exit(1);
  }
};

export default connectDB;
