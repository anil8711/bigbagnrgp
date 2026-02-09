import mongoose from 'mongoose';

const bagSchema = new mongoose.Schema({
  serialNo: {
    type: Number,
    required: true,
  },
  bagNo: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
});

const nrgpSchema = new mongoose.Schema({
  nrgpNo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  bags: {
    type: [bagSchema],
    validate: [arrayLimit, 'Cannot exceed 30 bags'],
  },
}, { timestamps: true });

function arrayLimit(val:any[]) {
  return val.length <= 30;
}

const Nrgp = mongoose.models.Nrgp || mongoose.model('Nrgp', nrgpSchema);
export default Nrgp;
