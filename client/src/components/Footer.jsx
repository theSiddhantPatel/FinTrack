import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => (
  <footer className="mt-8 border-t border-slate-200 py-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-300">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
      <p>FinTrack © 2026</p>
      <div className="flex items-center gap-3 text-lg">
        <a
          href="https://github.com/theSiddhantPatel"
          target="_blank"
          rel="noreferrer"
          className="hover:text-emerald-500"
        >
          <FaGithub />
        </a>
        <a
          href="https://linkedin.com/in/siddhantpatel-"
          target="_blank"
          rel="noreferrer"
          className="hover:text-emerald-500"
        >
          <FaLinkedin />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
