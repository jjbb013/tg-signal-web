"use client";
import { useEffect, useState } from "react";
import { getLogs, getLogDates } from "@/api";

function highlightLog(line: string) {
  if (line.includes("ERROR")) return <span className="text-red-600 font-bold">{line}</span>;
  if (line.includes("WARN")) return <span className="text-yellow-600">{line}</span>;
  if (line.includes("INFO")) return <span className="text-blue-600">{line}</span>;
  return <span>{line}</span>;
}

export default function LogsPage() {
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lines, setLines] = useState(100);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getLogDates().then(res => {
      setDates(res.available_dates || []);
      if (res.available_dates && res.available_dates.length > 0) {
        setSelectedDate(res.available_dates[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    setLoading(true);
    setError("");
    getLogs({ date: selectedDate, lines })
      .then(res => setLogs(res.logs || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [selectedDate, lines]);

  const filteredLogs = search
    ? logs.filter(line => line.toLowerCase().includes(search.toLowerCase()))
    : logs;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-blue-600">系统日志</h2>
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <div>
          <label className="mr-2 text-gray-700">选择日期</label>
          <select
            className="border rounded px-2 py-1"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          >
            {dates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mr-2 text-gray-700">日志行数</label>
          <input
            type="number"
            min={1}
            max={1000}
            className="border rounded px-2 py-1 w-20"
            value={lines}
            onChange={e => setLines(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="mr-2 text-gray-700">搜索</label>
          <input
            type="text"
            className="border rounded px-2 py-1"
            placeholder="输入关键字过滤日志"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="bg-white rounded shadow p-4 overflow-x-auto" style={{ minHeight: 300, maxHeight: 500, overflowY: 'auto' }}>
        {loading ? (
          <div className="text-center text-gray-500 py-8">加载中...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center text-gray-400 py-8">暂无日志数据</div>
        ) : (
          <pre className="text-xs whitespace-pre-wrap">
            {filteredLogs.map((line, idx) => <div key={idx}>{highlightLog(line)}</div>)}
          </pre>
        )}
      </div>
    </div>
  );
} 