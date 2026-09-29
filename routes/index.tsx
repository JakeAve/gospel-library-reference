import { ToastProvider } from "../islands/Contexts/Toast.tsx";
import Main from "../islands/Main.tsx";
import Header from "../components/Header.tsx";

export default function Home() {
  return (
    <ToastProvider>
      <main>
        <Header />
        <Main />
      </main>
    </ToastProvider>
  );
}
