import { Icon } from "../islands/Icons.tsx";

export default function Header() {
  return (
    <header class="top">
      <h1 class="wordmark">
        <a href="/">GospelLibrary.Link</a>
      </h1>
      <div class="meta">
        <a
          class="btn-icon neutral"
          href="https://github.com/JakeAve/gospel-library-reference"
          target="_blank"
          rel="noopener"
          aria-label="Source code"
          title="Source code"
        >
          <Icon name="github" />
        </a>
        <span id="version">v0.1.21</span>
        <a
          class="btn-icon neutral"
          href="/"
          aria-label="Update"
          title="Update"
        >
          <Icon name="refresh" />
        </a>
      </div>
    </header>
  );
}
