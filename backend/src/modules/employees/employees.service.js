const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const getEmployees = async (filters, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const where = {
    storeId: filters.storeId,
    role: { not: 'SUPER_ADMIN' },
    ...(filters.branchId && { branchId: filters.branchId }),
    ...(filters.role && { role: filters.role }),
    ...(filters.isActive !== undefined && { isActive: filters.isActive })
  };

  const [employees, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        branch: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        createdAt: true
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where })
  ]);

  return {
    employees,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getEmployeeById = async (employeeId, storeId) => {
  const employee = await prisma.user.findFirst({
    where: {
      id: employeeId,
      storeId
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      isActive: true,
      branch: {
        select: {
          id: true,
          name: true,
          code: true
        }
      },
      createdAt: true,
      updatedAt: true
    }
  });

  if (!employee) {
    const error = new Error('Employee not found');
    error.statusCode = 404;
    throw error;
  }

  return employee;
};

const createEmployee = async (employeeData) => {
  const { email, password, storeId } = employeeData;

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    const error = new Error('User with this email already exists');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const employee = await prisma.user.create({
    data: {
      ...employeeData,
      password: hashedPassword
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      isActive: true,
      branchId: true,
      createdAt: true
    }
  });

  return employee;
};

const updateEmployee = async (employeeId, updateData, storeId) => {
  const employee = await prisma.user.findFirst({
    where: {
      id: employeeId,
      storeId
    }
  });

  if (!employee) {
    const error = new Error('Employee not found');
    error.statusCode = 404;
    throw error;
  }

  // Don't allow updating password here
  delete updateData.password;
  delete updateData.storeId;

  const updatedEmployee = await prisma.user.update({
    where: { id: employeeId },
    data: updateData,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      isActive: true,
      branchId: true,
      updatedAt: true
    }
  });

  return updatedEmployee;
};

const deleteEmployee = async (employeeId, storeId) => {
  const employee = await prisma.user.findFirst({
    where: {
      id: employeeId,
      storeId
    }
  });

  if (!employee) {
    const error = new Error('Employee not found');
    error.statusCode = 404;
    throw error;
  }

  // Soft delete
  await prisma.user.update({
    where: { id: employeeId },
    data: { isActive: false }
  });
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};