"use client";
import { useEffect, useState } from "react";
import { getOrders } from "@/api";
import dayjs from "dayjs";

interface Order {
  orderId: string;
  timestamp: string;
  action: string;
  quantity: string;
  status: string;
  account_name?: string;
  symbol?: string;
}

const PAGE_SIZE = 10;
const ACTIONS = ["全部", "做多", "做空"];
const STATUSES = ["全部", "成功", "失败"];
const SYMBOLS = ["全部", "BTC", "ETH", "BNB"];
const ACCOUNTS = ["全部", "OKX1", "OKX2"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [action, setAction] = useState("全部");
  const [status, setStatus] = useState("全部");
  const [symbol, setSymbol] = useState("全部");
  const [account, setAccount] = useState("全部");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = () => {
    setLoading(true);
    setError("");
    const params: any = {
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    };
    if (action !== "全部") params.action = action;
    if (status !== "全部") params.status = status;
    if (symbol !== "全部") params.symbol = symbol;
    if (account !== "全部") params.account_name = account;
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    getOrders(params)
      .then((data) => {
        setOrders(data.orders || []);
        setTotal(data.total || 0);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [page]);

  const handleFilter = () => {
    setPage(1);
    setTimeout(fetchOrders, 0);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-blue-600">订单列表</h2>
      {/* 筛选栏 */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <div>
          <label className="mr-2 text-gray-700">账号</label>
          <select className="border rounded px-2 py-1" value={account} onChange={e => setAccount(e.target.value)}>
            {ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label className="mr-2 text-gray-700">币种</label>
          <select className="border rounded px-2 py-1" value={symbol} onChange={e => setSymbol(e.target.value)}>
            {SYMBOLS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="mr-2 text-gray-700">方向</label>
          <select className="border rounded px-2 py-1" value={action} onChange={e => setAction(e.target.value)}>
            {ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label className="mr-2 text-gray-700">状态</label>
          <select className="border rounded px-2 py-1" value={status} onChange={e => setStatus(e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="mr-2 text-gray-700">开始日期</label>
          <input type="date" className="border rounded px-2 py-1" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div>
          <label className="mr-2 text-gray-700">结束日期</label>
          <input type="date" className="border rounded px-2 py-1" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600" onClick={handleFilter}>
          查询
        </button>
      </div>
      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        {loading ? (
          <div className="text-center text-gray-500 py-8">加载中...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-400 py-8">暂无订单数据</div>
        ) : (
          <table className="min-w-full text-sm border rounded overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 text-left">订单号</th>
                <th className="px-3 py-2 text-left">账号</th>
                <th className="px-3 py-2 text-left">币种</th>
                <th className="px-3 py-2 text-left">时间</th>
                <th className="px-3 py-2 text-left">方向</th>
                <th className="px-3 py-2 text-left">数量</th>
                <th className="px-3 py-2 text-left">状态</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={order.orderId} className={"border-b hover:bg-gray-50 " + (idx % 2 === 0 ? "bg-gray-50" : "bg-white") }>
                  <td className="px-3 py-2 font-mono">{order.orderId}</td>
                  <td className="px-3 py-2">{order.account_name || '-'}</td>
                  <td className="px-3 py-2">{order.symbol || '-'}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{dayjs(order.timestamp).format('YYYY-MM-DD HH:mm:ss')}</td>
                  <td className="px-3 py-2">
                    <span className={order.action === "做多" ? "bg-green-100 text-green-700 px-2 py-0.5 rounded" : order.action === "做空" ? "bg-red-100 text-red-700 px-2 py-0.5 rounded" : "bg-gray-100 text-gray-700 px-2 py-0.5 rounded"}>{order.action}</span>
                  </td>
                  <td className="px-3 py-2">{order.quantity}</td>
                  <td className="px-3 py-2">
                    <span className={order.status === "成功" ? "bg-green-100 text-green-700 px-2 py-0.5 rounded" : order.status === "失败" ? "bg-red-100 text-red-700 px-2 py-0.5 rounded" : "bg-gray-100 text-gray-700 px-2 py-0.5 rounded"}>{order.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* 分页控件 */}
        <div className="flex justify-center items-center mt-4 gap-4">
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            上一页
          </button>
          <span>
            第 <b>{page}</b> / {totalPages} 页
          </span>
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  );
} 