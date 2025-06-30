const API_BASE_URL = process.env.API_BASE_URL || 'https://your-northflank-domain.com';

// 健康检查
export async function getHealth() {
  const res = await fetch(`${API_BASE_URL}/api/health`);
  return res.json();
}

// 获取交易订单
export async function getOrders(params: {
  limit?: number;
  offset?: number;
  account_name?: string;
  symbol?: string;
  start_date?: string;
  end_date?: string;
}) {
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`${API_BASE_URL}/api/orders?${query}`);
  return res.json();
}

// 获取Telegram消息
export async function getMessages(params: {
  limit?: number;
  offset?: number;
  group_id?: string;
  has_signal?: boolean;
}) {
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`${API_BASE_URL}/api/messages?${query}`);
  return res.json();
}

// 获取交易统计
export async function getStatistics(params?: {
  start_date?: string;
  end_date?: string;
}) {
  const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
  const res = await fetch(`${API_BASE_URL}/api/statistics${query}`);
  return res.json();
}

// 获取系统日志
export async function getLogs(params: {
  date: string;
  lines?: number;
}) {
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`${API_BASE_URL}/api/logs?${query}`);
  return res.json();
}

// 获取可用日志日期
export async function getLogDates() {
  const res = await fetch(`${API_BASE_URL}/api/logs/dates`);
  return res.json();
}

// 获取订单摘要统计
export async function getOrderSummary(days: number) {
  const res = await fetch(`${API_BASE_URL}/api/orders/summary?days=${days}`);
  return res.json();
} 