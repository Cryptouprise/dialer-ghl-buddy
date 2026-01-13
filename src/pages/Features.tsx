import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  Lock,
  Crown,
  Phone,
  GitBranch,
  Bot,
  Brain,
  Building2,
  ArrowLeft,
  Sparkles,
  Radio,
  Loader2,
  ArrowDown,
} from 'lucide-react';
import {
  useFeatureFlags,
  TierName,
  TIER_INFO,
  FEATURE_INFO,
  FeatureKey,
} from '@/hooks/useFeatureFlags';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Feature categories with icons
const FEATURE_CATEGORIES = [
  {
    tier: 'tier1' as TierName,
    name: 'Voice Broadcast',
    price: '$59/mo',
    icon: Radio,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    description: 'Send automated voice broadcasts to your contacts via Twilio',
    features: ['voice_broadcast', 'ghl_contact_import', 'ghl_basic_tagging'] as FeatureKey[],
  },
  {
    tier: 'tier2' as TierName,
    name: 'Pipeline Automation',
    price: '$149/mo',
    icon: GitBranch,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    description: 'Automate your GHL pipelines based on call outcomes',
    features: ['pipeline_sync', 'disposition_automation', 'callback_scheduling', 'workflow_triggers'] as FeatureKey[],
  },
  {
    tier: 'tier3' as TierName,
    name: 'AI Dialing',
    price: '$299/mo',
    icon: Bot,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    description: 'AI-powered conversations with Retell integration',
    features: ['ai_dialing', 'retell_integration', 'transcript_analysis', 'predictive_pacing'] as FeatureKey[],
  },
  {
    tier: 'tier4' as TierName,
    name: 'Autonomous Mode',
    price: '$499/mo',
    icon: Brain,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    description: 'Full autonomous agent operation with self-learning',
    features: ['autonomous_mode', 'ai_pipeline_manager', 'self_learning', 'script_optimization'] as FeatureKey[],
  },
  {
    tier: 'tier5' as TierName,
    name: 'Enterprise',
    price: '$1,000+/mo',
    icon: Building2,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    description: 'Multi-carrier support, custom dashboards, and API access',
    features: ['multi_carrier', 'custom_dashboard', 'white_label', 'api_access'] as FeatureKey[],
  },
];

// Tier feature flags mapping
const TIER_FLAGS: Record<TierName, Record<string, boolean>> = {
  free: {
    voice_broadcast: true,
    ghl_contact_import: true,
    ghl_basic_tagging: true,
  },
  tier1: {
    voice_broadcast: true,
    ghl_contact_import: true,
    ghl_basic_tagging: true,
  },
  tier2: {
    voice_broadcast: true,
    ghl_contact_import: true,
    ghl_basic_tagging: true,
    pipeline_sync: true,
    disposition_automation: true,
    callback_scheduling: true,
    workflow_triggers: true,
  },
  tier3: {
    voice_broadcast: true,
    ghl_contact_import: true,
    ghl_basic_tagging: true,
    pipeline_sync: true,
    disposition_automation: true,
    callback_scheduling: true,
    workflow_triggers: true,
    ai_dialing: true,
    retell_integration: true,
    transcript_analysis: true,
    predictive_pacing: true,
  },
  tier4: {
    voice_broadcast: true,
    ghl_contact_import: true,
    ghl_basic_tagging: true,
    pipeline_sync: true,
    disposition_automation: true,
    callback_scheduling: true,
    workflow_triggers: true,
    ai_dialing: true,
    retell_integration: true,
    transcript_analysis: true,
    predictive_pacing: true,
    autonomous_mode: true,
    ai_pipeline_manager: true,
    self_learning: true,
    script_optimization: true,
  },
  tier5: {
    voice_broadcast: true,
    ghl_contact_import: true,
    ghl_basic_tagging: true,
    pipeline_sync: true,
    disposition_automation: true,
    callback_scheduling: true,
    workflow_triggers: true,
    ai_dialing: true,
    retell_integration: true,
    transcript_analysis: true,
    predictive_pacing: true,
    autonomous_mode: true,
    ai_pipeline_manager: true,
    self_learning: true,
    script_optimization: true,
    multi_carrier: true,
    custom_dashboard: true,
    api_access: true,
  },
  enterprise: {
    voice_broadcast: true,
    ghl_contact_import: true,
    ghl_basic_tagging: true,
    pipeline_sync: true,
    disposition_automation: true,
    callback_scheduling: true,
    workflow_triggers: true,
    ai_dialing: true,
    retell_integration: true,
    transcript_analysis: true,
    predictive_pacing: true,
    autonomous_mode: true,
    ai_pipeline_manager: true,
    self_learning: true,
    script_optimization: true,
    multi_carrier: true,
    custom_dashboard: true,
    white_label: true,
    api_access: true,
  },
};

const Features: React.FC = () => {
  const navigate = useNavigate();
  const { hasFeature, hasTier, currentTier, tierInfo, refresh } = useFeatureFlags();
  const { toast } = useToast();
  const [upgradingTier, setUpgradingTier] = useState<TierName | null>(null);

  const handleUpgrade = async (tier: TierName, tierName: string) => {
    setUpgradingTier(tier);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to upgrade',
          variant: 'destructive',
        });
        return;
      }

      // Get the flags for this tier
      const flags = TIER_FLAGS[tier];

      // Update the user's feature flags
      const { error } = await supabase
        .from('user_feature_flags')
        .update({
          current_tier: tier,
          subscription_status: 'active',
          ...flags,
          // Reset any features not in this tier
          autonomous_mode: flags.autonomous_mode || false,
          ai_pipeline_manager: flags.ai_pipeline_manager || false,
          self_learning: flags.self_learning || false,
          script_optimization: flags.script_optimization || false,
          multi_carrier: flags.multi_carrier || false,
          custom_dashboard: flags.custom_dashboard || false,
          white_label: flags.white_label || false,
          api_access: flags.api_access || false,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh the feature flags
      await refresh();

      toast({
        title: 'Upgraded!',
        description: `You now have access to ${tierName} features`,
      });

      // Navigate back to dashboard to see new features
      setTimeout(() => navigate('/'), 1000);

    } catch (error) {
      console.error('Upgrade error:', error);
      toast({
        title: 'Upgrade Failed',
        description: 'There was an error upgrading your account',
        variant: 'destructive',
      });
    } finally {
      setUpgradingTier(null);
    }
  };

  const handleDowngrade = async () => {
    setUpgradingTier('free');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_feature_flags')
        .update({
          current_tier: 'free',
          subscription_status: 'inactive',
          voice_broadcast: true,
          ghl_contact_import: true,
          ghl_basic_tagging: true,
          pipeline_sync: false,
          disposition_automation: false,
          callback_scheduling: false,
          workflow_triggers: false,
          ai_dialing: false,
          retell_integration: false,
          transcript_analysis: false,
          predictive_pacing: false,
          autonomous_mode: false,
          ai_pipeline_manager: false,
          self_learning: false,
          script_optimization: false,
          multi_carrier: false,
          custom_dashboard: false,
          white_label: false,
          api_access: false,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      await refresh();

      toast({
        title: 'Downgraded',
        description: 'You are now on the Free Trial',
      });

      setTimeout(() => navigate('/'), 1000);

    } catch (error) {
      console.error('Downgrade error:', error);
      toast({
        title: 'Error',
        description: 'Failed to downgrade',
        variant: 'destructive',
      });
    } finally {
      setUpgradingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Explore Features</h1>
            <p className="text-sm text-muted-foreground">
              Unlock powerful capabilities for your dialing system
            </p>
          </div>
          <div className="ml-auto">
            <Badge variant={currentTier === 'free' ? 'secondary' : 'default'} className="gap-1">
              <Crown className="h-3 w-3" />
              Current: {tierInfo.name}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Current Plan Summary */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{tierInfo.name}</h2>
                <p className="text-sm text-muted-foreground">
                  You have access to {tierInfo.features.length} features
                </p>
              </div>
              <div className="text-right flex items-center gap-3">
                <div className="text-2xl font-bold">{tierInfo.price}</div>
                {currentTier !== 'free' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDowngrade}
                    disabled={upgradingTier !== null}
                  >
                    {upgradingTier === 'free' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <ArrowDown className="h-4 w-4 mr-1" />
                        Reset to Free
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Tiers Grid */}
        <div className="space-y-6">
          {FEATURE_CATEGORIES.map((category) => {
            const CategoryIcon = category.icon;
            const isUnlocked = hasTier(category.tier);
            const isCurrentTier = currentTier === category.tier;
            const isUpgrading = upgradingTier === category.tier;

            return (
              <Card
                key={category.tier}
                className={`relative overflow-hidden transition-all ${
                  isUnlocked ? category.borderColor : 'border-muted'
                } ${isCurrentTier ? 'ring-2 ring-primary' : ''}`}
              >
                {isCurrentTier && (
                  <div className="absolute top-0 right-0">
                    <Badge className="rounded-none rounded-bl-lg">Current Plan</Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center`}>
                      <CategoryIcon className={`h-6 w-6 ${category.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{category.name}</CardTitle>
                        {isUnlocked ? (
                          <Badge variant="default" className="gap-1 bg-green-600">
                            <Check className="h-3 w-3" />
                            Unlocked
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <Lock className="h-3 w-3" />
                            Locked
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="mt-1">{category.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{category.price}</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {category.features.map((featureKey) => {
                      const feature = FEATURE_INFO[featureKey];
                      const enabled = hasFeature(featureKey);

                      return (
                        <div
                          key={featureKey}
                          className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                            enabled
                              ? 'bg-green-500/10 border border-green-500/20'
                              : 'bg-muted/50 border border-transparent'
                          }`}
                        >
                          {enabled ? (
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className={`font-medium text-sm ${enabled ? '' : 'text-muted-foreground'}`}>
                              {feature.name}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {feature.description}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {!isUnlocked && (
                    <div className="mt-4 pt-4 border-t">
                      <Button
                        className="w-full sm:w-auto"
                        size="lg"
                        onClick={() => handleUpgrade(category.tier, category.name)}
                        disabled={upgradingTier !== null}
                      >
                        {isUpgrading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Upgrading...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Upgrade to {category.name}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact Sales */}
        <Card className="bg-gradient-to-br from-muted/50 to-muted/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Need a Custom Solution?</h3>
                <p className="text-muted-foreground mt-1">
                  Contact us for custom pricing, volume discounts, or specific feature requirements
                </p>
              </div>
              <Button variant="outline" size="lg">
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Back to Dashboard */}
        <div className="text-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Features;
