import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://rubytraveldanang.com",
      lastModified: new Date(),
    },
    {
      url: "https://rubytraveldanang.com/ve-ba-na-hills",
      lastModified: new Date(),
    },
  ];
}
