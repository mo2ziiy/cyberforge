import mongoose, { Schema, Document } from "mongoose";

export interface ITool extends Document {
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  installation: string;
  commands: { command: string; description: string }[];
  useCases: string[];
  officialDocs: string;
  website: string;
  image: string;
  createdAt: Date;
}

const ToolSchema = new Schema<ITool>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    installation: { type: String },
    commands: [{ command: String, description: String }],
    useCases: [{ type: String }],
    officialDocs: { type: String },
    website: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

ToolSchema.index({ name: "text", description: "text", tags: "text" });

export default mongoose.models.Tool || mongoose.model<ITool>("Tool", ToolSchema);
