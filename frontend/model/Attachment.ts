export type AttachmentType = "image" | "video" | "audio" | "map" | "document";

export class Attachment {
  id: string;
  type: AttachmentType;
  url: string;
  description?: string;
  meta: Record<string, any>;

  constructor(params: {
    id: string;
    type: AttachmentType;
    url: string;
    description?: string;
    meta?: Record<string, any>;
  }) {
    this.id = params.id;
    this.type = params.type;
    this.url = params.url;
    this.description = params.description;
    this.meta = params.meta ?? {};
  }
}

