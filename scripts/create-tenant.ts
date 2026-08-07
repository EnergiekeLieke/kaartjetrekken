import { clerkClient } from '@clerk/nextjs/server';
import { getDb } from '../lib/db';
import { tenants, tenantAdmins } from '../lib/db/schema';

function leesArg(naam: string): string {
  const prefix = `--${naam}=`;
  const arg = process.argv.find((a) => a.startsWith(prefix));
  if (!arg) {
    console.error(`Ontbrekend argument: --${naam}=...`);
    process.exit(1);
  }
  return arg.slice(prefix.length);
}

const GERESERVEERDE_SLUGS = ['admin', 'sign-in', 'sign-up', 'api'];

async function main() {
  const naam = leesArg('naam');
  const slug = leesArg('slug');
  const email = leesArg('email');
  const appUrl = process.env.APP_URL ?? 'https://kaartjetrekken.netlify.app';

  if (GERESERVEERDE_SLUGS.includes(slug)) {
    console.error(`Slug "${slug}" is gereserveerd, kies een andere.`);
    process.exit(1);
  }

  const db = getDb();

  const [tenant] = await db.insert(tenants).values({ naam, slug }).returning();
  await db.insert(tenantAdmins).values({ tenantId: tenant.id, email });

  const clerk = await clerkClient();
  await clerk.invitations.createInvitation({
    emailAddress: email,
    redirectUrl: `${appUrl}/admin`,
  });

  console.log(`Klant "${naam}" aangemaakt op /${slug}.`);
  console.log(`Uitnodiging verstuurd naar ${email}. Trekpagina: ${appUrl}/${slug}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
