import { Injectable } from "@nestjs/common";

@Injectable()
export class CollectionsService {
  // Business logic for collections (validation, constraints)
  validateSlug(slug: string): boolean {
    return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
  }
}
