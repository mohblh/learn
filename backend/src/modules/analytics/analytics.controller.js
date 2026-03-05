const analyticsService = require('./analytics.service');

const getDashboardAnalytics = async (req, res) => {
  try {
    const { period = '7d', branchId } = req.query;

    const analytics = await analyticsService.getDashboardAnalytics(
      req.storeId,
      branchId,
      period
    );

    res.status(200).json({
      status: 'success',
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getTrends = async (req, res) => {
  try {
    const { startDate, endDate, metric = 'sales' } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Start date and end date are required'
      });
    }

    const trends = await analyticsService.getTrends(
      req.storeId,
      startDate,
      endDate,
      metric
    );

    res.status(200).json({
      status: 'success',
      data: trends
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getComparison = async (req, res) => {
  try {
    const { period1Start, period1End, period2Start, period2End } = req.query;

    if (!period1Start || !period1End || !period2Start || !period2End) {
      return res.status(400).json({
        status: 'error',
        message: 'All period dates are required'
      });
    }

    const comparison = await analyticsService.getComparison(
      req.storeId,
      { start: period1Start, end: period1End },
      { start: period2Start, end: period2End }
    );

    res.status(200).json({
      status: 'success',
      data: comparison
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getRealTimeStats = async (req, res) => {
  try {
    const { branchId } = req.query;

    const stats = await analyticsService.getRealTimeStats(
      req.storeId,
      branchId
    );

    res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getDashboardAnalytics,
  getTrends,
  getComparison,
  getRealTimeStats
};