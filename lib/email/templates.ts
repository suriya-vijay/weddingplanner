/**
 * Branded transactional email templates. Plain HTML with INLINE styles only —
 * email clients strip <style> blocks and external CSS, so everything is inline.
 * Brand: forest #0f2c1f / #1b4332, gold #c9a227 / #d8b961, cream #fbf8f3.
 * No external images/fonts (many clients block them) — a text wordmark instead.
 */

const APP_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kalyanam.co";

function shell(bodyInner: string): string {
  return `
  <div style="margin:0;padding:0;background:#f4eee3;">
    <div style="max-width:560px;margin:0 auto;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;color:#1f2a24;">
      <div style="background:#0f2c1f;border-radius:20px 20px 0 0;padding:28px 32px;text-align:center;">
        <div style="font-size:22px;letter-spacing:0.5px;color:#fbf8f3;">
          Kalyanam <span style="color:#d8b961;">&amp;</span> Co.
        </div>
        <div style="margin-top:4px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#d8b961;font-family:Arial,sans-serif;">
          The luxury operating system for Indian weddings
        </div>
      </div>
      <div style="background:#ffffff;border-radius:0 0 20px 20px;padding:32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#33403a;">
        ${bodyInner}
      </div>
      <p style="text-align:center;margin:20px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#8a938d;">
        Kalyanam &amp; Co. — celebrations as singular as your story.
      </p>
    </div>
  </div>`;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#1b4332;color:#fbf8f3;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;padding:12px 26px;border-radius:999px;">${label}</a>`;
}

export function welcomeEmail({
  name,
  role,
}: {
  name: string;
  role: "couple" | "vendor";
}): { subject: string; html: string } {
  const first = (name || "there").split(" ")[0];
  if (role === "vendor") {
    return {
      subject: "Welcome to Kalyanam & Co. — let's set up your listing",
      html: shell(`
        <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:24px;color:#0f2c1f;">Welcome, ${first} 🌿</h1>
        <p style="margin:0 0 14px;">Thank you for joining <strong>Kalyanam &amp; Co.</strong> as a vendor. We're building a carefully curated home for Indian-American weddings, and we're glad you're part of it.</p>
        <p style="margin:0 0 14px;">Next, complete your profile — add your photos, services, packages and pricing. Once it's ready, our team reviews it before it goes live on the marketplace (so couples only ever see vetted, quality vendors).</p>
        <p style="margin:22px 0;text-align:center;">${button(`${APP_URL}/vendor`, "Complete your profile")}</p>
        <p style="margin:0;color:#66716b;font-size:13px;">We'll email you the moment your listing is approved.</p>
      `),
    };
  }
  return {
    subject: "Welcome to Kalyanam & Co. 🌸",
    html: shell(`
      <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:24px;color:#0f2c1f;">Welcome, ${first} 🌸</h1>
      <p style="margin:0 0 14px;">We're so happy you're here. <strong>Kalyanam &amp; Co.</strong> brings inspiration, trusted vendors, and all your planning tools — checklist, budget, guests, seating, timeline and an AI advisor — into one elegant place.</p>
      <p style="margin:0 0 14px;">Your dashboard is ready whenever you are. Start by setting your wedding details, then let the tools (and a little AI help) do the heavy lifting.</p>
      <p style="margin:22px 0;text-align:center;">${button(`${APP_URL}/dashboard`, "Open your dashboard")}</p>
      <p style="margin:0;color:#66716b;font-size:13px;">Wishing you a beautiful journey to the big day.</p>
    `),
  };
}

export function vendorStatusEmail({
  name,
  status,
  reason,
}: {
  name: string;
  status: "approved" | "rejected";
  reason?: string;
}): { subject: string; html: string } {
  const first = (name || "there").split(" ")[0];
  if (status === "approved") {
    return {
      subject: "You're live on Kalyanam & Co. 🎉",
      html: shell(`
        <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:24px;color:#0f2c1f;">You're approved, ${first} 🎉</h1>
        <p style="margin:0 0 14px;">Great news — your profile has been reviewed and is now <strong>live on the marketplace</strong>. Couples can find you, view your work, and send enquiries.</p>
        <p style="margin:22px 0;text-align:center;">${button(`${APP_URL}/vendor`, "View your portal")}</p>
        <p style="margin:0;color:#66716b;font-size:13px;">Keep your profile and packages up to date to make the best impression.</p>
      `),
    };
  }
  const reasonBlock = reason?.trim()
    ? `<div style="margin:0 0 16px;padding:12px 16px;background:#fbecec;border-radius:12px;color:#7b2d26;font-size:14px;"><strong>Reason:</strong> ${reason.trim()}</div>`
    : "";
  return {
    subject: "An update on your Kalyanam & Co. listing",
    html: shell(`
      <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:24px;color:#0f2c1f;">A quick update, ${first}</h1>
      <p style="margin:0 0 14px;">Thanks for your patience while we reviewed your profile. It isn't approved for the marketplace just yet.</p>
      ${reasonBlock}
      <p style="margin:0 0 14px;">Please update your profile with the notes above — once you save your changes, it goes straight back into our review queue.</p>
      <p style="margin:22px 0;text-align:center;">${button(`${APP_URL}/vendor/profile`, "Update your profile")}</p>
      <p style="margin:0;color:#66716b;font-size:13px;">We're here to help you get listed — thank you for being part of Kalyanam &amp; Co.</p>
    `),
  };
}

export function partnerInviteEmail({
  inviterName,
  acceptUrl,
}: {
  inviterName: string;
  acceptUrl: string;
}): { subject: string; html: string } {
  const who = inviterName?.trim() || "Your partner";
  return {
    subject: `${who} invited you to plan your wedding on Kalyanam & Co. 💍`,
    html: shell(`
      <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:24px;color:#0f2c1f;">You're invited to plan together 💍</h1>
      <p style="margin:0 0 14px;"><strong>${who}</strong> has invited you to co-plan your wedding on <strong>Kalyanam &amp; Co.</strong> — you'll both share the same dashboard: checklist, budget, guest list, timeline and seating, all in one place.</p>
      <p style="margin:0 0 14px;">You'll set up your own private login (no shared passwords) and be linked to the same wedding automatically — perfect for planning together even when you're apart.</p>
      <p style="margin:22px 0;text-align:center;">${button(acceptUrl, "Accept & join the dashboard")}</p>
      <p style="margin:0;color:#66716b;font-size:13px;">If you didn't expect this invitation, you can safely ignore this email.</p>
    `),
  };
}
