import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Feature flag keys - maps to database columns
export type FeatureKey =
  // Tier 1: Voice Broadcast ($59/mo)
  | 'voice_broadcast'
  | 'ghl_contact_import'
  | 'ghl_basic_tagging'
  // Tier 2: Pipeline Automation ($149/mo)
  | 'pipeline_sync'
  | 'disposition_automation'
  | 'callback_scheduling'
  | 'workflow_triggers'
  // Tier 3: AI Dialing ($299/mo)
  | 'ai_dialing'
  | 'retell_integration'
  | 'transcript_analysis'
  | 'predictive_pacing'
  // Tier 4: Autonomous Mode ($499/mo)
  | 'autonomous_mode'
  | 'ai_pipeline_manager'
  | 'self_learning'
  | 'script_optimization'
  // Tier 5: Enterprise ($1000+/mo)
  | 'multi_carrier'
  | 'custom_dashboard'
  | 'white_label'
  | 'api_access';

export type TierName = 'free' | 'tier1' | 'tier2' | 'tier3' | 'tier4' | 'tier5' | 'enterprise';

export interface FeatureFlags {
  // Tier 1
  voice_broadcast: boolean;
  ghl_contact_import: boolean;
  ghl_basic_tagging: boolean;
  // Tier 2
  pipeline_sync: boolean;
  disposition_automation: boolean;
  callback_scheduling: boolean;
  workflow_triggers: boolean;
  // Tier 3
  ai_dialing: boolean;
  retell_integration: boolean;
  transcript_analysis: boolean;
  predictive_pacing: boolean;
  // Tier 4
  autonomous_mode: boolean;
  ai_pipeline_manager: boolean;
  self_learning: boolean;
  script_optimization: boolean;
  // Tier 5
  multi_carrier: boolean;
  custom_dashboard: boolean;
  white_label: boolean;
  api_access: boolean;
  // Meta
  current_tier: TierName;
  subscription_status: string;
  trial_ends_at: string | null;
}

// Tier metadata for UI
export const TIER_INFO: Record<TierName, {
  name: string;
  price: string;
  features: FeatureKey[];
}> = {
  free: {
    name: 'Free Trial',
    price: '$0',
    features: ['voice_broadcast', 'ghl_contact_import', 'ghl_basic_tagging'],
  },
  tier1: {
    name: 'Voice Broadcast',
    price: '$59/mo',
    features: ['voice_broadcast', 'ghl_contact_import', 'ghl_basic_tagging'],
  },
  tier2: {
    name: 'Pipeline Automation',
    price: '$149/mo',
    features: ['voice_broadcast', 'ghl_contact_import', 'ghl_basic_tagging', 'pipeline_sync', 'disposition_automation', 'callback_scheduling', 'workflow_triggers'],
  },
  tier3: {
    name: 'AI Dialing',
    price: '$299/mo',
    features: ['voice_broadcast', 'ghl_contact_import', 'ghl_basic_tagging', 'pipeline_sync', 'disposition_automation', 'callback_scheduling', 'workflow_triggers', 'ai_dialing', 'retell_integration', 'transcript_analysis', 'predictive_pacing'],
  },
  tier4: {
    name: 'Autonomous Mode',
    price: '$499/mo',
    features: ['voice_broadcast', 'ghl_contact_import', 'ghl_basic_tagging', 'pipeline_sync', 'disposition_automation', 'callback_scheduling', 'workflow_triggers', 'ai_dialing', 'retell_integration', 'transcript_analysis', 'predictive_pacing', 'autonomous_mode', 'ai_pipeline_manager', 'self_learning', 'script_optimization'],
  },
  tier5: {
    name: 'Enterprise',
    price: '$1,000+/mo',
    features: ['voice_broadcast', 'ghl_contact_import', 'ghl_basic_tagging', 'pipeline_sync', 'disposition_automation', 'callback_scheduling', 'workflow_triggers', 'ai_dialing', 'retell_integration', 'transcript_analysis', 'predictive_pacing', 'autonomous_mode', 'ai_pipeline_manager', 'self_learning', 'script_optimization', 'multi_carrier', 'custom_dashboard', 'api_access'],
  },
  enterprise: {
    name: 'Enterprise Custom',
    price: 'Custom',
    features: ['voice_broadcast', 'ghl_contact_import', 'ghl_basic_tagging', 'pipeline_sync', 'disposition_automation', 'callback_scheduling', 'workflow_triggers', 'ai_dialing', 'retell_integration', 'transcript_analysis', 'predictive_pacing', 'autonomous_mode', 'ai_pipeline_manager', 'self_learning', 'script_optimization', 'multi_carrier', 'custom_dashboard', 'white_label', 'api_access'],
  },
};

// Feature metadata for UI
export const FEATURE_INFO: Record<FeatureKey, {
  name: string;
  description: string;
  tier: TierName;
}> = {
  // Tier 1
  voice_broadcast: { name: 'Voice Broadcast', description: 'Send automated voice broadcasts via Twilio', tier: 'tier1' },
  ghl_contact_import: { name: 'GHL Contact Import', description: 'Import contacts from Go High Level', tier: 'tier1' },
  ghl_basic_tagging: { name: 'Basic GHL Tagging', description: 'Add tags to contacts after calls', tier: 'tier1' },
  // Tier 2
  pipeline_sync: { name: 'Pipeline Sync', description: 'Auto-update GHL pipeline stages', tier: 'tier2' },
  disposition_automation: { name: 'Disposition Automation', description: 'Auto-actions based on call outcomes', tier: 'tier2' },
  callback_scheduling: { name: 'Callback Scheduling', description: 'Schedule callbacks synced to GHL calendar', tier: 'tier2' },
  workflow_triggers: { name: 'Workflow Triggers', description: 'Trigger GHL workflows from call events', tier: 'tier2' },
  // Tier 3
  ai_dialing: { name: 'AI Dialing', description: 'AI-powered conversations with Retell', tier: 'tier3' },
  retell_integration: { name: 'Retell Integration', description: 'Connect your Retell AI agents', tier: 'tier3' },
  transcript_analysis: { name: 'Transcript Analysis', description: 'AI analysis of call transcripts', tier: 'tier3' },
  predictive_pacing: { name: 'Predictive Pacing', description: 'Smart call pacing based on agent availability', tier: 'tier3' },
  // Tier 4
  autonomous_mode: { name: 'Autonomous Mode', description: 'Full autonomous agent operation', tier: 'tier4' },
  ai_pipeline_manager: { name: 'AI Pipeline Manager', description: 'AI manages your entire pipeline', tier: 'tier4' },
  self_learning: { name: 'Self Learning', description: 'System learns from outcomes', tier: 'tier4' },
  script_optimization: { name: 'Script Optimization', description: 'AI optimizes your call scripts', tier: 'tier4' },
  // Tier 5
  multi_carrier: { name: 'Multi-Carrier', description: 'Route calls across Twilio, Telnyx, Bandwidth', tier: 'tier5' },
  custom_dashboard: { name: 'Custom Dashboard', description: 'Build custom analytics dashboards', tier: 'tier5' },
  white_label: { name: 'White Label', description: 'Remove branding, use your own', tier: 'enterprise' },
  api_access: { name: 'API Access', description: 'Full API access for custom integrations', tier: 'tier5' },
};

// Default flags for unauthenticated or new users
const DEFAULT_FLAGS: FeatureFlags = {
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
  current_tier: 'free',
  subscription_status: 'inactive',
  trial_ends_at: null,
};

export const useFeatureFlags = () => {
  const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FLAGS);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load feature flags from database
  const loadFlags = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setFlags(DEFAULT_FLAGS);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_feature_flags')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // If no flags exist, create them
        if (error.code === 'PGRST116') {
          const { data: newFlags, error: insertError } = await supabase
            .from('user_feature_flags')
            .insert({ user_id: user.id })
            .select()
            .single();

          if (insertError) {
            console.error('Failed to create feature flags:', insertError);
            setFlags(DEFAULT_FLAGS);
          } else if (newFlags) {
            setFlags(newFlags as unknown as FeatureFlags);
          }
        } else {
          console.error('Failed to load feature flags:', error);
          setFlags(DEFAULT_FLAGS);
        }
      } else if (data) {
        setFlags(data as unknown as FeatureFlags);
      }
    } catch (error) {
      console.error('Error loading feature flags:', error);
      setFlags(DEFAULT_FLAGS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if a specific feature is enabled
  const hasFeature = useCallback((feature: FeatureKey): boolean => {
    return flags[feature] === true;
  }, [flags]);

  // Check if user has a minimum tier
  const hasTier = useCallback((minTier: TierName): boolean => {
    const tierOrder: TierName[] = ['free', 'tier1', 'tier2', 'tier3', 'tier4', 'tier5', 'enterprise'];
    const currentIndex = tierOrder.indexOf(flags.current_tier);
    const requiredIndex = tierOrder.indexOf(minTier);
    return currentIndex >= requiredIndex;
  }, [flags]);

  // Get the tier required for a feature
  const getTierForFeature = useCallback((feature: FeatureKey): TierName => {
    return FEATURE_INFO[feature]?.tier || 'tier1';
  }, []);

  // Get upgrade info for a locked feature
  const getUpgradeInfo = useCallback((feature: FeatureKey) => {
    const requiredTier = getTierForFeature(feature);
    const tierInfo = TIER_INFO[requiredTier];
    return {
      feature: FEATURE_INFO[feature],
      requiredTier,
      tierName: tierInfo.name,
      tierPrice: tierInfo.price,
    };
  }, [getTierForFeature]);

  // Load flags on mount and auth changes
  useEffect(() => {
    loadFlags();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadFlags();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadFlags]);

  // Subscribe to real-time updates (for when Stripe webhook updates flags)
  useEffect(() => {
    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('feature_flags_changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'user_feature_flags',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setFlags(payload.new as unknown as FeatureFlags);
            toast({
              title: 'Subscription Updated',
              description: 'Your features have been updated!',
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupSubscription();
  }, [toast]);

  return {
    flags,
    isLoading,
    hasFeature,
    hasTier,
    getTierForFeature,
    getUpgradeInfo,
    currentTier: flags.current_tier,
    tierInfo: TIER_INFO[flags.current_tier],
    isSubscribed: flags.subscription_status === 'active',
    refresh: loadFlags,
  };
};

export default useFeatureFlags;
