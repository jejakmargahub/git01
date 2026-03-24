export interface GeoLocation {
  city?: string;
  country?: string;
  region?: string;
  status: "success" | "fail";
}

export async function getLocationFromIP(ip: string): Promise<GeoLocation> {
  // Common local IPs to skip
  if (ip === "::1" || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return { status: "success", city: "Local", country: "Development" };
  }

  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city`);
    if (!response.ok) throw new Error("GeoIP API error");
    
    const data = await response.json();
    if (data.status === "fail") return { status: "fail" };

    return {
      status: "success",
      city: data.city,
      country: data.country,
      region: data.regionName,
    };
  } catch (error) {
    console.error("GeoIP Error:", error);
    return { status: "fail" };
  }
}
