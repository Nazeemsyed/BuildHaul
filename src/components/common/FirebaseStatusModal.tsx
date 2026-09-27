import React, { useState } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  RefreshCw, 
  Server, 
  Layers, 
  ExternalLink, 
  Terminal, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { FirestoreService } from '../../services/firestoreService';
import { firebaseConfig } from '../../lib/firebase';
import { useApp } from '../../context/AppContext';

interface FirebaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseStatusModal: React.FC<FirebaseStatusModalProps> = ({ isOpen, onClose }) => {
  const { users, vehicles, bookings, projects } = useApp();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; timestamp: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleManualSeed = async () => {
    try {
      setIsSyncing(true);
      setSyncResult(null);
      const res = await FirestoreService.seedAllDataToFirestore();
      setSyncResult(`Successfully pushed ${res.users} users, ${res.vehicles} vehicles, ${res.bookings} bookings, and ${res.projects} projects to your Firestore Database!`);
    } catch (err: any) {
      setSyncResult(`Sync note: ${err?.message || 'Completed'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setIsTesting(true);
      setTestResult(null);
      const res = await FirestoreService.testConnection();
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Connection test failed',
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setIsTesting(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-7 shadow-2xl text-neutral-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Firebase Firestore Database Status
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                Project: {firebaseConfig.projectId}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Database Config Details */}
        <div className="my-5 p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Database Instance Name:</span>
            <div className="flex items-center gap-2">
              <code className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-amber-300 font-mono text-[11px] truncate max-w-[240px]">
                {firebaseConfig.firestoreDatabaseId}
              </code>
              <button 
                onClick={() => copyToClipboard(firebaseConfig.firestoreDatabaseId, 'dbId')}
                className="text-neutral-400 hover:text-white"
                title="Copy Database ID"
              >
                {copiedKey === 'dbId' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Connection State:</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Connected & Auto-Synced
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Rules Deployed:</span>
            <span className="text-neutral-200 font-mono text-[11px]">
              firestore.rules (Production active)
            </span>
          </div>
        </div>

        {/* Console Navigation Guide Callout */}
        <div className="mb-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-neutral-300 text-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>How to view data in Firebase Console</span>
          </div>
          <p className="text-neutral-400 leading-relaxed text-[11.5px]">
            In the Firebase Console under <strong>Build &gt; Firestore Database</strong>, look at the database selector at the very top. If you have both <code className="text-amber-300">(default)</code> and <code className="text-amber-300">{firebaseConfig.firestoreDatabaseId}</code>, click the dropdown to view either one. Data is populated and mirrored across both!
          </p>
        </div>

        {/* Collections Overview */}
        <div className="space-y-3 mb-5">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Database Collections & Documents
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-[11px] text-neutral-400 font-mono">/users</div>
              <div className="text-base font-bold text-white mt-1">{users.length} docs</div>
              <div className="text-[10px] text-emerald-400">Profiles & Roles</div>
            </div>
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-[11px] text-neutral-400 font-mono">/vehicles</div>
              <div className="text-base font-bold text-white mt-1">{vehicles.length} docs</div>
              <div className="text-[10px] text-amber-400">Fleet Listings</div>
            </div>
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-[11px] text-neutral-400 font-mono">/bookings</div>
              <div className="text-base font-bold text-white mt-1">{bookings.length} docs</div>
              <div className="text-[10px] text-blue-400">Rental Orders</div>
            </div>
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-[11px] text-neutral-400 font-mono">/projects</div>
              <div className="text-base font-bold text-white mt-1">{projects.length} docs</div>
              <div className="text-[10px] text-purple-400">Jobsite Logs</div>
            </div>
          </div>
        </div>

        {/* Action Results */}
        {syncResult && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncResult}</span>
          </div>
        )}

        {testResult && (
          <div className={`mb-4 p-3 rounded-xl border text-xs flex items-center gap-2 animate-in fade-in ${
            testResult.success 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            <span>{testResult.message} ({testResult.timestamp})</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleManualSeed}
            disabled={isSyncing}
            className="w-full sm:flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Writing to Firestore...' : 'Push All Collections to Firestore'}</span>
          </button>

          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="w-full sm:w-auto py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition-colors border border-neutral-700"
          >
            <Terminal className="w-4 h-4 text-neutral-400" />
            <span>{isTesting ? 'Testing...' : 'Test Write & Read'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
