"use client";

import { useEffect } from "react";

// Component to add additional meta tags and links for PWA
export function IconLinks() {
  useEffect(() => {
    // Add additional meta tags and links
    const addMetaTag = (name: string, content: string, attribute: string = "name") => {
      if (!document.querySelector(`meta[${attribute}="${name}"]`)) {
        const meta = document.createElement("meta");
        meta.setAttribute(attribute, name);
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      }
    };

    const addLinkTag = (rel: string, href: string, sizes?: string, type?: string) => {
      const existing = document.querySelector(`link[rel="${rel}"]${sizes ? `[sizes="${sizes}"]` : ""}`);
      if (!existing) {
        const link = document.createElement("link");
        link.setAttribute("rel", rel);
        link.setAttribute("href", href);
        if (sizes) link.setAttribute("sizes", sizes);
        if (type) link.setAttribute("type", type);
        document.head.appendChild(link);
      }
    };

    // Add meta tags
    addMetaTag("apple-mobile-web-app-capable", "yes");
    addMetaTag("apple-mobile-web-app-status-bar-style", "black-translucent");
    addMetaTag("apple-mobile-web-app-title", "Knowledge Explorer");

    // Add link tags for additional icons (if they exist)
    addLinkTag("icon", "/favicon-16x16.png", "16x16", "image/png");
    addLinkTag("icon", "/favicon-32x32.png", "32x32", "image/png");
    addLinkTag("icon", "/favicon.ico");
    addLinkTag("apple-touch-icon", "/apple-touch-icon.png", "180x180", "image/png");
  }, []);

  return null;
}

