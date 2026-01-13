import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGoHighLevel } from '@/hooks/useGoHighLevel';
import { useToast } from '@/hooks/use-toast';
import {
  Link,
  Phone,
  Users,
  Zap,
  CheckCircle2,
  ArrowRight,
  Megaphone,
  Settings,
  TrendingUp
} from 'lucide-react';

// Lazy load the heavy components
const GoHighLevelManager = React.lazy(() => import('@/components/GoHighLevelManager'));
const VoiceBroadcastManager = React.lazy(() => import('@/components/VoiceBroadcastManager'));

const GHLDemo = () => {
  const [isGHLConnected, setIsGHLConnected] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const { getGHLCredentials, testConnection } = useGoHighLevel();
  const { toast } = useToast();

  // Check GHL connection on load
  useEffect(() => {
    const checkConnection = async () => {
      const creds = await getGHLCredentials();
      if (creds) {
        const result = await testConnection(creds);
        if (result) {
          setIsGHLConnected(true);
          setActiveStep(2);
        }
      }
    };
    checkConnection();
  }, []);

  const steps = [
    {
      id: 1,
      title: 'Connect GHL',
      description: 'Link your Go High Level account',
      icon: Link,
      completed: isGHLConnected
    },
    {
      id: 2,
      title: 'Import Contacts',
      description: 'Import leads from GHL with tag filtering',
      icon: Users,
      completed: false
    },
    {
      id: 3,
      title: 'Launch Broadcast',
      description: 'Start voice broadcast campaign',
      icon: Megaphone,
      completed: false
    },
    {
      id: 4,
      title: 'Auto-Sync Results',
      description: 'Outcomes sync back to GHL pipelines',
      icon: Zap,
      completed: false
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Dialer GHL Buddy</h1>
                <p className="text-sm text-slate-400">AI-Powered Automation for Go High Level</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isGHLConnected ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  GHL Connected
                </Badge>
              ) : (
                <Badge variant="outline" className="text-slate-400 border-slate-600">
                  Not Connected
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div
                  className={`flex flex-col items-center cursor-pointer transition-all ${
                    activeStep === step.id ? 'scale-110' : ''
                  }`}
                  onClick={() => setActiveStep(step.id)}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                    step.completed
                      ? 'bg-green-500 text-white'
                      : activeStep === step.id
                        ? 'bg-blue-500 text-white ring-4 ring-blue-500/30'
                        : 'bg-slate-700 text-slate-400'
                  }`}>
                    {step.completed ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-xs font-medium ${
                    activeStep === step.id ? 'text-white' : 'text-slate-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    step.completed ? 'bg-green-500' : 'bg-slate-700'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={String(activeStep)} onValueChange={(v) => setActiveStep(Number(v))} className="space-y-6">
          <TabsList className="hidden">
            <TabsTrigger value="1">Connect</TabsTrigger>
            <TabsTrigger value="2">Import</TabsTrigger>
            <TabsTrigger value="3">Broadcast</TabsTrigger>
            <TabsTrigger value="4">Results</TabsTrigger>
          </TabsList>

          {/* Step 1: Connect GHL */}
          <TabsContent value="1" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Link className="w-5 h-5 text-blue-400" />
                  Connect Go High Level
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Enter your GHL API key and Location ID to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <React.Suspense fallback={<div className="text-slate-400">Loading...</div>}>
                  <GoHighLevelManager />
                </React.Suspense>
              </CardContent>
            </Card>

            {isGHLConnected && (
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={() => setActiveStep(2)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Continue to Import Contacts
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Step 2: Import Contacts */}
          <TabsContent value="2" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-400" />
                  Import Contacts from GHL
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Filter by tags and import contacts for your broadcast
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isGHLConnected ? (
                  <React.Suspense fallback={<div className="text-slate-400">Loading...</div>}>
                    <GoHighLevelManager />
                  </React.Suspense>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400 mb-4">Please connect to GHL first</p>
                    <Button onClick={() => setActiveStep(1)}>
                      Go to Connect
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setActiveStep(1)}>
                Back
              </Button>
              <Button
                size="lg"
                onClick={() => setActiveStep(3)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue to Voice Broadcast
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </TabsContent>

          {/* Step 3: Voice Broadcast */}
          <TabsContent value="3" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-orange-400" />
                  Launch Voice Broadcast
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Create and launch your voice broadcast campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                <React.Suspense fallback={<div className="text-slate-400">Loading broadcast manager...</div>}>
                  <VoiceBroadcastManager />
                </React.Suspense>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setActiveStep(2)}>
                Back
              </Button>
              <Button
                size="lg"
                onClick={() => setActiveStep(4)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                View Results & Sync
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </TabsContent>

          {/* Step 4: Results & Auto-Sync */}
          <TabsContent value="4" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    Auto-Sync Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Pipeline Stage Updates</p>
                      <p className="text-sm text-slate-400">Automatically move leads in GHL based on call outcomes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Tag Application</p>
                      <p className="text-sm text-slate-400">Add tags like "Interested", "Callback", "No Answer" automatically</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Custom Field Updates</p>
                      <p className="text-sm text-slate-400">Update last call date, outcome, duration, and more</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Callback Scheduling</p>
                      <p className="text-sm text-slate-400">Callbacks sync to GHL calendar automatically</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    What Happens After Calls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-300">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold">1</div>
                      <span>Call completes (answered, voicemail, no answer)</span>
                    </div>
                    <div className="w-0.5 h-4 bg-slate-600 ml-4" />
                    <div className="flex items-center gap-2 text-slate-300">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold">2</div>
                      <span>Disposition auto-applied based on outcome</span>
                    </div>
                    <div className="w-0.5 h-4 bg-slate-600 ml-4" />
                    <div className="flex items-center gap-2 text-slate-300">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold">3</div>
                      <span>GHL contact updated with call data</span>
                    </div>
                    <div className="w-0.5 h-4 bg-slate-600 ml-4" />
                    <div className="flex items-center gap-2 text-slate-300">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold">4</div>
                      <span>Tags added, pipeline stage moved</span>
                    </div>
                    <div className="w-0.5 h-4 bg-slate-600 ml-4" />
                    <div className="flex items-center gap-2 text-slate-300">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-sm font-bold">✓</div>
                      <span>No manual work required!</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/30">
              <CardContent className="py-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Ready to Scale?</h3>
                  <p className="text-slate-300 mb-4">
                    Upgrade for AI-powered calls with Retell, predictive dialing, and autonomous mode.
                  </p>
                  <div className="flex justify-center gap-4 flex-wrap">
                    <Badge className="bg-slate-700 text-slate-300">Voice Broadcast - $59/mo</Badge>
                    <Badge className="bg-blue-600 text-white">+ Pipeline Automation - $149/mo</Badge>
                    <Badge className="bg-purple-600 text-white">+ AI Dialing - $299/mo</Badge>
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">Full Autonomous - $499/mo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button variant="outline" onClick={() => setActiveStep(1)}>
                Start Over
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GHLDemo;
