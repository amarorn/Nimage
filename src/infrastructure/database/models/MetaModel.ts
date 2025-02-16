import mongoose, { Schema, Document } from "mongoose";

export interface IMeta extends Document {
    id: string;
    equipeId: string;
    objetivo: number;
}

const MetaSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    equipeId: { type: String, required: true },
    objetivo: { type: Number, required: true }
});

export const MetaModel = mongoose.model<IMeta>("Meta", MetaSchema);