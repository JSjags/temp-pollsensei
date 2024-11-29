// src/@types/mixpanel-browser.d.ts
declare module "mixpanel-browser" {
  export interface Mixpanel {
    track_pageview(properties?: Record<string, any>): void;
    // Add other methods and properties as needed
  }

  const mixpanel: Mixpanel;
  export default mixpanel;
}
