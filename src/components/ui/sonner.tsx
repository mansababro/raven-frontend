import React from "react";
import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={"dark" as ToasterProps["theme"]}
      position="top-center"
      className="toaster group"
      style={
        {
          "--normal-bg": "#1f1e1e",
          "--normal-text": "#ffffff",
          "--normal-border": "#3a3a3a",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          fontFamily: "Saira, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
