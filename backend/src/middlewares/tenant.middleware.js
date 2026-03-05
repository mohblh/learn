const tenantIsolation = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required for tenant isolation.'
      });
    }

    // Super Admin can access everything
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    if (!req.user.storeId) {
      return res.status(403).json({
        status: 'error',
        message: 'User not associated with any store.'
      });
    }

    // Attach storeId and branchId to request
    req.storeId = req.user.storeId;
    req.branchId = req.user.branchId;

    next();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Tenant isolation failed.'
    });
  }
};

const branchIsolation = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required.'
      });
    }

    // These roles can access all branches
    if (['SUPER_ADMIN', 'STORE_OWNER', 'STORE_ADMIN'].includes(req.user.role)) {
      return next();
    }

    if (!req.user.branchId) {
      return res.status(403).json({
        status: 'error',
        message: 'User not assigned to any branch.'
      });
    }

    const requestedBranchId = req.params.branchId || req.body.branchId || req.query.branchId;
    
    if (requestedBranchId && requestedBranchId !== req.user.branchId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. You can only access your assigned branch.'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Branch isolation failed.'
    });
  }
};

module.exports = {
  tenantIsolation,
  branchIsolation
};