import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/links";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What PixelPlayground stores, where it stores it, and how to delete all of it. A guest account, your scores and your streaks live in Cloudflare D1.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <main className="pp-rise w-full max-w-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl p-6 sm:p-10 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div className="text-center select-none mb-8">
          <h1 className="pixel-font text-2xl font-black uppercase tracking-wide text-slate-900 dark:text-slate-50">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs font-sans font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Last Updated: September 2026
          </p>
        </div>

        <div className="space-y-6 font-sans text-xs sm:text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300 h-96 overflow-y-auto pr-2 border-b border-slate-100 dark:border-slate-800/60 custom-scrollbar">
          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              1. The Short Version
            </h2>
            <p>
              This arcade does talk to a server. The moment you land, it quietly makes you a guest account with a silly
              random name, and from then on your wins, losses, best scores and streaks are saved to a database so the
              leaderboards mean something. There is no email, no phone number, no address book, no ad network. If you
              want all of it gone, there is a button for that, and it really does delete the rows.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              2. The Guest Account You Did Not Ask For
            </h2>
            <p>
              On your first visit the site calls our API and creates a guest account for you. That account is a row in
              our database holding a random id, a generated username along the lines of &quot;Sleepy Otter 4821&quot;,
              a flag saying you are a guest, and the time it was created. You never typed anything, and nothing about
              you was collected to build it.
            </p>
            <p>
              In return the server hands back a signed session token (a JWT, valid for 30 days) which your browser keeps
              in localStorage under the key <span className="font-mono text-[11px]">pixel-playground-session</span>. The
              token carries your account id, your display name and the guest flag. Nothing else.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              3. If You Make A Real Account
            </h2>
            <p>
              Upgrading a guest into a proper account asks for a username and a password, and that is the complete list.
              The password is never stored as you typed it: it is run through PBKDF2 with SHA-256, a random salt and
              100,000 iterations, and only that hash is written down. Nobody, including us, can read it back out.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              4. What Your Play Sends To The Server
            </h2>
            <p>When a game ends, it posts the result of that round. For every finished game we store:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>which game it was, and whether it was a win, a loss, a draw or simply completed</li>
              <li>the score, the time in seconds, the number of moves and the difficulty, where the game has those</li>
              <li>the timestamp of the round</li>
            </ul>
            <p>Alongside that we keep a running tally per game:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>plays, wins, losses and draws</li>
              <li>your best score, best time and fewest moves</li>
              <li>your current streak, your best streak and the last day you played</li>
            </ul>
            <p>
              That is the whole picture. No mouse tracking, no keystroke logging, no reading of the board while you
              think.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              5. Where It All Lives
            </h2>
            <p>
              The API is a Cloudflare Worker and the data sits in Cloudflare D1, a SQLite database, in three tables:
              accounts, individual scores and per game stats. The site itself is served from Vercel. Both of them see
              ordinary web traffic on our behalf, which includes your IP address at the moment of the request. We do not
              copy IP addresses into the database. The Worker holds one in memory only long enough to rate limit the
              sign in, sign up and delete endpoints, and it is dropped within the minute.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              6. Leaderboards Are Public
            </h2>
            <p>
              This is the one genuinely public thing here: if you place on a leaderboard, your display name and your
              best result for that game are visible to everyone who opens it. Guests are marked as guests. Rename
              yourself from the profile menu at any time if you would rather not be identifiable.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              7. What Stays On Your Device
            </h2>
            <p>
              A handful of small things never leave your browser: your session token, your light or dark theme choice,
              your music volume and track position, your chosen chill wallpaper, and your in progress 2048 board. These
              use localStorage, not cookies. Clearing your site data wipes them and logs you out, but it does not delete
              your account from the server.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              8. Measurement And Third Parties
            </h2>
            <p>
              We run Vercel Web Analytics and Vercel Speed Insights. They are cookieless and count page views, referrer,
              country, and coarse device, browser and operating system, plus loading speed figures. They do not build a
              cross site profile of you and they are not tied to your arcade account.
            </p>
            <p>
              Fonts are served from this site rather than fetched from Google. Album art for the lofi player comes from
              Unsplash through our own image endpoint. There are no advertising networks, no marketing pixels, no data
              brokers, and nothing here is sold or shared for money.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              9. Deleting Everything
            </h2>
            <p>
              Scroll to the bottom of the home page and press{" "}
              <span className="font-bold text-slate-900 dark:text-slate-100">Delete account</span>. It calls{" "}
              <span className="font-mono text-[11px]">DELETE /api/v1/users/me</span>, which removes your account row
              along with every score and every stats row attached to it, including your leaderboard entries. Registered
              accounts have to re-enter their password first so that a stolen session token cannot do it for you. There
              is no soft delete and no recycle bin, so please be sure.
            </p>
            <p>
              We keep your data until you do that. There is no scheduled purge of idle accounts, because a Wordle streak
              you abandoned for six months is still yours.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              10. Changes, And Saying Hello
            </h2>
            <p>
              PixelPlayground is a personal portfolio project, not a company, and it changes when its author feels like
              building something. If what is stored ever changes, this page changes with it and the date at the top
              moves. Questions, corrections or a request to delete something by hand:{" "}
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
