import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
  hasReminder: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: { 
      type: String, 
      required: [true, 'Title is required'],
      trim: true 
    },
    description: { 
      type: String,
      trim: true 
    },
    completed: { 
      type: Boolean, 
      default: false 
    },
    priority: { 
      type: String, 
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    },
    dueDate: { 
      type: Date,
      required: [true, 'Due date is required']
    },
    hasReminder: {
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: true 
  }
);

// Check if the model already exists to prevent overwriting during hot reloads
export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
