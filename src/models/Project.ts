import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { TasktType } from "./Task";

export type ProjectType = Document & {
  projectName: String;
  clientName: String;
  description: String;
  tasks: PopulatedDoc<TasktType & Document>[];
};

const ProjcetSchema: Schema = new Schema(
  {
    projectName: {
      type: String,
      require: true,
      trim: true,
    },
    clientName: {
      type: String,
      require: true,
      trim: true,
    },
    description: {
      type: String,
      require: true,
      trim: true,
    },
    tasks: [{ type: Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

const Project = mongoose.model<ProjectType>("Project", ProjcetSchema);
export default Project;
