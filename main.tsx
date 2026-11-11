import "./assets/styles.css";
import { render } from "preact";
import { ToastProvider } from "./islands/Contexts/Toast.tsx";
import Main from "./islands/Main.tsx";
import Header from "./components/Header.tsx";
import SharedList from "./components/SharedList.tsx";

// GitHub Pages serves 404.html (a copy of index.html) for every unknown path,
// so the path is routed here. /S/ is what the uppercase QR links use.
function App() {
  const path = location.pathname;
  const shared = path.match(/^\/s\/([^/]*)\/?$/i);
  if (shared) return <SharedList digits={shared[1]} />;
  if (path === "/" || path === "/index.html") {
    return (
      <ToastProvider>
        <main>
          <Header />
          <Main />
        </main>
      </ToastProvider>
    );
  }
  return (
    <div class="flex flex-col items-center justify-center px-4 py-8 mx-auto max-w-screen-md">
      <h1 class="text-4xl font-bold">404 - Page not found</h1>
      <p class="my-4">Nothing is here.</p>
      <a href="/" class="underline">Go to app</a>
    </div>
  );
}

render(<App />, document.body);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(console.error);
}
