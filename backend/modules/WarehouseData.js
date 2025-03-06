const Warehouse = require('../models/Warehouse');
const Category = require('../models/Category');
const { handleDatabaseQuery, sequelize} = require("../db");
const CategoryCustomField = require("../models/CategoryCustomField");
const {Op} = require("sequelize");
const WarehouseProperties = require("../models/WarehouseProperties");

const baseProperties = [
    { id: 'name', name: 'name', type: 'text', label: 'Nazwa' },
    { id: 'quantity', name: 'quantity', type: 'number', label: 'Ilość' },
    { id: "barcode", name: "barcode", type: "text", label: "Kod kreskowy" },
];

const getWarehouseDataByCategoryId = async (req, res) => {
    try {
        const categoryId = req?.params?.categoryId;

        const customFields = await CategoryCustomField.findAll({
            where: {
                CategoryID: categoryId,
            }
        });

        const textColumns = [
            ...baseProperties.filter((baseProperty) => baseProperty?.type === "text").map((columnData) => columnData?.name),
            ...customFields.filter((customField) => customField?.type === "text").map((customField) => customField?.name)
        ];
        console.log(`For category id ${categoryId}, text columns detected: ${textColumns}`);

        // Get numeric columns
        const numericColumns = [
            ...baseProperties.filter((baseProperty) => baseProperty?.type === "number").map((columnData) => columnData?.name),
            ...customFields.filter((customField) => customField?.type === "number").map((customField) => customField?.name)
        ];
        console.log(`For category id ${categoryId}, number columns detected: ${numericColumns}`);

        // Get checkbox columns
        const checkboxColumns = [
            ...baseProperties.filter((baseProperty) => baseProperty?.type === "checkbox").map((columnData) => columnData?.name),
            ...customFields.filter((customField) => customField?.type === "checkbox").map((customField) => customField?.name)
        ];
        console.log(`For category id ${categoryId}, checkbox columns detected: ${   checkboxColumns}`);

        const page = req?.body?.page ?? 1;
        const maxRows = req?.body?.maxRows ?? 10;
        const search = req?.body?.search ?? [];

        const where = {
            categoryId
        };

        // Handle base properties filtering
        Object.entries(search)
            .filter(([key, value]) => baseProperties.map((property) => property?.name).includes(key) && value !== "")
            .forEach(([key, value]) => {
                where[key] = numericColumns?.includes(key) ? value : { [Op.like]: `%${value}%` };
            });

        // Handle custom properties filtering
        const customFieldFilters = Object.entries(search)
            .filter(([key, value]) => !baseProperties.map(property => property?.name).includes(key) && value !== "");

        if (customFieldFilters.length > 0) {
            where['$properties.customField.CustomFieldName$'] = {
                [Op.in]: customFieldFilters.map(([key]) => key)
            };
            where['$properties.PropertyValue$'] = {
                [Op.or]: customFieldFilters.map(([key, value]) =>
                    numericColumns.includes(key)
                        ? value
                        : { [Op.like]: `%${value}%` }
                )
            };
        }

        const options = {
            where,
            include: [
                {
                    model: WarehouseProperties,
                    as: 'properties',
                    required: customFieldFilters.length > 0,
                    include: [
                        {
                            model: CategoryCustomField,
                            required: customFieldFilters.length > 0,
                            as: 'customField',
                        }
                    ]
                }
            ],
            limit: maxRows,
            offset: (page - 1) * maxRows,
            distinct: true
        }

        const totalRows = await Warehouse.count(options);
        const warehouses = await Warehouse.findAll(options);

        res.json({ totalRows, warehouses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getCategories = (req, res) => {
    handleDatabaseQuery(() => Category.findAll({
        include: [
            { model: CategoryCustomField, required: true, as: 'customFields' }
        ]
    }), res);
};


const putCategory = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const fieldTable = req.body.fields;
        const newCategoryName = req.body.newName;  // Now use 'newName' from the request body
        console.log("Received fieldTable:", fieldTable);
        console.log("Requested new category name:", newCategoryName);
        const nameFromParams = req.params.name ?? "";

        // First, check if the category exists by the old name in req.params.name
        let category = await Category.findOne({
            where: { name: nameFromParams }
        });

        // If the category is not found, return an error
        if (!category) {
            console.log(`Category not found with the name "${nameFromParams}". Creating one using new category name...`);
            category = await Category.create({ name: newCategoryName }, { transaction });
        }

        // Log the current category name before updating
        console.log("Current category name:", category.name);

        // If the new category name is different from the current one, update it
        if (newCategoryName && newCategoryName !== category.name) {
            console.log(`Category name is different. Updating from "${category.name}" to "${newCategoryName}"`);
            category.name = newCategoryName;
            category.changed('name', true);  // Explicitly mark 'name' field as changed

            // Log the name before saving
            console.log("Updated category name (before save):", category.name);

            // Save the category with the new name
            const updatedCategory = await category.save({ transaction });
            console.log("Category name updated successfully:", updatedCategory.name);
        } else {
            console.log("Category name is the same. No update needed.");
        }

        if(nameFromParams !== "") {

            // 1. Delete the fields that are not in the request
            const fieldNamesInRequest = fieldTable.map(field => field.name);
            await CategoryCustomField.destroy({
                where: {
                    CategoryID: category.id,
                    name: {[Op.notIn]: fieldNamesInRequest}
                },
                transaction
            });
        }

        // 2. Add or update fields
        const updatePromises = fieldTable.map(async (field) => {
            if (field.id === -1) {
                // If the ID is -1, add a new field (but we don't send the ID when creating)
                if (!field.name || !field.type) {
                    throw new Error("Field name and type are required for creating a new field");
                }

                await CategoryCustomField.create({
                    CategoryID: category.id,
                    name: field.name,
                    type: field.type,
                    maxLen: field.maxLength,
                    defaultValue: field.defaultValue
                }, { transaction });
            } else {
                // If the ID exists, update the existing field
                if (!field.id) {
                    throw new Error("Field id is required for updating an existing field");
                }

                await CategoryCustomField.update({
                    CategoryID: category.id,
                    name: field.name,
                    type: field.type,
                    maxLen: field.maxLength,
                    defaultValue: field.defaultValue
                }, {
                    where: { id: field.id, CategoryID: category.id },
                    transaction
                });
            }
        });

        // Wait for all promises to resolve
        await Promise.all(updatePromises);

        // Commit the transaction
        await transaction.commit();
        console.log("Transaction committed successfully");

        // Return the updated category with the new name
        const updatedCategory = await Category.findOne({
            where: { id: category.id } // Fetch the category again after commit to ensure the name is updated
        });
        console.log("Returning updated category:", updatedCategory);
        res.status(200).json(updatedCategory);

    } catch (error) {
        // Rollback transaction if there's an error
        await transaction.rollback();
        console.error("Error:", error.message);
        res.status(500).json({ errors: 'Could not update category', message: error.message });
    }
};

const getWarehouseDataByID = (req, res) => {
    const id = req.params.id;
    handleDatabaseQuery(() => Warehouse.findByPk(id), res);
};

// the same logic as for categories
const setWarehouseData = async (req, res) => {
    const categoryId = req.params.categoryId;
    const data = req.body;

    const transaction = await sequelize.transaction();
    try {
        const warehouse = await Warehouse.create({
            categoryId,
            name: data.baseProperties.name,
            quantity: data.baseProperties.quantity
        }, { transaction });

        if (data.customFields) {
            const customFieldsPromises = Object.entries(data.customFields).map(async ([fieldName, fieldValue]) => {
                const customField = await CategoryCustomField.findOne({
                    where: {
                        CategoryID: categoryId,
                        name: fieldName
                    }
                });
                console.log("Found custom field:", customField);

                if (!customField) {
                    throw new Error(`Custom field '${fieldName}' not found for this category`);
                }

                const properties = {
                    WarehouseID: warehouse.id,
                    // if empty get defualt value from databse
                    PropertyValue: !!fieldValue ? fieldValue : customField.defaultValue,
                    CustomFieldID: customField.id
                }

                console.log("Creating warehouse property for field:", properties);

                return WarehouseProperties.create(properties, { transaction });
            });

            await Promise.all(customFieldsPromises);
        }

        await transaction.commit();
        return res.status(200).json({
            message: 'Warehouse data created successfully',
            warehouse
        });

    } catch (error) {
        await transaction.rollback();
        console.error("Error:", error.message);
        return res.status(500).json({
            error: 'Could not create warehouse data',
            message: error.message
        });
    }
};

module.exports = {
    getWarehouseDataByCategoryId,
    getCategories,
    addCategory: putCategory,
    getWarehouseDataByID,
    setWarehouseData
};
