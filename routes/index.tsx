import { ToastProvider } from "../islands/Contexts/Toast.tsx";
import Main from "../islands/Main.tsx";

export default function Home() {
  return (
    <ToastProvider>
      <main class="pt-4">
        <h1 class="text-xl text-center mb-4 tracking-widest">
          GospelLibrary.Link
        </h1>
        <Main />
      </main>
    </ToastProvider>
  );
}
