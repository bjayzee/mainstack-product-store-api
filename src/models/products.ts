import mongoose, { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    price: number;
    description: string;
    quantity: number;
}

const productSchema = new Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    quantity: {type: Number, required: true}
},{
    timestamps: true
});

export const ProductModel = model<IProduct>('Product', productSchema);

export const createProduct = (values: Partial<IProduct>) => new ProductModel(values)
        .save().then((product) => product.toObject());

export const getAllProducts = () => ProductModel.find();
export const getAllProductsWithLimits = (limit: number, offset: number) => {
    const validLimit = Math.max(0, limit); 
    const validOffset = Math.max(0, offset); 

    return ProductModel.find()
        .limit(validLimit)
        .skip(validOffset)
        .exec();
};
export const getProductById = (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid product ID");
    }
    return ProductModel.findById(id);
}
export const getProductByName = (name: string) => ProductModel.findOne({ name });
export const deleteProductById = (id: string) => ProductModel.findOneAndDelete({ _id: id});

export const updateProductById = (id: string, values: Partial<IProduct>) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid product ID");
    }
    return ProductModel.findByIdAndUpdate(id, values, { new: true }).lean();
}