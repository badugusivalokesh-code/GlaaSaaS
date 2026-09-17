import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { LayoutGrid, LineChart, FolderKanban, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

/** Shared active-state styling: a solid brand-gradient pill with white text,
 * matching the reference's active nav treatment (previously a faint tinted
 * background). Inline style (not a Tailwind arbitrary class) for the same
 * reason the dropdown panels elsewhere in this file/Topbar use inline
 * `style={{ background: ... }}` — a gradient CSS-var can't be expressed
 * reliably as a Tailwind arbitrary-value class.
 *
 * Uses --gradient-brand-mono (purple-only), not --gradient-brand: the
 * latter's cyan-200 endpoint measures 1.81:1 with white text — badly
 * fails AA. gradient-brand-mono's two stops are both individually
 * verified >=4.5:1 with white text (see index.css), so the label/icon
 * stay readable wherever they land on the pill. This also matches the
 * approved reference more closely, which shows the active item as a
 * fairly uniform purple, not a purple-to-cyan blend. */
const ACTIVE_PILL_STYLE = { backgroundImage: 'var(--gradient-brand-mono)' };

export interface SidebarSection {
  id: string;
  label: string;
}

const SECTIONS: SidebarSection[] = [
  { id: 'overview', label: 'Dashboard' },
  { id: 'activity', label: 'Activity' },
];

const ICONS: Record<string, typeof LayoutGrid> = {
  overview: LayoutGrid,
  activity: LineChart,
};

interface SidebarProps {
  onNavigate?: () => void;
  /** Compact icon-only rail for tablet widths — same behavior, no text
   * labels. Each icon keeps a title/aria-label so it's still identifiable. */
  collapsed?: boolean;
}

export function Sidebar({ onNavigate, collapsed = false }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const onDashboard = location.pathname === '/dashboard';

  // Previously these just called scrollIntoView, which silently did nothing
  // if the target section wasn't on the current page (e.g. clicking
  // "Activity" while on /dashboard/projects). Now: scroll directly if
  // already on /dashboard, otherwise navigate there with the section as a
  // hash so Dashboard's own mount effect can scroll to it once it renders.
  function handleSectionClick(id: string) {
    if (onDashboard) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate(`/dashboard#${id}`);
    }
    onNavigate?.();
  }

  return (
    <nav aria-label="Dashboard sections" className={`flex h-full flex-col ${collapsed ? 'items-center px-2 py-6' : 'px-4 py-6'}`}>
      <div className={`flex items-center ${collapsed ? 'flex-col gap-2' : 'justify-between px-2'}`}>
        <div className={`flex items-center gap-3 ${collapsed ? 'flex-col gap-1' : ''}`}>
          <Logo size={34} glow />
          {/* Collapsed mode keeps the logo mark (branding stays visible per
              the requirement) but drops the wordmark text to save width. */}
          {!collapsed && (
            <div>
              <p className="text-body-md font-semibold leading-tight text-fg-primary">PulseBoard</p>
              <p className="text-label-sm text-fg-secondary">Analytics</p>
            </div>
          )}
        </div>
        {onNavigate && !collapsed && (
          <button
            type="button"
            onClick={onNavigate}
            aria-label="Close menu"
            className="rounded-secondary p-2 text-fg-secondary hover:bg-bg-quaternary hover:text-fg-primary"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className={`mt-8 flex-1 overflow-y-auto scroll-area ${collapsed ? 'w-full' : ''}`}>
        {!collapsed && <p className="px-2 text-label-sm uppercase tracking-wide text-fg-secondary">Main</p>}
        <ul className={`mt-2 flex flex-col gap-1 ${collapsed ? 'items-center' : ''}`}>
          <SidebarButton
            section={SECTIONS[0]}
            isActive={onDashboard}
            collapsed={collapsed}
            onClick={() => handleSectionClick(SECTIONS[0].id)}
          />
        </ul>

        {!collapsed && <p className="mt-6 px-2 text-label-sm uppercase tracking-wide text-fg-secondary">Analytics</p>}
        <ul className={`mt-2 flex flex-col gap-1 ${collapsed ? 'items-center' : ''}`}>
          {SECTIONS.slice(1).map((s) => (
            <SidebarButton
              key={s.id}
              section={s}
              collapsed={collapsed}
              onClick={() => handleSectionClick(s.id)}
            />
          ))}
        </ul>

        {!collapsed && <p className="mt-6 px-2 text-label-sm uppercase tracking-wide text-fg-secondary">Work</p>}
        <ul className={`mt-2 flex flex-col gap-1 ${collapsed ? 'items-center' : ''}`}>
          <li>
            <NavLink
              to="/dashboard/projects"
              onClick={onNavigate}
              title={collapsed ? 'Projects' : undefined}
              aria-label={collapsed ? 'Projects' : undefined}
              style={({ isActive }) => (isActive ? ACTIVE_PILL_STYLE : undefined)}
              className={({ isActive }) =>
                `flex items-center rounded-secondary text-body-sm transition-colors duration-150 ${
                  collapsed ? 'h-10 w-10 justify-center' : 'gap-3 px-3 py-2.5'
                } ${
                  isActive
                    ? 'font-medium text-white shadow-light-default'
                    : 'text-fg-secondary hover:bg-bg-quaternary hover:text-fg-primary'
                }`
              }
            >
              <FolderKanban size={18} aria-hidden="true" />
              {!collapsed && 'Projects'}
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function SidebarButton({
  section,
  isActive,
  collapsed,
  onClick,
}: {
  section: SidebarSection;
  isActive?: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  const Icon = ICONS[section.id];
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        title={collapsed ? section.label : undefined}
        aria-label={collapsed ? section.label : undefined}
        aria-current={isActive ? 'page' : undefined}
        style={isActive ? ACTIVE_PILL_STYLE : undefined}
        className={`flex items-center text-left text-body-sm transition-colors duration-150 ${
          collapsed ? 'h-10 w-10 justify-center rounded-secondary' : 'w-full gap-3 rounded-secondary px-3 py-2.5'
        } ${
          isActive
            ? 'font-medium text-white shadow-light-default'
            : 'text-fg-secondary hover:bg-bg-quaternary hover:text-fg-primary'
        }`}
      >
        <Icon size={18} aria-hidden="true" />
        {!collapsed && section.label}
      </button>
    </li>
  );
}

export { SECTIONS as SIDEBAR_SECTIONS };
