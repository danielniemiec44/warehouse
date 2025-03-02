const Warehouse = require('../models/Warehouse');
const Category = require('../models/Category');
const { handleDatabaseQuery, sequelize} = require("../db");
const CategoryCustomField = require("../models/CategoryCustomField");
const {Op} = require("sequelize");

const WarehouseData = (req, res) => {
    handleDatabaseQuery(() => Warehouse.findAll({
        include: [
            { model: Category, required: true, as: 'category' },
        ]
    }), res);
};

const getWarehouseDataByID = (req, res) => {
    handleDatabaseQuery(() => Warehouse.findOne({
        where: { product_id: req.params.id },
        include: [
            { model: Category, required: true, as: 'category' },
        ]
    }), res);
};

const setWarehouseDataByID = (req, res) => {
    handleDatabaseQuery(() => Warehouse.update(req.body, {
        where: { product_id: req.params.id },
    }), res);
};

const getCategories = (req, res) => {
    handleDatabaseQuery(() => Category.findAll({
        include: [
            { model: CategoryCustomField, required: true, as: 'customFields' }
        ]
    }), res);
};

const addNewItem = async (req, res) => {
    try {
        const { name, quantity, categoryId } = req.body;
        const newItem = await Warehouse.create({ name, quantity, categoryId });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: 'Could not add new item' });
    }
};

const updateItemQuantity = async (req, res) => {
    try {
        const { id, quantity } = req.body;
        const item = await Warehouse.findByPk(id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        item.quantity = quantity;
        await item.save();
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: 'Could not update quantity' });
    }
};

const putCategory = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const fieldTable = req.body.fields;
        const newCategoryName = req.body.newName;  // Now use 'newName' from the request body
        console.log("Received fieldTable:", fieldTable);
        console.log("Requested new category name:", newCategoryName);

        // First, check if the category exists by the old name in req.params.name
        let category = await Category.findOne({
            where: { name: req.params.name }
        });

        // If the category is not found, return an error
        if (!category) {
            console.log(`Category not found with the name "${req.params.name}"`);
            return res.status(404).json({ errors: "Category not found" });
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

        // 1. Delete the fields that are not in the request
        const fieldNamesInRequest = fieldTable.map(field => field.name);
        await CategoryCustomField.destroy({
            where: {
                CategoryID: category.id,
                name: { [Op.notIn]: fieldNamesInRequest }
            },
            transaction
        });

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







module.exports = {
    WarehouseData,
    getWarehouseDataByID,
    setWarehouseDataByID,
    getCategories,
    addNewItem,
    updateItemQuantity,
    addCategory: putCategory
};
