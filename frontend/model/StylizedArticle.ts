import { NodeID, Profile } from "./types";

export class StylizedArticle {
  nodeId: NodeID;
  profile: Profile;
  version: number;
  text: string;
  createdAt: Date;

  constructor(params: {
    nodeId: NodeID;
    profile: Profile;
    version?: number;
    text: string;
    createdAt?: Date;
  }) {
    this.nodeId = params.nodeId;
    this.profile = params.profile;
    this.version = params.version ?? 1;
    this.text = params.text;
    this.createdAt = params.createdAt ?? new Date();
  }
}

