import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/feed",
          "/flare",
          "/checkin",
          "/profile",
          "/post",
          "/onboarding",
          "/api",
        ],
      },
    ],
    sitemap: "https://gout-wize.vercel.app/sitemap.xml",
  };
}
