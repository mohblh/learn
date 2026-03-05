const employeesService = require('./employees.service');
const { validationResult } = require('express-validator');

const getAllEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 20, branchId, role, isActive } = req.query;
    
    const filters = {
      storeId: req.storeId,
      branchId,
      role,
      isActive: isActive !== undefined ? isActive === 'true' : undefined
    };

    const result = await employeesService.getEmployees(filters, parseInt(page), parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await employeesService.getEmployeeById(req.params.id, req.storeId);

    res.status(200).json({
      status: 'success',
      data: { employee }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

const createEmployee = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const employeeData = {
      ...req.body,
      storeId: req.storeId
    };

    const employee = await employeesService.createEmployee(employeeData);

    res.status(201).json({
      status: 'success',
      message: 'Employee created successfully',
      data: { employee }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await employeesService.updateEmployee(req.params.id, req.body, req.storeId);

    res.status(200).json({
      status: 'success',
      message: 'Employee updated successfully',
      data: { employee }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    await employeesService.deleteEmployee(req.params.id, req.storeId);

    res.status(200).json({
      status: 'success',
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};