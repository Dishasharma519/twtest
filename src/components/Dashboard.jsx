import React, { useState, useEffect, useMemo } from 'react';
import {
    AlertTriangle, Cloud, Settings, LayoutDashboard, Zap,
    ShieldCheck, BarChart3, ListChecks, Activity
} from 'lucide-react';

// --- Constants ---
const SCREENS = {
    DASHBOARD: 'DASHBOARD',
    THREAT_FEED: 'THREAT_FEED',
    RISK_LOG: 'RISK_LOG',
    COMPLIANCE: 'COMPLIANCE',
    ASSET_MGMT: 'ASSET_MGMT',
    REMEDIATION: 'REMEDIATION',
    SETTINGS: 'SETTINGS',
    SYSTEM_HEALTH: 'SYSTEM_HEALTH'
};

const navItems = [
    { id: SCREENS.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: SCREENS.THREAT_FEED, label: 'Threat Feed', icon: Zap },
    { id: SCREENS.RISK_LOG, label: 'Risk Log', icon: BarChart3 },
    { id: SCREENS.COMPLIANCE, label: 'Compliance', icon: ShieldCheck },
    { id: SCREENS.ASSET_MGMT, label: 'Asset Management', icon: Cloud },
    { id: SCREENS.REMEDIATION, label: 'Remediation', icon: ListChecks },
    { id: SCREENS.SYSTEM_HEALTH, label: 'System Health', icon: Activity },
    { id: SCREENS.SETTINGS, label: 'Settings', icon: Settings },
];

// --- UI Components ---
const Card = ({ title, children, className = "" }) => (
    <div className={`p-5 rounded-xl bg-gray-800 shadow-xl ${className}`}>
        <h3 className="text-lg font-semibold text-gray-200 mb-3">{title}</h3>
        {children}
    </div>
);

const RiskScoreIndicator = ({ score, label, color }) => (
    <div className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-lg bg-gradient-to-br ${color}`}>
        <p className="text-6xl font-extrabold text-white">{score}</p>
        <p className="text-sm font-medium text-gray-200 mt-1">{label}</p>
    </div>
);

const CompliancePill = ({ name, status, icon: Icon, color }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
        <Icon className={`w-6 h-6 ${color}`} />
        <div>
            <p className="text-sm font-medium text-gray-200">{name}</p>
            <p className={`text-xs ${color}`}>{status}</p>
        </div>
    </div>
);

// --- Screen Components ---
const DashboardScreen = ({ riskScore, riskComponents }) => {
    const { likelihood, impact, severity } = riskComponents;

    const riskColor = useMemo(() => {
        if (riskScore >= 80) return "from-red-600 to-red-800";
        if (riskScore >= 50) return "from-yellow-500 to-yellow-600";
        return "from-green-500 to-green-600";
    }, [riskScore]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Current Risk Posture" className="md:col-span-1">
                <RiskScoreIndicator
                    score={riskScore}
                    label="Quantified Risk Score (L × I × S)"
                    color={riskColor}
                />
            </Card>

            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card title="Likelihood (L)">
                    <p className="text-4xl font-bold text-yellow-400">{likelihood}</p>
                    <p className="text-sm text-gray-400 mt-2">Predictive probability of threat exploitation.</p>
                </Card>
                <Card title="Impact (I)">
                    <p className="text-4xl font-bold text-red-400">{impact}</p>
                    <p className="text-sm text-gray-400 mt-2">Business criticality of the affected asset.</p>
                </Card>
                <Card title="Vulnerability Severity (S)">
                    <p className="text-4xl font-bold text-indigo-400">{severity}</p>
                    <p className="text-sm text-gray-400 mt-2">CVSS-based measure of exploitability/damage.</p>
                </Card>
            </div>

            <Card title="Risk Trends (Last 24 Hours)" className="md:col-span-3">
                <div className="h-40 bg-gray-700 rounded-lg flex items-end p-3 space-x-1">
                    {[...Array(12)].map((_, i) => {
                        const height = Math.min(100, (Math.random() * 60) + 40 * (riskScore / 100));
                        const barColor = height > 60 ? 'bg-red-500' : height > 45 ? 'bg-yellow-500' : 'bg-green-500';
                        return (
                            <div key={i} className="flex-1 h-full flex flex-col justify-end items-center">
                                <div style={{ height: `${height}%` }} className={`w-3/5 rounded-t-sm ${barColor}`}></div>
                                <span className="text-xs text-gray-500 mt-1">{12 - i}h</span>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
};

const ThreatFeedScreen = ({ threatFeed }) => (
    <Card title="Real-Time Threat Events (Simulated ML Engine)">
        <p className="text-sm text-gray-400 mb-4">Data ingested live from cloud APIs, processed by the AI-Driven Threat Detection Engine.</p>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {threatFeed.length === 0 ? (
                <p className="text-gray-500">Awaiting real-time threat events...</p>
            ) : (
                threatFeed.map((event, index) => {
                    const isHighConfidence = event.confidence >= 0.9;
                    const confidenceColor = isHighConfidence ? 'text-red-400' : 'text-yellow-400';
                    const iconColor = isHighConfidence ? 'bg-red-800/50' : 'bg-yellow-800/50';

                    return (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg border-l-4 border-red-500/50 hover:bg-gray-600 transition duration-150">
                            <div className={`p-2 rounded-full ${iconColor}`}>
                                <Zap className="w-5 h-5 text-red-400" />
                            </div>
                            <div className="flex-1">
                                <p className={`font-medium ${confidenceColor}`}>{event.message}</p>
                                <p className="text-xs text-gray-400">Confidence: {event.confidence.toFixed(2)} | Source: Log Data</p>
                            </div>
                            <time className="text-xs text-gray-500">{event.timestamp}</time>
                        </div>
                    );
                })
            )}
        </div>
    </Card>
);

const RiskLogScreen = () => {
    const mockRisks = [
        { id: 1, asset: 'CustomerDB-PROD', threat: 'SQL Injection via API', L: 0.8, I: 0.9, S: 0.95, score: 68.4, priority: 'Critical' },
        { id: 2, asset: 'S3-Logs-DEV', threat: 'Misconfigured Bucket Policy', L: 0.6, I: 0.4, S: 0.7, score: 16.8, priority: 'Low' },
        { id: 3, asset: 'IAM-Admin-User', threat: 'Credential Stuffing Attempt', L: 0.75, I: 0.8, S: 0.9, score: 54.0, priority: 'High' },
        { id: 4, asset: 'Web-App-Staging', threat: 'Outdated Library', L: 0.5, I: 0.6, S: 0.8, score: 24.0, priority: 'Medium' },
    ];

    const getPriorityColor = (priority) => {
        if (priority === 'Critical') return 'bg-red-500';
        if (priority === 'High') return 'bg-orange-500';
        if (priority === 'Medium') return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <Card title="Quantitative Risk Calculation Log (L × I × S)">
            <p className="text-sm text-gray-400 mb-4">Full record of calculated risks based on continuous monitoring data.</p>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Asset</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Threat/Event</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Likelihood (L)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Impact (I)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Severity (S)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Risk Score</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Priority</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                    {mockRisks.map((risk) => (
                        <tr key={risk.id} className="hover:bg-gray-700 transition duration-150">
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{risk.asset}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{risk.threat}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-yellow-400">{risk.L.toFixed(2)}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-red-400">{risk.I.toFixed(2)}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-indigo-400">{risk.S.toFixed(2)}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold">{risk.score.toFixed(1)}</td>
                            <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${getPriorityColor(risk.priority)}`}>
                    {risk.priority}
                  </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

const ComplianceScreen = () => {
    const complianceData = [
        { name: 'NIST CSF', status: '75% Compliant', icon: ShieldCheck, color: 'text-yellow-400' },
        { name: 'GDPR Article 5', status: '100% Compliant', icon: ShieldCheck, color: 'text-green-400' },
        { name: 'HIPAA Security Rule', status: '62% Compliant', icon: ShieldCheck, color: 'text-orange-400' },
        { name: 'ISO/IEC 27017', status: 'In Scope', icon: ShieldCheck, color: 'text-gray-400' },
    ];

    const nonCompliantAssets = [
        { id: 1, asset: 'CustomerDB-PROD', rule: 'NIST: Control AC-3 (Access Enforcement)', status: 'HIGH' },
        { id: 2, asset: 'S3-Backups-PROD', rule: 'GDPR: Article 5 (Storage Limitation)', status: 'MEDIUM' },
        { id: 3, asset: 'EC2-Web-01', rule: 'NIST: Control CM-6 (Configuration Settings)', status: 'HIGH' },
    ];

    return (
        <div className="space-y-6">
            <Card title="Compliance Standard Status">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {complianceData.map((item, index) => (
                        <CompliancePill key={index} {...item} />
                    ))}
                </div>
            </Card>

            <Card title="Non-Compliant Assets Requiring Action">
                <p className="text-sm text-gray-400 mb-4">Assets failing automated checks against mandated industry standards.</p>
                <div className="space-y-3">
                    {nonCompliantAssets.map((asset) => (
                        <div key={asset.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-200">{asset.asset}</p>
                                <p className="text-xs text-gray-400">{asset.rule}</p>
                            </div>
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${asset.status === 'HIGH' ? 'bg-red-500' : 'bg-yellow-500'} text-white`}>
                {asset.status}
              </span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

const AssetManagementScreen = ({ assets, addAsset, deleteAsset }) => {
    const [assetName, setAssetName] = useState('');
    const [assetImpact, setAssetImpact] = useState(50);

    const handleAdd = (e) => {
        e.preventDefault();
        if (assetName.trim()) {
            addAsset({
                name: assetName.trim(),
                impact: Number(assetImpact),
                criticality: assetImpact >= 75 ? 'High' : assetImpact >= 40 ? 'Medium' : 'Low'
            });
            setAssetName('');
            setAssetImpact(50);
        }
    };

    return (
        <div className="space-y-6">
            <Card title="Add New Cloud Asset">
                <form onSubmit={handleAdd} className="space-y-4">
                    <input
                        type="text"
                        placeholder="e.g., prod-webserver-01, dev-s3-bucket"
                        value={assetName}
                        onChange={(e) => setAssetName(e.target.value)}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                    <div className="flex items-center space-x-4">
                        <label className="text-sm text-gray-400 w-1/4">Impact Score (1-100):</label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={assetImpact}
                            onChange={(e) => setAssetImpact(e.target.value)}
                            className="w-1/4 p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 text-center"
                            required
                        />
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={assetImpact}
                            onChange={(e) => setAssetImpact(e.target.value)}
                            className="w-1/2"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-150"
                    >
                        Define Asset and Impact (I)
                    </button>
                </form>
            </Card>

            <Card title="Defined Cloud Assets">
                <p className="text-sm text-gray-400 mb-4">Assets used in the Risk Quantification (Impact 'I' component).</p>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Asset Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Impact (I)</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Criticality</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                        {assets.map((asset) => (
                            <tr key={asset.id} className="hover:bg-gray-700 transition duration-150">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{asset.name}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-red-400">{asset.impact} / 100</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{asset.criticality}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() => deleteAsset(asset.id)}
                                        className="text-red-500 hover:text-red-700 transition duration-150"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {assets.length === 0 && <p className="text-center text-gray-500 py-4">No assets defined yet.</p>}
            </Card>
        </div>
    );
};

const RemediationTrackerScreen = () => {
    const initialTasks = [
        { id: 1, risk: 'Critical', description: 'Patch all public-facing EC2 instances (Severity S=0.95)', resolved: false },
        { id: 2, risk: 'High', description: 'Review and narrow IAM policy on Data Scientists group', resolved: false },
        { id: 3, risk: 'Medium', description: 'Enable bucket logging on dev-s3-bucket (resolved)', resolved: true },
    ];
    const [tasks, setTasks] = useState(initialTasks);

    const toggleResolved = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, resolved: !t.resolved } : t));
    };

    const unresolvedTasks = tasks.filter(t => !t.resolved);
    const resolvedTasks = tasks.filter(t => t.resolved);

    return (
        <div className="space-y-6">
            <Card title="Actionable Remediation Guidance (Unresolved)">
                <p className="text-sm text-gray-400 mb-4">Prioritized list of steps to mitigate critical and high-risk findings.</p>
                <div className="space-y-3">
                    {unresolvedTasks.length === 0 ? (
                        <p className="text-gray-500">No high-priority tasks requiring immediate attention. Good work!</p>
                    ) : (
                        unresolvedTasks.map((task) => (
                            <div key={task.id} className="flex items-start p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition duration-150">
                                <input
                                    type="checkbox"
                                    checked={task.resolved}
                                    onChange={() => toggleResolved(task.id)}
                                    className="mt-1 w-5 h-5 text-indigo-500 bg-gray-900 rounded border-gray-600 focus:ring-indigo-500"
                                />
                                <div className="ml-3 flex-1">
                                    <p className={`font-medium ${task.risk === 'Critical' ? 'text-red-400' : 'text-orange-400'}`}>{task.risk} Risk</p>
                                    <p className="text-sm text-gray-200">{task.description}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            <Card title="Resolved Tasks">
                <div className="space-y-2">
                    {resolvedTasks.map((task) => (
                        <div key={task.id} className="flex items-start p-3 bg-gray-800 rounded-lg opacity-50">
                            <input
                                type="checkbox"
                                checked={task.resolved}
                                onChange={() => toggleResolved(task.id)}
                                className="mt-1 w-5 h-5 text-green-500 bg-gray-900 rounded border-gray-600 focus:ring-green-500"
                            />
                            <div className="ml-3 flex-1">
                                <p className="text-sm line-through text-gray-400">{task.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

const SettingsScreen = () => (
    <Card title="Framework Configuration & Settings">
        <div className="space-y-4">
            <div>
                <h4 className="text-lg font-semibold text-gray-200">Compliance Standards</h4>
                <p className="text-sm text-gray-400 mb-2">Select the regulatory standards for continuous monitoring.</p>
                <div className="flex flex-wrap gap-4">
                    <label className="flex items-center space-x-2 text-gray-200">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500" />
                        <span>GDPR</span>
                    </label>
                    <label className="flex items-center space-x-2 text-gray-200">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500" />
                        <span>NIST CSF</span>
                    </label>
                    <label className="flex items-center space-x-2 text-gray-200">
                        <input type="checkbox" className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500" />
                        <span>HIPAA</span>
                    </label>
                </div>
            </div>

            <div>
                <h4 className="text-lg font-semibold text-gray-200">Risk Scoring Model</h4>
                <p className="text-sm text-gray-400 mb-2">The model uses L × I × S as defined in the methodology.</p>
                <div className="p-3 bg-gray-700 rounded-lg text-sm text-gray-300">
                    Formula: Risk Score = Likelihood (0-1) × Impact (0-100) × Severity (0-1)
                </div>
            </div>
        </div>
    </Card>
);

const SystemHealthScreen = () => {
    const services = [
        { name: 'Data Ingestion Service', status: 'Operational', latency: '45ms', color: 'text-green-400' },
        { name: 'AI-Threat Engine (Python)', status: 'Operational', latency: '120ms', color: 'text-green-400' },
        { name: 'Risk Calculation Module', status: 'Operational', latency: '80ms', color: 'text-green-400' },
        { name: 'Compliance Rules Engine', status: 'Operational', latency: '95ms', color: 'text-green-400' },
    ];

    return (
        <Card title="Core Logic Service Health">
            <p className="text-sm text-gray-400 mb-4">Real-time status of the backend microservices (Simulated).</p>
            <div className="space-y-3">
                {services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <span className={`w-3 h-3 rounded-full ${service.status === 'Operational' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <p className="font-medium text-gray-200">{service.name}</p>
                        </div>
                        <p className="text-sm text-gray-400">{service.latency}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

// --- Sidebar Navigation ---
const Sidebar = ({ currentPage, setCurrentPage }) => (
    <nav className="w-64 bg-gray-800 p-4 flex flex-col shadow-2xl">
        <div className="flex items-center space-x-2 mb-8">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-white">Risk Framework</h2>
        </div>
        <ul className="space-y-2 flex-1">
            {navItems.map((item) => {
                const isActive = currentPage === item.id;
                const Icon = item.icon;
                return (
                    <li key={item.id}>
                        <button
                            onClick={() => setCurrentPage(item.id)}
                            className={`flex items-center w-full p-3 rounded-xl transition-colors duration-150 ${
                                isActive
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            <Icon className="w-5 h-5 mr-3" />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    </li>
                );
            })}
        </ul>
    </nav>
);

// --- Main Application ---
const Dashboard = () => {
    const [currentPage, setCurrentPage] = useState(SCREENS.DASHBOARD);
    const [riskScore, setRiskScore] = useState(78);
    const [riskComponents] = useState({ likelihood: 0.8, impact: 0.9, severity: 0.95 });
    const [threatFeed, setThreatFeed] = useState([]);
    const [assets, setAssets] = useState([]);

    // Simulate threat events
    useEffect(() => {
        const threatMessages = [
            "Unusual read volume detected on a sensitive S3 bucket.",
            "New SSH key added to an unused EC2 instance.",
            "High volume of failed login attempts from a new region.",
            "CloudFormation template drift detected (Misconfiguration).",
            "Privileged IAM role assumed outside of core business hours."
        ];

        const simulateThreatEvent = () => {
            const randomIndex = Math.floor(Math.random() * threatMessages.length);
            const confidence = parseFloat(((Math.random() * 0.3) + 0.7).toFixed(2));

            setThreatFeed(prev => [{
                message: threatMessages[randomIndex],
                confidence,
                timestamp: new Date().toLocaleTimeString()
            }, ...prev.slice(0, 9)]);

            setRiskScore(prev => {
                const change = confidence > 0.85 ? 1 : Math.random() < 0.5 ? 0 : -1;
                return Math.max(50, Math.min(99, prev + change));
            });
        };

        const intervalId = setInterval(simulateThreatEvent, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const addAsset = (asset) => {
        setAssets(prev => [...prev, { ...asset, id: Date.now() }]);
    };

    const deleteAsset = (id) => {
        setAssets(prev => prev.filter(a => a.id !== id));
    };

    const renderScreen = () => {
        switch (currentPage) {
            case SCREENS.DASHBOARD:
                return <DashboardScreen riskScore={riskScore} riskComponents={riskComponents} />;
            case SCREENS.THREAT_FEED:
                return <ThreatFeedScreen threatFeed={threatFeed} />;
            case SCREENS.RISK_LOG:
                return <RiskLogScreen />;
            case SCREENS.COMPLIANCE:
                return <ComplianceScreen />;
            case SCREENS.ASSET_MGMT:
                return <AssetManagementScreen assets={assets} addAsset={addAsset} deleteAsset={deleteAsset} />;
            case SCREENS.REMEDIATION:
                return <RemediationTrackerScreen />;
            case SCREENS.SETTINGS:
                return <SettingsScreen />;
            case SCREENS.SYSTEM_HEALTH:
                return <SystemHealthScreen />;
            default:
                return <DashboardScreen riskScore={riskScore} riskComponents={riskComponents} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex antialiased">
            <style jsx global>{`
        body { font-family: 'Inter', sans-serif; }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: #6366f1;
          cursor: pointer;
          border-radius: 9999px;
        }
        input[type='range']::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #6366f1;
          cursor: pointer;
          border-radius: 9999px;
        }
      `}</style>

            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

            <main className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-3xl font-extrabold text-white mb-8 border-b border-gray-700 pb-3">
                    {navItems.find(item => item.id === currentPage)?.label || 'Risk Dashboard'}
                </h1>
                {renderScreen()}
            </main>
        </div>
    );
};

export default Dashboard;