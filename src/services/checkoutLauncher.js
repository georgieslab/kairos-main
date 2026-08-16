// src/services/checkoutLauncher.js
//
// Opens a Stripe Checkout URL and tells the caller when the user is finished
// with it. "Finished" means paid or abandoned — we cannot tell which from the
// client, and we do not need to: the webhook grants access server-side, so the
// only thing the app has to do afterwards is re-read its own state.
//
// The two platforms need opposite things and this is the whole reason the file
// exists:
//
//   Web    — the popup must be opened synchronously, before any await, or the
//            browser's popup blocker kills it. Completion is detected by
//            polling window.closed, because a cross-origin popup tells us
//            nothing else.
//
//   Native — there is no popup blocker and no popup. window.location.href here
//            navigates the WebView itself to Stripe, which is how a user ended
//            up finishing payment in a browser outside the app with no way
//            back. The in-app browser is opened after the URL is known, and
//            Capacitor tells us when it closes.
//
// Callers await `finished` and then refresh. They should not branch on
// platform themselves.

// @capacitor/browser is imported dynamically, inside the native branch below,
// rather than at the top of this file.
//
// The reason is the dev server. A static import pulls a new dependency into
// Vite's graph the moment this module is first requested, which re-triggers
// dependency optimization and kills the in-flight request with "504 Outdated
// Optimize Dep" — and it stays broken until the server is restarted, which is
// not obvious when all you see is a failed import. That cost an afternoon once.
//
// It does NOT keep the plugin out of the web bundle, which was the other hoped-
// for benefit: Rollup inlines this import into the main chunk, so the code
// ships either way and is merely not evaluated until called. Checked in the
// built output rather than assumed. Being inlined does at least mean there is
// no separate chunk that could fail to load mid-purchase.
//
// @capacitor/core is safe to import statically: App.jsx already does, so it is
// in the graph from startup.
import { Capacitor } from '@capacitor/core';

export const isNative = () => Capacitor.isNativePlatform();

/**
 * Open a popup ahead of an async call, on web only.
 * Must be called synchronously from the click handler that triggers checkout.
 * @returns {Window|null} the popup, or null on native / if blocked
 */
export const preOpenPopup = () => {
  if (isNative()) return null;
  return window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
};

/**
 * Send the user to `url` and resolve once they are done with it.
 * @param {string} url Stripe Checkout URL
 * @param {Window|null} popupWindow the window from preOpenPopup, if any
 * @returns {Promise<{via: string}>} resolves when the user returns
 */
export const openCheckout = async (url, popupWindow = null) => {
  if (isNative()) {
    const { Browser } = await import('@capacitor/browser');

    // Resolve when the in-app browser closes. Stripe redirects to the
    // success/cancel URL inside this browser; the user then dismisses it,
    // which is the signal we act on. Android App Links cannot be relied on to
    // bounce the redirect back into the app — Android generally will not leave
    // an already-open browser for a URL reached by redirect, which is exactly
    // what a Stripe success URL always is.
    const done = new Promise((resolve) => {
      let handle = null;
      let settled = false;
      const finish = (via) => {
        if (settled) return;
        settled = true;
        // Drop the listener, so repeat purchases in one session do not stack
        // handlers that all fire on the next close.
        if (handle) handle.remove();
        resolve({ via });
      };
      Browser.addListener('browserFinished', () => finish('closed'))
        .then((h) => {
          handle = h;
          // addListener resolves asynchronously; if the browser was already
          // dismissed by then, remove it here instead of leaking it.
          if (settled) h.remove();
        })
        .catch(() => { /* listener unavailable; the resume handler still covers us */ });
    });

    await Browser.open({ url, presentationStyle: 'popover' });
    return done;
  }

  if (popupWindow && !popupWindow.closed) {
    popupWindow.location.href = url;
    return new Promise((resolve) => {
      const poll = setInterval(() => {
        if (popupWindow.closed) {
          clearInterval(poll);
          resolve({ via: 'popup-closed' });
        }
      }, 1000);
    });
  }

  // Popup blocked. Navigating the tab away is the last resort: the page is
  // unloaded, so nothing here will run again and the caller's refresh never
  // happens. The success URL carries ?checkout=success for that reason — the
  // app reads it on next load.
  window.location.href = url;
  return new Promise(() => {}); // never resolves; the page is going away
};

/**
 * Open any external URL — the Stripe customer portal, say — and resolve when
 * the user comes back. Same platform split as openCheckout, but without the
 * pre-opened popup, since these are not triggered from a blocked-popup path.
 * @param {string} url
 * @returns {Promise<{via: string}>}
 */
export const openExternalUrl = async (url) => {
  if (isNative()) return openCheckout(url, null);

  const win = window.open(url, '_blank');
  if (!win) {
    // Blocked. Better a same-tab navigation than nothing happening at all.
    window.location.href = url;
    return new Promise(() => {});
  }
  return new Promise((resolve) => {
    const poll = setInterval(() => {
      if (win.closed) {
        clearInterval(poll);
        resolve({ via: 'popup-closed' });
      }
    }, 1000);
  });
};
