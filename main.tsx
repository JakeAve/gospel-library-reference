import "./assets/styles.css";
import { render } from "preact";
import Home from "./islands/Home.tsx";
import Toast from "./islands/Toast.tsx";
import Header from "./components/Header.tsx";
import SharedList from "./components/SharedList.tsx";

// GitHub Pages serves 404.html (a copy of index.html) for every unknown path,
// so the path is routed here. /S/ is what the uppercase QR links use.
function Route() {
  const path = location.pathname;
  const shared = path.match(/^\/s\/([^/]*)\/?$/i);
  if (shared) return <SharedList digits={shared[1]} />;
  if (path === "/" || path === "/index.html") return <Home />;
  return (
    <div class="page">
      <Header />
      <main class="center">
        <h2 class="page-title">Page not found</h2>
        <p class="note">Nothing is here</p>
        <a href="/">Go to GospelLibrary.Link</a>
      </main>
    </div>
  );
}

render(
  <>
    <Route />
    <Toast />
  </>,
  document.body,
);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(console.error);
}
