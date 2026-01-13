import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Check,
  X,
  Crown,
  Zap,
  Rocket,
  Lock,
  ArrowRight,
  Sparkles,
  Phone,
  Users,
  GitBranch,
  Bot,
  Brain,
  Building2
} from 'lucide-react';
import {
  useFeatureFlags,
  FeatureKey,
  TierName,
  TIER_INFO,
  FEATURE_INFO
} from '@/hooks/useFeatureFlags';

// Feature category groupings
const FEATURE_CATEGORIES = [
  {
    name: 'Voice Broadcast',
    tier: 'tier1' as TierName,
    icon: Phone,
    features: ['voice_broadcast', 'ghl_contact_import', 'ghl_basic_tagging'] as FeatureKey[],
  },
  {
    name: 'Pipeline Automation',
    tier: 'tier2' as TierName,
    icon: GitBranch,
    features: ['pipeline_sync', 'disposition_automation', 'callback_scheduling', 'workflow_triggers'] as FeatureKey[],
  },
  {
    name: 'AI Dialing',
    tier: 'tier3' as TierName,
    icon: Bot,
    features: ['ai_dialing', 'retell_integration', 'transcript_analysis', 'predictive_pacing'] as FeatureKey[],
  },
  {
    name: 'Autonomous Mode',
    tier: 'tier4' as TierName,
    icon: Brain,
    features: ['autonomous_mode', 'ai_pipeline_manager', 'self_learning', 'script_optimization'] as FeatureKey[],
  },
  {
    name: 'Enterprise',
    tier: 'tier5' as TierName,
    icon: Building2,
    features: ['multi_carrier', 'custom_dashboard', 'white_label', 'api_access'] as FeatureKey[],
  },
];

// Pricing cards data
const PRICING_TIERS = [
  {
    tier: 'tier1' as TierName,
    name: 'Voice Broadcast',
    price: '$59',
    period: '/month',
    description: 'Perfect for getting started with voice broadcasts',
    cta: 'Start Broadcasting',
    popular: false,
  },
  {
    tier: 'tier2' as TierName,
    name: 'Pipeline Automation',
    price: '$149',
    period: '/month',
    description: 'Automate your GHL pipelines with call outcomes',
    cta: 'Automate Pipelines',
    popular: true,
  },
  {
    tier: 'tier3' as TierName,
    name: 'AI Dialing',
    price: '$299',
    period: '/month',
    description: 'AI-powered calls with Retell integration',
    cta: 'Enable AI',
    popular: false,
  },
  {
    tier: 'tier4' as TierName,
    name: 'Autonomous Mode',
    price: '$499',
    period: '/month',
    description: 'Full autonomous agent operation',
    cta: 'Go Autonomous',
    popular: false,
  },
  {
    tier: 'tier5' as TierName,
    name: 'Enterprise',
    price: '$1,000+',
    period: '/month',
    description: 'Multi-carrier, white-label, unlimited scale',
    cta: 'Contact Sales',
    popular: false,
  },
];

export const SubscriptionManager: React.FC = () => {
  const { flags, currentTier, tierInfo, hasFeature, hasTier, isLoading } = useFeatureFlags();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-muted h-32 rounded-lg" />
        <div className="animate-pulse bg-muted h-64 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Current Plan Summary */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Current Plan: {tierInfo.name}
              </CardTitle>
              <CardDescription>
                {flags.subscription_status === 'active' ? (
                  <span className="text-green-600">Active subscription</span>
                ) : flags.subscription_status === 'trialing' ? (
                  <span className="text-blue-600">Trial period</span>
                ) : (
                  <span className="text-muted-foreground">No active subscription</span>
                )}
              </CardDescription>
            </div>
            <Badge variant={currentTier === 'free' ? 'secondary' : 'default'} className="text-lg px-4 py-1">
              {tierInfo.price}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tierInfo.features.map((feature) => (
              <Badge key={feature} variant="outline" className="gap-1">
                <Check className="h-3 w-3 text-green-500" />
                {FEATURE_INFO[feature].name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Status by Category */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Feature Access</h3>
        <div className="grid gap-4">
          {FEATURE_CATEGORIES.map((category) => {
            const CategoryIcon = category.icon;
            const tierUnlocked = hasTier(category.tier);
            const categoryTierInfo = TIER_INFO[category.tier];

            return (
              <Card key={category.name} className={!tierUnlocked ? 'opacity-60' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CategoryIcon className="h-4 w-4" />
                      {category.name}
                    </CardTitle>
                    {tierUnlocked ? (
                      <Badge variant="default" className="gap-1">
                        <Check className="h-3 w-3" />
                        Unlocked
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <Lock className="h-3 w-3" />
                        {categoryTierInfo.name} - {categoryTierInfo.price}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {category.features.map((feature) => {
                      const enabled = hasFeature(feature);
                      const featureInfo = FEATURE_INFO[feature];

                      return (
                        <div
                          key={feature}
                          className={`flex items-center gap-2 p-2 rounded-lg ${
                            enabled ? 'bg-green-500/10' : 'bg-muted'
                          }`}
                        >
                          {enabled ? (
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className={`text-sm ${enabled ? '' : 'text-muted-foreground'}`}>
                            {featureInfo.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Pricing Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Upgrade Your Plan</h3>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
          {PRICING_TIERS.map((tier) => {
            const isCurrentTier = currentTier === tier.tier;
            const isLowerTier = hasTier(tier.tier) && !isCurrentTier;

            return (
              <Card
                key={tier.tier}
                className={`relative ${
                  tier.popular ? 'border-primary shadow-lg' : ''
                } ${isCurrentTier ? 'ring-2 ring-primary' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-base">{tier.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground text-sm">{tier.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                  <Button
                    className="w-full"
                    variant={isCurrentTier ? 'outline' : tier.popular ? 'default' : 'secondary'}
                    disabled={isCurrentTier || isLowerTier}
                  >
                    {isCurrentTier ? (
                      'Current Plan'
                    ) : isLowerTier ? (
                      'Included'
                    ) : (
                      <>
                        {tier.cta}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            View Invoice History
          </Button>
          <Button variant="outline" size="sm">
            Update Payment Method
          </Button>
          <Button variant="outline" size="sm">
            Cancel Subscription
          </Button>
          <Button variant="outline" size="sm">
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManager;
