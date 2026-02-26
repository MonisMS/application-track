import Link from "next/link";

const sections = [
  {
    title: "Job Boards",
    links: [
      {
        label: "Wellfound (AngelList)",
        url: "https://wellfound.com/jobs",
        desc: "Best for early-stage startup roles",
      },
      {
        label: "LinkedIn Jobs",
        url: "https://www.linkedin.com/jobs/",
        desc: "Broad coverage across all company sizes",
      },
      {
        label: "YC Jobs",
        url: "https://www.ycombinator.com/jobs",
        desc: "Y Combinator portfolio companies",
      },
      {
        label: "Hacker News — Who's Hiring",
        url: "https://news.ycombinator.com/jobs",
        desc: "Monthly thread, strong technical signal",
      },
    ],
  },
  {
    title: "Startup Directories",
    links: [
      {
        label: "Crunchbase",
        url: "https://www.crunchbase.com",
        desc: "Company funding data, find recently funded startups",
      },
      {
        label: "Product Hunt",
        url: "https://www.producthunt.com",
        desc: "New product launches — find teams building things",
      },
      {
        label: "Signal (NFX)",
        url: "https://signal.nfx.com/investors",
        desc: "VC and founder network",
      },
    ],
  },
  {
    title: "Outreach & Cold Email",
    links: [
      {
        label: "Apollo.io",
        url: "https://app.apollo.io",
        desc: "Find verified emails for founders and recruiters",
      },
      {
        label: "Hunter.io",
        url: "https://hunter.io",
        desc: "Email finder and verifier",
      },
    ],
  },
  {
    title: "Resume & Portfolio",
    links: [
      {
        label: "Resume.io",
        url: "https://resume.io",
        desc: "Clean resume builder",
      },
      {
        label: "read.cv",
        url: "https://read.cv",
        desc: "Minimal professional profile page",
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            ← Back
          </Link>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-white mt-2">
            Resources
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Curated links for startup job search and outreach.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
                {section.title}
              </h2>
              <div className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start justify-between px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {link.label}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {link.desc}
                      </div>
                    </div>
                    <span className="text-neutral-400 group-hover:text-blue-500 mt-0.5 ml-4 flex-shrink-0">
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
