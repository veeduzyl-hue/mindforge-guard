import { NextRequest, NextResponse } from "next/server";

import { consumeMagicLink } from "../../../../lib/magicLink";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") || "";
  const result = await consumeMagicLink(token);

  if (!result.ok) {
    const reason = result.reason ?? "token_invalid";
    const url = new URL(`/login?error=${encodeURIComponent(reason)}`, request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.redirect(new URL("/portal/licenses", request.url));
}
