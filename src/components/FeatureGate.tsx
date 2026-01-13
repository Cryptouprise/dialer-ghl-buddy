import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Sparkles, ArrowRight, Crown, Zap, Rocket } from 'lucide-react';
import { useFeatureFlags, FeatureKey, TierName, TIER_INFO, FEATURE_INFO } from '@/hooks/useFeatureFlags';

interface FeatureGateProps {
  /** The feature key to check */
  feature: FeatureKey;
  /** Content to render if feature is enabled */
  children: React.ReactNode;
  /** Optional custom fallback (default shows upgrade prompt) */
  fallback?: React.ReactNode;
  /** Show a subtle locked badge instead of full upgrade prompt */
  mode?: 'block' | 'badge' | 'hide';
  /** Custom upgrade URL (default uses internal upgrade page) */
  upgradeUrl?: string;
}

// Tier icons
const TIER_ICONS: Record<TierName, React.ElementType> = {
  free: Sparkles,
  tier1: Zap,
  tier2: Zap,
  tier3: Rocket,
  tier4: Crown,
  tier5: Crown,
  enterprise: Crown,
};

/**
 * FeatureGate - Wraps content that requires a specific feature/tier
 *
 * Usage:
 * <FeatureGate feature="ai_dialing">
 *   <RetellAIManager />
 * </FeatureGate>
 */
export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  children,
  fallback,
  mode = 'block',
  upgradeUrl = '/settings?tab=subscription',
}) => {
  const { hasFeature, getUpgradeInfo, isLoading } = useFeatureFlags();

  // Show loading state
  if (isLoading) {
    return (
      <div className="animate-pulse bg-muted rounded-lg h-32 flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Loading...</span>
      </div>
    );
  }

  // Feature is enabled - render children
  if (hasFeature(feature)) {
    return <>{children}</>;
  }

  // Feature is locked - show appropriate fallback
  const upgradeInfo = getUpgradeInfo(feature);
  const TierIcon = TIER_ICONS[upgradeInfo.requiredTier];

  // Custom fallback provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Hide mode - render nothing
  if (mode === 'hide') {
    return null;
  }

  // Badge mode - show subtle locked indicator
  if (mode === 'badge') {
    return (
      <div className="relative">
        <div className="opacity-50 pointer-events-none blur-[1px]">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <Badge variant="outline" className="gap-1">
            <Lock className="h-3 w-3" />
            {upgradeInfo.tierName}
          </Badge>
        </div>
      </div>
    );
  }

  // Block mode - full upgrade prompt (default)
  return (
    <Card className="border-2 border-dashed border-muted-foreground/30 bg-muted/30">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          <TierIcon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-lg flex items-center justify-center gap-2">
          <Lock className="h-4 w-4" />
          {upgradeInfo.feature.name}
        </CardTitle>
        <CardDescription>
          {upgradeInfo.feature.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="text-sm">
            Requires {upgradeInfo.tierName}
          </Badge>
          <Badge variant="outline" className="text-sm font-bold">
            {upgradeInfo.tierPrice}
          </Badge>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <a href={upgradeUrl}>
            Upgrade Now
            <ArrowRight className="h-4 w-4 ml-2" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

/**
 * FeatureFlag - Simple conditional render based on feature
 *
 * Usage:
 * <FeatureFlag feature="ai_dialing">
 *   <MenuItem>AI Dialing</MenuItem>
 * </FeatureFlag>
 */
export const FeatureFlag: React.FC<{
  feature: FeatureKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ feature, children, fallback = null }) => {
  const { hasFeature, isLoading } = useFeatureFlags();

  if (isLoading) return null;
  if (hasFeature(feature)) return <>{children}</>;
  return <>{fallback}</>;
};

/**
 * TierBadge - Shows the user's current tier
 */
export const TierBadge: React.FC<{ className?: string }> = ({ className }) => {
  const { currentTier, tierInfo } = useFeatureFlags();
  const TierIcon = TIER_ICONS[currentTier];

  return (
    <Badge
      variant={currentTier === 'free' ? 'secondary' : 'default'}
      className={className}
    >
      <TierIcon className="h-3 w-3 mr-1" />
      {tierInfo.name}
    </Badge>
  );
};

/**
 * UpgradePrompt - Standalone upgrade prompt component
 */
export const UpgradePrompt: React.FC<{
  targetTier: TierName;
  title?: string;
  description?: string;
  className?: string;
}> = ({
  targetTier,
  title,
  description,
  className
}) => {
  const tierInfo = TIER_INFO[targetTier];
  const TierIcon = TIER_ICONS[targetTier];

  return (
    <Card className={`border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 ${className}`}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <TierIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <h4 className="font-semibold">
              {title || `Upgrade to ${tierInfo.name}`}
            </h4>
            <p className="text-sm text-muted-foreground">
              {description || `Unlock powerful features starting at ${tierInfo.price}`}
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              {tierInfo.features.slice(0, 4).map((f) => (
                <Badge key={f} variant="outline" className="text-xs">
                  {FEATURE_INFO[f].name}
                </Badge>
              ))}
              {tierInfo.features.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{tierInfo.features.length - 4} more
                </Badge>
              )}
            </div>
          </div>
          <Button size="sm" asChild>
            <a href="/settings?tab=subscription">
              Upgrade
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureGate;
