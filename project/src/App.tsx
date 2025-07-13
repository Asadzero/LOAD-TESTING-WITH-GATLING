import React, { useState, useEffect } from 'react';
import { BarChart3, Users, ShoppingCart, TrendingUp, Activity, Clock, AlertTriangle, CheckCircle, Target, Zap } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  duration?: number;
  requests?: number;
  errors?: number;
  avgResponseTime?: number;
  throughput?: number;
}

interface MetricCard {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  change?: string;
}

function App() {
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([
    { name: 'Load Test', status: 'pending' },
    { name: 'Stress Test', status: 'pending' },
    { name: 'Spike Test', status: 'pending' },
    { name: 'Endurance Test', status: 'pending' }
  ]);

  const [currentTest, setCurrentTest] = useState<string | null>(null);

  useEffect(() => {
    checkServerHealth();
    const interval = setInterval(checkServerHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkServerHealth = async () => {
    try {
      const response = await fetch('http://localhost:3001/health');
      setIsServerRunning(response.ok);
    } catch {
      setIsServerRunning(false);
    }
  };

  const runTest = async (testType: string) => {
    setCurrentTest(testType);
    setTestResults(prev => prev.map(test => 
      test.name === testType ? { ...test, status: 'running' } : test
    ));

    // Simulate test execution
    setTimeout(() => {
      setTestResults(prev => prev.map(test => 
        test.name === testType ? { 
          ...test, 
          status: 'completed',
          duration: Math.floor(Math.random() * 300) + 60,
          requests: Math.floor(Math.random() * 10000) + 1000,
          errors: Math.floor(Math.random() * 50),
          avgResponseTime: Math.floor(Math.random() * 500) + 50,
          throughput: Math.floor(Math.random() * 500) + 100
        } : test
      ));
      setCurrentTest(null);
    }, Math.random() * 5000 + 3000);
  };

  const performanceMetrics: MetricCard[] = [
    {
      title: 'Avg Response Time',
      value: '127ms',
      icon: Clock,
      color: 'text-blue-600',
      change: '+12%'
    },
    {
      title: 'Requests/sec',
      value: '1,247',
      icon: TrendingUp,
      color: 'text-green-600',
      change: '+5.2%'
    },
    {
      title: 'Error Rate',
      value: '0.3%',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      change: '-0.1%'
    },
    {
      title: 'Concurrent Users',
      value: '850',
      icon: Users,
      color: 'text-purple-600',
      change: '+15%'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'running': return 'text-blue-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'running': return Activity;
      case 'failed': return AlertTriangle;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Advanced Load Testing Suite</h1>
                <p className="text-slate-600">Performance testing with Artillery</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`h-3 w-3 rounded-full ${isServerRunning ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium text-slate-700">
                Server {isServerRunning ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Performance Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                  {metric.change && (
                    <p className="text-sm text-slate-500 mt-1">{metric.change} from last test</p>
                  )}
                </div>
                <div className={`p-3 rounded-lg bg-slate-50`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Test Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Suite */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Target className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-900">Load Test Suite</h2>
            </div>
            <div className="space-y-4">
              {testResults.map((test, index) => {
                const StatusIcon = getStatusIcon(test.status);
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-3">
                      <StatusIcon className={`h-5 w-5 ${getStatusColor(test.status)}`} />
                      <div>
                        <h3 className="font-medium text-slate-900">{test.name}</h3>
                        {test.status === 'completed' && test.duration && (
                          <p className="text-sm text-slate-600">
                            {test.duration}s • {test.requests} requests • {test.errors} errors
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => runTest(test.name)}
                      disabled={!isServerRunning || currentTest === test.name}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        !isServerRunning || currentTest === test.name
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {currentTest === test.name ? 'Running...' : 'Run Test'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Test Configuration */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Zap className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-slate-900">Test Configuration</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-slate-900 mb-3">Load Test Scenarios</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>User Registration & Shopping</span>
                    <span className="font-medium">40% weight</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Login & Purchase Flow</span>
                    <span className="font-medium">35% weight</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Product Search & Browse</span>
                    <span className="font-medium">20% weight</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Analytics Dashboard</span>
                    <span className="font-medium">5% weight</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-slate-900 mb-3">Test Phases</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Warm up (60s)</span>
                    <span className="font-medium">5 users/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Normal load (120s)</span>
                    <span className="font-medium">20 users/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Peak load (180s)</span>
                    <span className="font-medium">50 users/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cool down (60s)</span>
                    <span className="font-medium">10 users/s</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">Test Environment</p>
                    <p className="text-amber-700">Make sure the test server is running on port 3001 before executing tests.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Results Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold text-slate-900">Performance Analysis</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-1">98.7%</div>
              <div className="text-sm text-green-700">Success Rate</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">2.3s</div>
              <div className="text-sm text-blue-700">95th Percentile</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600 mb-1">1,247</div>
              <div className="text-sm text-purple-700">Peak RPS</div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-slate-50 rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Getting Started</h3>
          <div className="space-y-3 text-sm text-slate-700">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
              <p>Start the test server: <code className="bg-slate-200 px-2 py-1 rounded text-xs">npm run server</code></p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
              <p>Run individual tests: <code className="bg-slate-200 px-2 py-1 rounded text-xs">npm run test:load</code></p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
              <p>Or run all tests: <code className="bg-slate-200 px-2 py-1 rounded text-xs">npm run test:all</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;