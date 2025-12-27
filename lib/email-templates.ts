export const orderConfirmationEmail = (order: any) => `
<!DOCTYPE html>
<html>
<head><style>body{font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px}</style></head>
<body>
  <h1>Order Confirmed!</h1>
  <p>Thank you for your order #${order.id}</p>
  <h2>Order Details</h2>
  <p>Total: ₹${order.total_amount}</p>
  <p>Status: ${order.status}</p>
  <p>We'll send you a shipping notification once your order is on its way.</p>
  <a href="https://strevo.com/orders/${order.id}" style="background:#000;color:#fff;padding:12px 24px;text-decoration:none;display:inline-block;margin-top:20px">Track Order</a>
</body>
</html>
`;

export const shippingNotificationEmail = (order: any) => `
<!DOCTYPE html>
<html>
<head><style>body{font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px}</style></head>
<body>
  <h1>Your Order is On Its Way!</h1>
  <p>Order #${order.id} has been shipped</p>
  <h2>Tracking Information</h2>
  <p>Tracking Number: ${order.tracking_number || 'N/A'}</p>
  <p>Carrier: ${order.carrier || 'N/A'}</p>
  <a href="https://strevo.com/orders/${order.id}" style="background:#000;color:#fff;padding:12px 24px;text-decoration:none;display:inline-block;margin-top:20px">Track Order</a>
</body>
</html>
`;
