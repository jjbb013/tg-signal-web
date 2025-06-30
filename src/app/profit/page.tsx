"use client";
import { useEffect, useState } from "react";
import { getStatistics } from "@/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function ProfitPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [trend, setTrend] = useState<any[]>([]);

  const fetchStats = () => {
    setLoading(true);
    setError("");
    getStatistics({ start_date: startDate, end_date: endDate })
      .then((data) => {
        setStats(data);
        // 假设后端返回 trend 字段为每日盈亏数组，否则可用 mock 数据
        setTrend(data.trend || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-blue-600">盈利数据</h2>
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <div>
          <label className="mr-2 text-gray-700">开始日期</label>
          <input type="date" className="border rounded px-2 py-1" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div>
          <label className="mr-2 text-gray-700">结束日期</label>
          <input type="date" className="border rounded px-2 py-1" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600" onClick={fetchStats}>
          查询
        </button>
      </div>
      <div className="bg-white rounded shadow p-4 mb-4">
        {loading ? (
          <div className="text-center text-gray-500 py-8">加载中...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : !stats ? (
          <div className="text-center text-gray-400 py-8">暂无统计数据</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded text-center">
              <div className="text-gray-500">总订单数</div>
              <div className="text-2xl font-bold text-blue-700">{stats.total_orders}</div>
            </div>
            <div className="p-4 bg-green-50 rounded text-center">
              <div className="text-gray-500">成功订单</div>
              <div className="text-2xl font-bold text-green-700">{stats.successful_orders}</div>
            </div>
            <div className="p-4 bg-red-50 rounded text-center">
              <div className="text-gray-500">失败订单</div>
              <div className="text-2xl font-bold text-red-700">{stats.failed_orders}</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded text-center">
              <div className="text-gray-500">成功率</div>
              <div className="text-2xl font-bold text-yellow-700">{stats.success_rate}%</div>
            </div>
            <div className="p-4 bg-purple-50 rounded text-center">
              <div className="text-gray-500">总盈亏</div>
              <div className="text-2xl font-bold text-purple-700">{stats.total_profit_loss}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded text-center col-span-2 md:col-span-1">
              <div className="text-gray-500">统计区间</div>
              <div className="text-base font-bold text-gray-700">{stats.period?.start_date} ~ {stats.period?.end_date}</div>
            </div>
          </div>
        )}
      </div>
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-bold mb-2 text-blue-600">盈亏趋势</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trend.length ? trend : [{date: '无数据', profit: 0}] }>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="profit" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 