import { createContext } from "preact";
import { useContext, useRef } from "preact/hooks";

interface ToastContextType {
  showMessage: (message: string, timeout?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToastContext = () =>
  useContext(ToastContext) as ToastContextType;

export const ToastProvider = (
  { children }: { children: preact.ComponentChildren },
) => {
  const toastRef = useRef<HTMLDialogElement>(null);
  const timeoutRef = useRef<number | null>(null);

  function showMessage(message: string, timeout = 3000) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const toast = toastRef.current as HTMLDialogElement;
    toast.innerText = message;

    toast.show();

    timeoutRef.current = setTimeout(() => {
      toast.close();
      timeoutRef.current = null;
    }, timeout);
  }

  return (
    <ToastContext.Provider value={{ showMessage }}>
      {children}
      {
        <dialog
          class="fixed px-6 py-1 border shadow-md top-6 animate-bounce border-neutral-500 rounded-md shadow-neutral-500/50 outline-blue-500"
          ref={toastRef}
        >
        </dialog>
      }
    </ToastContext.Provider>
  );
};
