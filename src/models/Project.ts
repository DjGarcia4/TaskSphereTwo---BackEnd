import mongoose, { Schema, Document } from "mongoose";

export type ProjectType = Document & {
  projectName: String;
  clientName: String;
  description: String;
};

const ProjcetSchema: Schema = new Schema({
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
});

const Project = mongoose.model<ProjectType>("Project", ProjcetSchema);
export default Project;
