"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

interface TrackingPixelsProps {
  facebookPixelId?: string | null;
  tiktokPixelId?: string | null;
}

export function TrackingPixels({
  facebookPixelId,
  tiktokPixelId,
}: TrackingPixelsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fbInitialized = useRef(false);

  const hasFacebookPixel = Boolean(facebookPixelId?.trim());
  const hasTikTokPixel = Boolean(tiktokPixelId?.trim());

  const trackPageView = useCallback(() => {
    if (hasFacebookPixel && fbInitialized.current && typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
    if (hasTikTokPixel && typeof window.ttq?.page === "function") {
      window.ttq.page();
    }
  }, [hasFacebookPixel, hasTikTokPixel]);

  const onFacebookLoad = useCallback(() => {
    if (!facebookPixelId || !hasFacebookPixel || typeof window.fbq !== "function") {
      return;
    }
    if (!fbInitialized.current) {
      window.fbq("init", facebookPixelId);
      fbInitialized.current = true;
    }
    window.fbq("track", "PageView");
  }, [facebookPixelId, hasFacebookPixel]);

  useEffect(() => {
    trackPageView();
  }, [pathname, searchParams, trackPageView]);

  return (
    <>
      {hasFacebookPixel ? (
        <Script
          src="https://connect.facebook.net/en_US/fbevents.js"
          strategy="afterInteractive"
          onLoad={onFacebookLoad}
        />
      ) : null}

      {hasTikTokPixel && tiktokPixelId ? (
        <Script
          id="tiktok-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
!function (w, d, t) {
  w.TiktokAnalyticsObject = t;
  var ttq = (w[t] = w[t] || []);
  ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
  ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; };
  for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
  ttq.load = function (e, n) {
    var r = "https://analytics.tiktok.com/i18n/pixel/events.js";
    ttq._i = ttq._i || {};
    ttq._i[e] = [];
    ttq._i[e]._u = r;
    ttq._t = ttq._t || {};
    ttq._t[e] = +new Date();
    ttq._o = ttq._o || {};
    ttq._o[e] = n || {};
    var o = d.createElement("script");
    o.type = "text/javascript";
    o.async = !0;
    o.src = r + "?sdkid=" + e + "&lib=" + t;
    var a = d.getElementsByTagName("script")[0];
    a.parentNode.insertBefore(o, a);
  };
  ttq.load("${tiktokPixelId}");
  ttq.page();
}(window, document, "ttq");
            `,
          }}
        />
      ) : null}
    </>
  );
}
