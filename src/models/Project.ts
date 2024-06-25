import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import Task, { TasktType } from "./Task";
import { UserType } from "./User";
import Note from "./Note";

export type ProjectType = Document & {
  projectName: string;
  clientName: string;
  description: string;
  tasks: PopulatedDoc<TasktType & Document>[];
  manager: PopulatedDoc<UserType & Document>[];
  team: PopulatedDoc<UserType & Document>[];
};

const ProjectSchema: Schema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    tasks: [{ type: Types.ObjectId, ref: "Task" }],
    manager: [{ type: Types.ObjectId, ref: "User" }],
    team: [{ type: Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

ProjectSchema.pre("deleteOne", { document: true }, async function () {
  const projectId = this._id;
  if (!projectId) return;
  const tasks = await Task.find({ project: projectId });
  for (const task of tasks) {
    await Note.deleteMany({ task: task.id });
  }
  await Task.deleteMany({ project: projectId });
});

const Project = mongoose.model<ProjectType>("Project", ProjectSchema);
export default Project;
