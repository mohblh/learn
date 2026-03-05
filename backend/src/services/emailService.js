// Email service (placeholder - يمكن دمج Nodemailer لاحقاً)

const sendEmail = async (to, subject, html) => {
  console.log('📧 Email sent to:', to);
  console.log('Subject:', subject);
  // TODO: Implement actual email sending with Nodemailer
  return true;
};

const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to POS System';
  const html = `
    <h1>Welcome ${user.firstName}!</h1>
    <p>Your account has been created successfully.</p>
    <p>Email: ${user.email}</p>
  `;
  return await sendEmail(user.email, subject, html);
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const subject = 'Password Reset Request';
  const html = `
    <h1>Password Reset</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
  `;
  return await sendEmail(user.email, subject, html);
};

const sendLowStockAlert = async (recipients, product, inventory) => {
  const subject = 'Low Stock Alert';
  const html = `
    <h1>Low Stock Alert</h1>
    <p><strong>${product.name}</strong> (${product.sku}) is running low on stock.</p>
    <p>Current quantity: ${inventory.quantity}</p>
    <p>Minimum level: ${inventory.minStockLevel}</p>
    <p>Branch: ${inventory.branch.name}</p>
  `;
  
  for (const recipient of recipients) {
    await sendEmail(recipient, subject, html);
  }
  
  return true;
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendLowStockAlert
};