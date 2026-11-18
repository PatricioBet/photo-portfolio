import { Injectable } from "@nestjs/common";

@Injectable()
export class TagsService {
  validateSlug(slug: string): boolean {
    return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
  }
}
