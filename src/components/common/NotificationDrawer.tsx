import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import { PlatformNotification } from '../../types';

export const NotificationDrawer: React.FC = () => {
  const { 
    isNotificationDrawerOpen, 
    setIsNotificationDrawerOpen, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead 
  } = useApp();

  if (!isNotificationDrawerOpen) return null;

  const getIcon = (type: PlatformNotification['type']) => {
    switch (type) {
      case 'booking':
        return <Truck className="w-4 h-4 text-amber-500" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-sky-400" />;
      case 'otp':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full bg-neutral-900 border-l border-neutral-800 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Notifications</h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono font-bold">
                {notifications.filter(n => !n.read).length} Unread
              </span>
            </div>

            <button
              onClick={() => setIsNotificationDrawerOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-end mb-3">
            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-amber-400 hover:underline font-medium"
            >
              Mark all as read
            </button>
          </div>

          {/* List */}
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">
                No notifications to display.
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    notif.read
                      ? 'bg-neutral-950/60 border-neutral-800 text-neutral-400'
                      : 'bg-neutral-950 border-amber-500/40 text-neutral-200 shadow-md ring-1 ring-amber-500/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-neutral-900 shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-white truncate">{notif.title}</span>
                        <span className="text-[10px] text-neutral-500 shrink-0 font-mono">{notif.timestamp}</span>
                      </div>
                      <p className="text-xs mt-1 text-neutral-300 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-neutral-800 text-center text-[11px] text-neutral-500">
          BuildHaul Automated Dispatch & Escrow Alerts
        </div>

      </div>
    </div>
  );
};
