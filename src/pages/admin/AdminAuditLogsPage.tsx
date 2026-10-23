import React, { useEffect, useState } from 'react';
import { adminService, SystemActivityItem } from '@/services/api/adminService';
import { Card } from '@/components/ui/Cards';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { ShieldCheck } from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<SystemActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const res = await adminService.getSystemActivity();
        if (res.success && res.data) {
          setLogs(res.data);
        } else {
          setLogs([]);
        }
      } catch {
        setLogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 text-left pb-16">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-6 h-6 text-brand-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Activity Audit Logs</h1>
          <p className="text-xs text-slate-500">Immutable record of all moderation actions and account status modifications</p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden border border-slate-200 shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="p-3.5">Admin</th>
                <th className="p-3.5">Action Executed</th>
                <th className="p-3.5">Target Type / ID</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Reason & Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <SkeletonLoader variant="table" count={3} />
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No moderation actions logged yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-bold text-slate-900">{log.adminName || log.actor || 'Admin'}</td>
                    <td className="p-3.5 font-semibold text-brand-600">{log.action}</td>
                    <td className="p-3.5 text-slate-800 font-semibold">{log.targetType || 'USER'} ({log.targetId || log.target})</td>
                    <td className="p-3.5 text-slate-400 font-mono">{log.createdAt || log.timestamp}</td>
                    <td className="p-3.5 text-slate-600">{log.reason || 'Admin action'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
