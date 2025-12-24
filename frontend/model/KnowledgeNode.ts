import { NodeID } from "./types";
import { Attachment } from "./Attachment";

export class KnowledgeNode {
  id: NodeID;
  title: string;
  text: string;
  tags: string[];
  meta: Record<string, any>;
  attachments: Attachment[];

  constructor(params: {
    id: NodeID;
    title: string;
    text: string;
    tags?: string[];
    meta?: Record<string, any>;
    attachments?: Attachment[];
  }) {
    this.id = params.id;
    this.title = params.title;
    this.text = params.text;
    this.tags = params.tags ?? [];
    this.meta = params.meta ?? {};
    this.attachments = params.attachments ?? [];
  }
}
