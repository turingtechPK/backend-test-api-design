import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const contributorSchema = new Schema({
  org: { type: String, required: true },
  repository: { type: String, required: true },
  year: { type: Number, required: true },
  month: { type: Number },
  newContributors: [{ type: String }]
});

const Contributor = mongoose.model('Contributor', contributorSchema);

export default Contributor;
