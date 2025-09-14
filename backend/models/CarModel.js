import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  carName: {
    type: String,
    required: true,
  },
  carImg: {
    type: [String],
  },
  carPrice: {
    type: Number,
    required: true,
    min: 1,
  },
  color: String,
  version: String,
  ODO: Number, //odograph: máy ghi quãng đường của ô tô
  sitChairs: Number,
  year: Number,
  origin: String, //xuất xứ
  gearBox: {
    type: String,
    enum: ["Số tự động", "Số sàn"],
    default: "Số tự động",
  }, //Hộp số
  driveSystem: String, //Hệ dẫn động,
  torque: String, //Momen xoắn,
  engine: String, //Động cơ
  horsePower: String, //mã lực
  power: String, //năng lượng
  brand: String,
  describe: String, //miêu tả
  state: { type: String, enum: ["Mới", "Cũ"], default: "Mới" },
  idProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isStatus: {
    type: String,
    enum: ["approved", "pending"],
    default: "pending",
  },
});
carSchema.index({ updatedAt: -1 });
const CarModel = mongoose.model("cars", carSchema);

export default CarModel;
