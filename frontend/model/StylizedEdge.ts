import { NodeID, Profile } from "./types";

export class StylizedEdge {
  from: NodeID;
  to: NodeID;
  profile: Profile;
  version: number;
  text: string;
  createdAt: Date;

  constructor(params: {
    from: NodeID;
    to: NodeID;
    profile: Profile;
    version?: number;
    text: string;
    createdAt?: Date;
  }) {
    this.from = params.from;
    this.to = params.to;
    this.profile = params.profile;
    this.version = params.version ?? 1;
    this.text = params.text;
    this.createdAt = params.createdAt ?? new Date();
  }
}

