import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, GITHUB_REPO } from "@/lib/links";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "The plain rules for playing PixelPlayground: a free portfolio project with guest accounts, public leaderboards, no warranty and a delete button that works.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <main className="pp-rise w-full max-w-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl p-6 sm:p-10 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div className="text-center select-none mb-8">
          <h1 className="pixel-font text-2xl font-black uppercase tracking-wide text-slate-900 dark:text-slate-50">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs font-sans font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Agreement &amp; Scope of Use
          </p>
        </div>

        <div className="space-y-6 font-sans text-xs sm:text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300 h-96 overflow-y-auto pr-2 border-b border-slate-100 dark:border-slate-800/60 custom-scrollbar">
          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              1. What This Actually Is
            </h2>
            <p>
              PixelPlayground is a personal portfolio project built by one developer to show what he can make. It is
              free, there is nothing to buy, and there is no company standing behind it. Treat it as a nice place to
              waste ten minutes, not as infrastructure you depend on. The source is public on{" "}
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-violet-600 dark:text-violet-300 underline underline-offset-2"
              >
                GitHub
              </a>
              .
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              2. Your Account
            </h2>
            <p>
              There is nothing to fill in to start playing, but there is an account. The site creates a guest account
              for you automatically on your first visit so that scores and streaks have somewhere to live. You can turn
              that guest into a registered account with a username and a password, which keeps your history and lets you
              sign in from another device. Keep your password to yourself: anyone holding it is you, as far as the
              leaderboard is concerned.
            </p>
            <p>
              Usernames are public. Pick something you would be happy to see on a leaderboard next to a stranger. Names
              chosen to harass, impersonate or shock may be reset or removed without notice.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              3. Play Fair
            </h2>
            <p>
              Scores are validated on the server, but a determined person can always find a way. Please do not be that
              person: no scripted or automated play, no posting fabricated results to the API, no hammering the
              endpoints, and no attempts to break into other people&apos;s accounts or into the database. Entries that
              are obviously not from a human playing a game get removed, and repeat offenders lose their account.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              4. What Happens To Your Account
            </h2>
            <p>
              You can delete it whenever you like. The <span className="font-bold text-slate-900 dark:text-slate-100">Delete account</span>{" "}
              button at the bottom of the home page removes your account together with every score and every stat tied
              to it, immediately and permanently. Nothing is archived, so there is nothing to restore afterwards.
            </p>
            <p>
              From our side, an account may be removed for the abuse described above. Clearing your browser data does
              not delete anything on the server, it only forgets the session token on that device, so a guest account
              you walk away from simply sits there until you come back or delete it.
            </p>
            <p>
              If this project is ever shut down, the database goes with it. Anything you would miss should not live only
              here.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              5. No Promises About Uptime
            </h2>
            <p>
              Everything here is provided as is, with no warranty of any kind. There is no uptime target, no support
              queue and no guarantee your scores survive a bad deploy. The games stay playable when the API is
              unreachable, but rounds you finish while it is down are not recorded. To the fullest extent the law
              allows, the author is not liable for anything that follows from using the site, including lost scores and
              lost streaks.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              6. Credit Where It Is Due
            </h2>
            <p>
              The code is MIT licensed and yours to read, fork and learn from. The music and the wallpapers are CC0 or
              otherwise freely licensed, and every track is credited inside the app. Classic game rules are not anybody&apos;s property, but the names of the originals belong to their respective owners and this site is not
              affiliated with any of them.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              7. Changes And Contact
            </h2>
            <p>
              These terms change when the site changes, and the current version is always the one on this page. Carrying
              on playing after an update means you are fine with it. Found a bug, disagree with something here, or want
              an account removed by hand? Write to{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-bold text-violet-600 dark:text-violet-300 underline underline-offset-2"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>

        <Link href="/" className="block w-full mt-8">
          <button className="w-full rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-900 dark:hover:bg-slate-50 py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98] shadow-sm cursor-pointer">
            Back To The Arcade
          </button>
        </Link>
      </main>
    </div>
  );
}
