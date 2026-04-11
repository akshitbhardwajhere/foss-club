export interface AdminDashboardStats {
  events: { total: number; upcoming: number; past: number };
  team: { total: number };
  blogs: { total: number };
  queries: { total: number };
}
