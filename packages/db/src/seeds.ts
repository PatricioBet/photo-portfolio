import { createDbClient, schema } from "./index.js";
import { eq } from "drizzle-orm";

async function seed() {
  const db = createDbClient(
    process.env.POSTGRES_URL ??
      "postgresql://photo:photo@localhost:5432/photo"
  );

  const existing = await db
    .select({ email: schema.user.email })
    .from(schema.user)
    .where(eq(schema.user.email, "admin@patriciobet.dev"))
    .limit(1);

  if (existing.length > 0) {
    console.log("Seed already ran, skipping.");
    await db.$client.end();
    return;
  }

  await db.insert(schema.user).values({
    email: "admin@patriciobet.dev",
  });

  await db.insert(schema.collection).values({
    slug: "naturaleza",
    titleEs: "Naturaleza",
    titleEn: "Nature",
    descriptionEs:
      "Fotografías de paisajes, fauna y flora capturadas en diferentes ecosistemas.",
    descriptionEn:
      "Photographs of landscapes, wildlife, and flora captured in different ecosystems.",
    sortOrder: 0,
  });

  await db.insert(schema.collection).values({
    slug: "urbano",
    titleEs: "Urbano",
    titleEn: "Urban",
    descriptionEs:
      "Arquitectura, calles y vida urbana capturados en ciudades del mundo.",
    descriptionEn:
      "Architecture, streets, and urban life captured in cities around the world.",
    sortOrder: 1,
  });

  await db.insert(schema.tag).values({
    slug: "paisaje",
    nameEs: "Paisaje",
    nameEn: "Landscape",
  });

  await db.insert(schema.tag).values({
    slug: "retrato",
    nameEs: "Retrato",
    nameEn: "Portrait",
  });

  console.log("Seed completed: 1 user, 2 collections, 2 tags.");
  await db.$client.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
