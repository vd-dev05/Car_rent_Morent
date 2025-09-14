import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  fullname: String,
  dateOfBirth: Date,
  address: String,
  phoneNumber: String,
  password: String,
  salt: String,
  avatar: String,
  role: {
      type: String,
      enum: ['CUSTOMER', 'PROVIDER', 'ADMIN'],
      default: 'CUSTOMER'
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "cars",
  }],
  createdAt: Date,
  updatedAt: Date,
  idDeleted: {
      type: Boolean,
      default: false
  }
});

const UserModel = mongoose.model("users", userSchema);

export default UserModel;
