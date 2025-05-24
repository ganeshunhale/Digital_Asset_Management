import {Schema,model} from "mongoose"

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
      }
},{
timestamps: true
})

export const Asset = model('Asset', AssetSchema);