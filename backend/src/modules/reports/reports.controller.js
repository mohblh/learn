const reportsService = require('./reports.service');

const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, branchId } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Start date and end date are required'
      });
    }

    const report = await reportsService.generateSalesReport(
      req.storeId,
      branchId,
      startDate,
      endDate
    );

    res.status(200).json({
      status: 'success',
      data: report
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getInventoryReport = async (req, res) => {
  try {
    const { branchId } = req.query;

    const report = await reportsService.generateInventoryReport(
      req.storeId,
      branchId
    );

    res.status(200).json({
      status: 'success',
      data: report
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getFinancialReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Start date and end date are required'
      });
    }

    const report = await reportsService.generateFinancialReport(
      req.storeId,
      startDate,
      endDate
    );

    res.status(200).json({
      status: 'success',
      data: report
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getEmployeesPerformance = async (req, res) => {
  try {
    const { startDate, endDate, branchId } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Start date and end date are required'
      });
    }

    const report = await reportsService.getEmployeesPerformance(
      req.storeId,
      branchId,
      startDate,
      endDate
    );

    res.status(200).json({
      status: 'success',
      data: report
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getTopProducts = async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Start date and end date are required'
      });
    }

    const report = await reportsService.getTopProducts(
      req.storeId,
      startDate,
      endDate,
      parseInt(limit)
    );

    res.status(200).json({
      status: 'success',
      data: report
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getCustomersReport = async (req, res) => {
  try {
    const report = await reportsService.getCustomersReport(req.storeId);

    res.status(200).json({
      status: 'success',
      data: report
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getSalesReport,
  getInventoryReport,
  getFinancialReport,
  getEmployeesPerformance,
  getTopProducts,
  getCustomersReport
};