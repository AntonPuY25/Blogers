export const SETTINGS = {
  PORT: process.env.PORT || 3000,
  MONGO_URL:
    process.env.MONGO_URI_FOR_BLOGS_PROJECT || "mongodb://localhost:27017",
  DB_NAME: process.env.DB_NAME || "db",
  AC_SECRET: process.env.AC_SECRET || "123",
  AC_TIME: process.env.AC_TIME || "1h",
};
