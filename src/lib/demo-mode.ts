// Demo mode: bypass database when DATABASE_URL is not configured or is a placeholder
const dbUrl = process.env.DATABASE_URL || "";
export const IS_DEMO_MODE =
  !dbUrl ||
  dbUrl === "your_neon_database_url_here" ||
  dbUrl.includes("user:password@host") ||
  dbUrl.includes("user:password@ep-") ||
  dbUrl === "postgresql://" ||
  dbUrl.length < 30;
