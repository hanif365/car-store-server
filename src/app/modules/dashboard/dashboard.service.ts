import User from '../user/user.model';
import Order from '../order/order.model';
import Product from '../product/product.model';

const getDashboardStats = async () => {
  // Get total users
  const totalUsers = await User.countDocuments();

  // Get orders statistics
  const orders = await Order.find();

  // Get total sold products
  const totalSoldProducts = orders.reduce((acc, order) => {
    return (
      acc + (order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0)
    );
  }, 0);

  // Get total revenue
  const totalRevenue = orders.reduce(
    (acc, order) => acc + (order.totalPrice || 0),
    0,
  );

  // Get total products in inventory
  const totalProducts = await Product.countDocuments();

  // Get monthly sales data for the current year
  const currentYear = new Date().getFullYear();
  const monthlySales = Array(12).fill(0);

  for (const order of orders) {
    const orderDate = new Date(order._id.getTimestamp());
    if (orderDate.getFullYear() === currentYear) {
      const month = orderDate.getMonth();
      monthlySales[month] += order?.totalPrice || 0;
    }
  }

  // Initialize monthly cars sold data with zeros
  const monthlySoldProducts = Array(12).fill(0);

  for (const order of orders) {
    const orderDate = new Date(order._id.getTimestamp());
    if (orderDate.getFullYear() === currentYear) {
      const month = orderDate.getMonth();
      const productCount =
        order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      monthlySoldProducts[month] += productCount;
    }
  }

  return {
    totalUsers,
    totalSoldProducts,
    totalRevenue,
    totalProducts,
    monthlySales,
    monthlySoldProducts,
  };
};

export const DashboardService = {
  getDashboardStats,
};
