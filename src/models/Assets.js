import mongoose,{Schema,model} from "mongoose"

const AssetSchema = new Schema({
    filename: {
        type: String,
        required: true,
        trim: true
      },
      type: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      publicId: {
        type: String,
        required: true
      },
      tags: {
        type: [String],
        default: []
      },
      metadata: {
        type: Object,
        default: {}
      }
},{
timestamps: true
})

export const Asset = model('Asset', AssetSchema);