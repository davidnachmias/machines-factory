import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Fault {
    _id: string;
    machineName?: string;
    machineType?: string;
    formType: string;
    description: string;
    date: string;
    status: string;
    closedDate?: string;
    partsUsed?: string;
    repairCost?: number;
}

export interface IMachine extends Document {
    name: string;
    type: string;
    faults: Fault[];
}

const FaultSchema: Schema = new Schema({
    _id: {
        type: String,
        required: true,
        default: () => new mongoose.Types.ObjectId().toString(),
    },
    formType: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'open',
    },
    closedDate: {
        type: String,
        required: false,
    },
    partsUsed: {
        type: String,
        required: false,
    },
    repairCost: {
        type: Number,
        required: false,
    },
});

const MachineSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    faults: [FaultSchema],
});

const Machine: Model<IMachine> = mongoose.models.Machine || mongoose.model<IMachine>('Machine', MachineSchema);

export default Machine;