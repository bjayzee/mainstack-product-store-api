import {Schema, model, Document} from "mongoose";
import bcrypt from 'bcryptjs';

export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
}

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
});

UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export const UserModel = model<IUser>('User', UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserById = (id: string) => UserModel.findById(id)
export const createUser = (values: Partial<IUser>) => new UserModel(values)
    .save().then((user) => user.toObject());

export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id});

export const updateUserById = (id: string, values: Partial<IUser>) => UserModel.findByIdAndUpdate(id, values);