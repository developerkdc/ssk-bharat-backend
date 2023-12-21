import ApiError from "../../Utils/ApiError";
import catchAsync from "../../Utils/catchAsync";
import productModel from "../../database/schema/product.schema";
import fs from "fs";

export const createProduct = catchAsync(async (req, res, next) => {
  // Get the relative path of the uploaded image
  let relativeImagePath = [];
  for (let file of req.files) {
    relativeImagePath.push(file.filename);
  }
  const prices = {
    retailer_sales_price: req?.body?.retailer_sales_price || 0,
    website_sales_price: req?.body?.website_sales_price || 0,
    offline_store_sales_price: req?.body?.offline_store_sales_price || 0,
  };
  const product = await productModel.create({
    ...req.body,
    prices: prices,
    product_images: relativeImagePath,
  });
  if (product) {
    return res.status(201).json({
      statusCode: 201,
      status: true,
      data: product,
      message: "Product Created",
    });
  }
});

export const getProducts = catchAsync(async (req, res, next) => {
  console.log("iuhrgiuh");

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;
  const search = req.query.search || "";
  console.log(typeof search, "typeee");
  const searchQuery = search
    ? {
        $or: [
          { "category.category_name": { $regex: search, $options: "i" } },
          { product_name: { $regex: search, $options: "i" } },
          { status: { $regex: search, $options: "i" } },
          { show_in_website: { $regex: search, $options: "i" } },
          { show_in_retailer: { $regex: search, $options: "i" } },
          { show_in_offline_store: { $regex: search, $options: "i" } },
          { "prices.retailer_sales_price": parseInt(search) },
          { "prices.website_sales_price": parseInt(search) },
          {
            "prices.offline_store_sales_price": parseInt(search),
          },
          { mrp: parseInt(search) },
          { item_weight: parseInt(search) },
          { "unit.unit_symbol": { $regex: search, $options: "i" } },
        ],
      }
    : {};
  const totalProduct = await productModel.countDocuments(searchQuery);
  if (!totalProduct) throw new Error(new ApiError("No Data", 404));
  const totalPages = Math.ceil(totalProduct / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = (validPage - 1) * limit;
  const sortField = req?.query?.sortBy || "product_name";
  const product = await productModel
    .find(searchQuery)
    .sort({ [sortField]: sortDirection })
    .skip(skip)
    .limit(limit)
    .populate([
      {
        path: "category",
        select: "_id category_name",
      },
      {
        path: "unit",
        select: "_id unit_name unit_symbol",
      },
    ]);

  if (product) {
    return res.status(200).json({
      statusCode: 200,
      status: true,
      data: {
        product: product,
        totalPages: totalPages,
        currentPage: validPage,
        imagePath: `${process.env.IMAGE_PATH}/admin/products/`,
      },
      message: "All Products",
    });
  }
});

// export const getCategoryList = catchAsync(async (req, res, next) => {
//   console.log("iuhrgiuh");
//   const category = await productModel.aggregate([
//     {
//       $project: {
//         _id: 1,
//         category_name: 1,
//       },
//     },
//   ]);

//   if (category) {
//     return res.status(200).json({
//       statusCode: 200,
//       status: true,
//       data: category,
//       message: "All Category List",
//     });
//   }
// });

export const updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const oldProduct = await productModel.findById(id);

  if (!oldProduct) {
    return next(new ApiError("Product Not Found", 404));
  }

  // Step 5: Update the product in the database
  console.log(req.body)
  const updatedProduct = await productModel.findByIdAndUpdate(
    id,
    { ...req.body, updated_at: Date.now() },
    { new: true }
  );

  // Step 6: Respond with the updated product
  return res.status(200).json({
    statusCode: 200,
    status: true,
    data: updatedProduct,
    message: "Product Updated",
  });
});
