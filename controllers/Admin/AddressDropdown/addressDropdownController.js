import catchAsync from "../../../Utils/catchAsync";
import addressModel from "../../../database/schema/AddressDropdown/addressDropdown.schema";

export const createAddressDropdown = catchAsync(async (req, res, next) => {
  const entityType = req.params.type;
  try {
    const newEntity = await addressModel[entityType].create(req.body);
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: {
        [entityType]: newEntity,
      },
      message: `${entityType} created`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const getAddressDropdown = catchAsync(async (req, res, next) => {
  const entityType = req.params.type;
  try {
    const entities = await addressModel[entityType].find();
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: {
        [entityType]: entities,
      },
      message: `${entityType} List`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const updateAddressDropdown = catchAsync(async (req, res, next) => {
  const { type, id } = req.params;
  try {
    const updatedEntity = await addressModel[type].findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: {
        [entityType]: updatedEntity,
      },
      message: `${entityType} updated`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
