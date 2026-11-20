import {
  Controller,
  Post,
  Body,
  BadRequestException,
  HttpException,
} from "@nestjs/common";
import { ContactService } from "./contact.service";
import { createDbClient, schema } from "../../db/client";
import { nanoid } from "nanoid";

@Controller("contact")
export class ContactController {
  private readonly db = createDbClient(
    process.env.POSTGRES_URL ||
      "postgresql://patriciobet:patriciobet@localhost:5432/photo"
  );

  constructor(private readonly service: ContactService) {}

  @Post()
  async submit(
    @Body() dto: {
      name: string;
      email: string;
      message: string;
      consent: boolean;
    }
  ) {
    // Rate limit check (simplified - in production use Redis)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = await this.db
      .select({ count: schema.contactMessage.id })
      .from(schema.contactMessage)
      .where(schema.contactMessage.createdAt.gte(oneHourAgo));

    if (recentCount.length >= 3) {
      throw new HttpException(
        "Too many messages. Try again later.",
        429
      );
    }

    if (!dto.consent) {
      throw new BadRequestException("Consent required");
    }

    const id = nanoid(10);
    await this.db.insert(schema.contactMessage).values({
      id,
      name: dto.name,
      email: dto.email,
      message: dto.message,
      consent: dto.consent,
    });

    return { message: "Message sent successfully" };
  }
}
