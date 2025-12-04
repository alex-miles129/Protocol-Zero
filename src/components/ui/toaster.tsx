"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="bg-background border-border">
            <div className="grid gap-1">
              {title && <ToastTitle className="text-foreground">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-muted-foreground">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-full md:max-w-[420px] max-h-screen z-[100]" />
    </ToastProvider>
  )
}
