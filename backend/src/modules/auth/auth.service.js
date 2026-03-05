const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const registerUser = async (userData) => {
  const { email, password, firstName, lastName, role, storeId, branchId, phone } = userData;

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    const error = new Error('User with this email already exists');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role: role || 'CASHIER',
      storeId,
      branchId
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      storeId: true,
      branchId: true,
      createdAt: true
    }
  });

  const token = generateToken(user.id);
  await logActivity(user.id, 'REGISTER', null);

  return { user, token };
};

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      store: {
        select: {
          id: true,
          name: true,
          subscriptionStatus: true
        }
      },
      branch: {
        select: {
          id: true,
          name: true,
          code: true
        }
      }
    }
  });

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('Your account has been deactivated. Please contact support.');
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  if (user.role !== 'SUPER_ADMIN' && user.store) {
    if (user.store.subscriptionStatus === 'EXPIRED') {
      const error = new Error('Store subscription has expired. Please renew to continue.');
      error.statusCode = 403;
      throw error;
    }
  }

  const token = generateToken(user.id);
  await logActivity(user.id, 'LOGIN', null);

  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token
  };
};

const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      isActive: true,
      storeId: true,
      branchId: true,
      store: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          subscriptionPlan: true,
          subscriptionStatus: true
        }
      },
      branch: {
        select: {
          id: true,
          name: true,
          code: true,
          address: true,
          city: true
        }
      },
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    const error = new Error('Current password is incorrect');
    error.statusCode = 401;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });

  await logActivity(userId, 'CHANGE_PASSWORD', null);
};

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const logActivity = async (userId, action, ipAddress, details = null) => {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        ipAddress,
        details
      }
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  changePassword,
  logActivity
};