import type { Config } from 'tailwindcss';

// Tailwind's default breakpoints (sm 640 / md 768 / lg 1024 / xl 1280) are used
// as the closest standard approximation of the FRD's mobile (<=480) / tablet
// (768-1024) / desktop (>=1280) targets: unprefixed = mobile-first base,
// `md:` = tablet start, `xl:` = desktop start. Documented in README.
// darkMode is configured for completeness/future one-off overrides, but the
// app's actual theming mechanism is CSS custom properties keyed off
// [data-theme] (see src/index.css) — every `bg-bg-*`/`text-fg-*`/etc. class
// below already resolves to the right value in both themes without needing
// `dark:` variants anywhere.
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: {
          primary: 'var(--background-primary)',
          secondary: 'var(--background-secondary)',
          tertiary: 'var(--background-tertiary)',
          quaternary: 'var(--background-quaternary)',
          disabled: 'var(--background-disabled)',
          canvas: 'var(--background-canvas)',
        },
        fg: {
          primary: 'var(--foreground-primary)',
          secondary: 'var(--foreground-secondary)',
          tertiary: 'var(--foreground-tertiary)',
          quaternary: 'var(--foreground-quaternary)',
          inverse: 'var(--foreground-inverse-primary)',
        },
        border: {
          bounds: 'var(--border-bounds)',
          glass: 'var(--border-glass-primary)',
          'glass-secondary': 'var(--border-glass-secondary)',
        },
        brand: {
          DEFAULT: 'var(--purple-200)',
          hover: 'var(--purple-100)',
          100: 'var(--purple-100)',
          200: 'var(--purple-200)',
          // Theme-aware, contrast-verified for actual readable TEXT — distinct
          // from the raw DEFAULT above, which is fine for backgrounds/borders/
          // icons but fails AA as text on dark surfaces (2.91:1). Light mode:
          // identical to raw purple-200 (already passes at 6.30:1).
          text: 'var(--foreground-brand)',
        },
        // Added for the reference reskin's logo mark / chart accents —
        // decorative/non-text use only (icon chips, chart fills, glow),
        // same "not for real text" caveat as system.*-raw above.
        cyan: {
          100: 'var(--cyan-100)',
          200: 'var(--cyan-200)',
        },
        accent: {
          blue: 'var(--blue-accent)',
        },
        interactive: {
          'secondary-default': 'var(--background-interactive-secondary-default)',
          'secondary-hover': 'var(--background-interactive-secondary-hover)',
        },
        system: {
          // Safe for text/icons — theme-aware, contrast-verified (see index.css).
          success: 'var(--foreground-success)',
          danger: 'var(--foreground-danger)',
          warning: 'var(--system-yellow)',
          attention: 'var(--foreground-attention)',
          'attention-raw': 'var(--system-orange)',
          // Exact Figma hues, unmodified — for non-text uses only (chart
          // fills, status dots) where AA text-contrast doesn't apply.
          'success-raw': 'var(--system-green)',
          'danger-raw': 'var(--system-red)',
          // Solid-fill surfaces (white text on top) — verified 5.46:1 / 5.05:1.
          'success-solid': 'var(--background-success-solid)',
          'danger-solid': 'var(--background-danger-solid)',
        },
        tips: {
          informative: 'var(--background-tips-informative)',
          danger: 'var(--background-tips-danger)',
        },
      },
      borderRadius: {
        number: 'var(--radius-number)',
        primary: 'var(--radius-primary)',
        secondary: 'var(--radius-secondary)',
        tertiary: 'var(--radius-tertiary)',
        quaternary: 'var(--radius-quaternary)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        'glass-default': 'var(--shadow-glass-default)',
        'glass-hover': 'var(--shadow-glass-hover)',
        'light-default': 'var(--shadow-light-default)',
        'light-hover': 'var(--shadow-light-hover)',
        'brand-glow': 'var(--shadow-brand-glow)',
      },
      backgroundImage: {
        // Deliberately NOT named `brand`/`brand-mono` — `colors.brand` above
        // already owns `bg-brand` for the solid purple fill used elsewhere
        // (AIInsightsPanel, ConversionFunnel, FeatureUsage); reusing that
        // name here would generate a second, colliding `.bg-brand` class.
        'brand-gradient': 'var(--gradient-brand)',
        'brand-gradient-mono': 'var(--gradient-brand-mono)',
      },
      backdropBlur: {
        glass: '20px',
      },
      fontSize: {
        // Every size below previously used a uniform 110% line-height,
        // including sizes that regularly wrap (form errors, hints, card
        // descriptions, insight captions) — 110% is a heading-appropriate
        // leading, not a body one, and reads as cramped once a line wraps.
        // Differentiated by tier instead: display (short, usually one line)
        // stays fairly tight; body/label (can wrap) get standard reading
        // leading, roughly matching Tailwind's own leading-normal (150%)
        // for the largest body size, tapering slightly for the smaller
        // tiers the way most type scales do. Sizes/weights unchanged except
        // where called out.
        'display-lg': ['32px', { lineHeight: '120%', fontWeight: '600' }],
        'display-md': ['20px', { lineHeight: '125%', fontWeight: '600' }],
        // Weight 400->600: this size is used exclusively for real headings
        // (dialog titles, "Project Activity", "Recent Activity", "Upcoming
        // Deadlines") — at regular weight it didn't read as a heading next
        // to display-md/-lg, which are both already 600. Bringing it in
        // line fixes the "headings need consistent weight" gap directly.
        'display-sm': ['18px', { lineHeight: '130%', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '150%', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '145%', fontWeight: '500' }],
        'body-sm': ['12px', { lineHeight: '145%', fontWeight: '500' }],
        'label-lg': ['12px', { lineHeight: '140%', fontStyle: 'italic' }],
        'label-lg2': ['14px', { lineHeight: '140%', fontStyle: 'italic' }],
        // 10px->11px: this is the size used for form validation errors,
        // form hints, and chart/card captions (10 files) — genuinely small
        // enough to read as "too small" at 10px for content that isn't
        // purely decorative. 1px has no layout risk here: every consumer
        // is a flex/inline-flex row or a wrapping <p>, not a fixed-width
        // container.
        'label-sm': ['11px', { lineHeight: '140%', fontWeight: '400' }],
        // Same reasoning, applied to status badges (StatusBadge/DeltaBadge)
        // specifically — kept slightly tighter leading than label-sm since
        // these are single-line pills, not wrapping text.
        'label-sm2': ['11px', { lineHeight: '130%', fontWeight: '600' }],
      },
      transitionDuration: {
        DEFAULT: '160ms',
      },
    },
  },
  plugins: [],
} satisfies Config;
