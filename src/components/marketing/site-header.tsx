import { auth } from "@/auth";
import { HeaderChrome } from "@/components/marketing/header-chrome";

export async function SiteHeader() {
  const session = await auth();

  return (
    <HeaderChrome
      ctaHref={session?.user ? "/dashboard" : "/login"}
      ctaLabel={session?.user ? "Dashboard" : "Sign in"}
    />
  );
}
