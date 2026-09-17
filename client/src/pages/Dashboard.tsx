import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { DashboardGreeting } from '@/components/dashboard/DashboardGreeting';
import { StatCardsRow } from '@/components/dashboard/StatCardsRow';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { RecentActivityTable } from '@/components/dashboard/RecentActivityTable';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { useDashboardSummary } from '@/hooks/useDashboardSummary';

/**
 * FRD SCOPE NOTE (superseding the old Phase 5 note below the fold of this
 * file's history): per MERN_Dashboard_Challenge_FRD.md §4.2, Dashboard Home
 * is exactly three data-driven sections — stat cards (FR-6), one activity
 * chart (FR-7), and recent activity (FR-8) — all backed by the real
 * GET /api/dashboard/summary aggregation, scoped server-side to the
 * logged-in user (`{ $match: { owner } }` in dashboardService.ts). Nothing
 * on this page is mock data.
 *
 * Removed in this pass (were Figma-reference additions with no FRD basis
 * and no backing data model — see the FRD's explicit removal list): Client
 * Segmentation ("Clients"/Status Mix), Feature Usage, Customer
 * Satisfaction, Conversion Funnel, Sales Cycle, Support Tickets, and the
 * scripted AI Insights panel. Their component files and the mock dataset
 * that fed them (data/mockDashboardData.ts, types/dashboardVisualOnly.ts)
 * were deleted rather than left as dead code.
 *
 * Kept despite not being literally named in FR-6/7/8, since neither is
 * mock/fabricated data, neither is a "business analytics" section, and
 * neither was on the FRD task's explicit removal list — flagging both as
 * open questions rather than deciding silently:
 *  - DashboardGreeting: real name (useAuth) + real date, added earlier to
 *    match the Figma reference's header. Pure UI chrome, not a data
 *    section, but happy to remove if you want the page trimmed further.
 *  - UpcomingDeadlines: real per-user data from the same aggregation
 *    (`upcomingDeadlines` facet), directly tied to Project.dueDate. Not
 *    "recent activity" (FR-8) but not unrelated business analytics either.
 */
export default function Dashboard() {
  const { data, status, error, refetch } = useDashboardSummary();
  const location = useLocation();

  // Handles arriving here via Sidebar's cross-page navigation (clicking a
  // section like "Activity" while on /dashboard/projects navigates to
  // /dashboard#activity) — scroll to that section once this page has
  // rendered. Section wrapper elements render immediately regardless of
  // data-loading status, so no extra delay/retry is needed here.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Deliberately only depends on the hash itself — re-running this on
    // every render (e.g. when dashboard data refreshes) would keep
    // re-scrolling the page every few seconds, which isn't what we want.
  }, [location.hash]);

  return (
    <Container className="flex flex-col gap-6 py-6">
      <DashboardGreeting />

      {/* FR-6: stat cards, real MongoDB aggregate counts */}
      <section id="overview" className="scroll-mt-24">
        <StatCardsRow status={status} stats={data?.stats} onRetry={refetch} />
      </section>

      {/* FR-7: one chart, projects created/completed over time */}
      <div id="activity" className="min-w-0 scroll-mt-24">
        <RevenueChart status={status} data={data?.activity} onRetry={refetch} />
      </div>

      {/* FR-8 (Recent Activity) + the real, scoped Upcoming Deadlines facet
          — see the scope note above for why the latter stayed. */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div id="recent-activity" className="min-w-0 scroll-mt-24">
          <RecentActivityTable status={status} items={data?.recentActivity} onRetry={refetch} />
        </div>
        <div className="min-w-0">
          <UpcomingDeadlines status={status} items={data?.upcomingDeadlines} onRetry={refetch} />
        </div>
      </div>

      {status === 'error' && error && (
        <p role="alert" className="text-center text-body-sm text-system-danger">
          {error}
        </p>
      )}
    </Container>
  );
}
