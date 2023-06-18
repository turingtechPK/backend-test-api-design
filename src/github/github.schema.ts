import { Schema } from 'mongoose';
import { GITHUB_COLLECTION } from './github.constants';

export interface IGithub {
  organization: string;
  repository: string;
  year: number;
  month?: number;
  newContributors?: number;
}

export const GithubSchema = new Schema<IGithub>(
  {
    organization: {
      type: String,
      required: true,
    },
    repository: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      default: null,
    },
    newContributors: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    collection: GITHUB_COLLECTION,
  },
);

GithubSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function () {
  this.lean();
});
