import { NextResponse } from "next/server";

import { AccountAuthError, buildBillingSummaryForEmail, requireAccountApiContext } from "../../../../lib/account";

export async function GET() {
  try {
    const { session, customer, organization, db } = await requireAccountApiContext();
    const billing = await buildBillingSummaryForEmail(db, session.email);

    return NextResponse.json({
      ok: true,
      email: session.email,
      customer,
      organization: organization
        ? {
            id: organization.id,
            slug: organization.slug,
            name: organization.name,
            billing_email: organization.billingEmail,
          }
        : null,
      billing,
    });
  } catch (error) {
    if (error instanceof AccountAuthError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
