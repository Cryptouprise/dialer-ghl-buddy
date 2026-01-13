import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone,
  Target,
  BarChart3,
  RotateCw,
  Shield,
  MessageSquare,
  Workflow,
  Upload,
  Zap,
  Clock,
  Settings,
  Brain,
  Calendar,
  Bot,
  Sparkles,
  TrendingUp,
  FileText,
  Activity,
  Beaker,
  LayoutDashboard,
  ChevronDown,
  PanelLeftClose,
  Radio,
  Rocket,
  AlertCircle,
  DollarSign,
  Users,
  Lock,
  Crown,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { useFeatureFlags, FeatureKey } from '@/hooks/useFeatureFlags';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  title: string;
  value: string;
  icon: React.ElementType;
  requiredFeature?: FeatureKey;
  alwaysShow?: boolean;
  route?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

const navigationGroups: NavGroup[] = [
  {
    label: 'Overview',
    defaultOpen: true,
    items: [
      { title: 'Dashboard', value: 'overview', icon: LayoutDashboard, alwaysShow: true },
      { title: 'Setup Wizard', value: 'onboarding', icon: Rocket, alwaysShow: true },
    ],
  },
  {
    label: 'Calling',
    defaultOpen: true,
    items: [
      { title: 'Voice Broadcast', value: 'broadcast', icon: Radio, requiredFeature: 'voice_broadcast' },
      { title: 'SMS Messaging', value: 'sms', icon: MessageSquare, requiredFeature: 'voice_broadcast' },
      { title: 'AI Campaigns', value: 'predictive', icon: Target, requiredFeature: 'predictive_pacing' },
      { title: 'Retell AI', value: 'retell', icon: Bot, requiredFeature: 'retell_integration' },
      { title: 'Number Rotation', value: 'rotation', icon: RotateCw, requiredFeature: 'pipeline_sync' },
      { title: 'Spam Detection', value: 'spam', icon: Shield, requiredFeature: 'pipeline_sync' },
    ],
  },
  {
    label: 'Leads & Pipeline',
    defaultOpen: false,
    items: [
      { title: 'Leads', value: 'leads', icon: Users, alwaysShow: true },
      { title: 'Lead Upload', value: 'lead-upload', icon: Upload, alwaysShow: true },
      { title: 'Pipeline', value: 'pipeline', icon: Workflow, requiredFeature: 'pipeline_sync' },
      { title: 'Appointments', value: 'calendar', icon: Calendar, requiredFeature: 'callback_scheduling' },
      { title: 'Dispositions', value: 'dispositions', icon: Zap, requiredFeature: 'disposition_automation' },
      { title: 'Follow-ups', value: 'follow-ups', icon: Clock, requiredFeature: 'callback_scheduling' },
    ],
  },
  {
    label: 'AI & Automation',
    defaultOpen: false,
    items: [
      { title: 'Workflows', value: 'workflows', icon: Workflow, requiredFeature: 'workflow_triggers' },
      { title: 'AI Engine', value: 'ai-engine', icon: Brain, requiredFeature: 'ai_dialing' },
      { title: 'AI Workflows', value: 'ai-workflows', icon: Sparkles, requiredFeature: 'ai_dialing' },
      { title: 'Automation', value: 'automation', icon: Zap, requiredFeature: 'workflow_triggers' },
      { title: 'AI Manager', value: 'ai-manager', icon: Brain, requiredFeature: 'ai_pipeline_manager' },
      { title: 'Autonomous Agent', value: 'autonomous-agent', icon: Brain, requiredFeature: 'autonomous_mode' },
      { title: 'Agent Activity', value: 'agent-activity', icon: Bot, requiredFeature: 'ai_dialing' },
      { title: 'Reachability', value: 'reachability', icon: TrendingUp, requiredFeature: 'transcript_analysis' },
      { title: 'AI Error Handler', value: 'ai-errors', icon: AlertCircle, requiredFeature: 'ai_dialing' },
    ],
  },
  {
    label: 'Reports',
    defaultOpen: false,
    items: [
      { title: 'Campaign Results', value: 'campaign-results', icon: BarChart3, alwaysShow: true },
      { title: 'Call Analytics', value: 'analytics', icon: BarChart3, alwaysShow: true },
      { title: 'Daily Reports', value: 'reports', icon: FileText, alwaysShow: true },
      { title: 'Live Monitor', value: 'live-monitor', icon: Activity, requiredFeature: 'pipeline_sync' },
      { title: 'A/B Testing', value: 'ab-testing', icon: Beaker, requiredFeature: 'ai_dialing' },
      { title: 'Budget Manager', value: 'budget', icon: DollarSign, alwaysShow: true },
    ],
  },
  {
    label: 'Settings',
    defaultOpen: false,
    items: [
      { title: 'Settings', value: 'settings', icon: Settings, alwaysShow: true, route: '/settings' },
      { title: 'System Testing', value: 'system-testing', icon: Beaker, alwaysShow: true, route: '/system-testing' },
    ],
  },
];

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardSidebar = ({ activeTab, onTabChange }: DashboardSidebarProps) => {
  const { toggleSidebar } = useSidebar();
  const { hasFeature, tierInfo, currentTier } = useFeatureFlags();
  const navigate = useNavigate();

  const getFilteredNavigation = (): NavGroup[] => {
    return navigationGroups
      .map(group => ({
        ...group,
        items: group.items.filter(item => {
          if (item.alwaysShow) return true;
          if (item.requiredFeature) return hasFeature(item.requiredFeature);
          return true;
        }),
      }))
      .filter(group => group.items.length > 0);
  };

  const filteredNavigation = getFilteredNavigation();

  const handleNavigate = (route: string) => {
    navigate(route);
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  const handleItemClick = (item: NavItem) => {
    if (item.route) {
      handleNavigate(item.route);
    } else {
      onTabChange(item.value);
      if (window.innerWidth < 768) {
        toggleSidebar();
      }
    }
  };

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Phone className="h-5 w-5 text-primary shrink-0" />
            <span className="font-semibold text-sm truncate">GHL Buddy</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 shrink-0"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-2 px-1">
          <Badge
            variant={currentTier === 'free' ? 'secondary' : 'default'}
            className="w-full justify-center gap-1 py-1"
          >
            <Crown className="h-3 w-3" />
            {tierInfo.name}
          </Badge>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {filteredNavigation.map((group) => (
          <NavGroupCollapsible
            key={group.label}
            group={group}
            activeTab={activeTab}
            onItemClick={handleItemClick}
          />
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 justify-center"
          onClick={() => handleNavigate('/features')}
        >
          <Lock className="h-4 w-4" />
          Explore Features
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Unlock more with upgrades
        </p>
      </SidebarFooter>
    </Sidebar>
  );
};

interface NavGroupCollapsibleProps {
  group: NavGroup;
  activeTab: string;
  onItemClick: (item: NavItem) => void;
}

const NavGroupCollapsible = ({
  group,
  activeTab,
  onItemClick,
}: NavGroupCollapsibleProps) => {
  const hasActiveItem = group.items.some((item) => item.value === activeTab);
  const [isOpen, setIsOpen] = React.useState(group.defaultOpen || hasActiveItem);

  React.useEffect(() => {
    if (hasActiveItem) setIsOpen(true);
  }, [hasActiveItem]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
      <SidebarGroup className="py-1">
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent rounded-md px-2 py-1.5 flex items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {group.label}
            <ChevronDown
              className={cn(
                'h-3 w-3 transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    onClick={() => onItemClick(item)}
                    isActive={activeTab === item.value}
                    className={cn(
                      'touch-manipulation',
                      activeTab === item.value && 'bg-primary/10 text-primary font-medium'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
};

export default DashboardSidebar;
