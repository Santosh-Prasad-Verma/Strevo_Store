export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "";

export const pageview = (url: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("config", GA_ID, { page_path: url });
  }
};

export const event = ({ action, category, label, value }: any) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, { event_category: category, event_label: label, value });
  }
};

export const fbEvent = (name: string, data?: any) => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", name, data);
  }
};
