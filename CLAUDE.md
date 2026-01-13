# CLAUDE.md - Dialer GHL Buddy

This file provides persistent context for Claude Code when working with the dialer-ghl-buddy codebase.

## Project Overview

**Dialer GHL Buddy** is an AI-powered dialer and automation engine designed specifically for Go High Level (GHL) users. It's a modular, white-label-ready system that can be:
1. Embedded in GHL as an iframe
2. Published to the GHL Marketplace as a native app
3. Used standalone with GHL API integration

**Origin**: Cloned from dial-smart-system (144K+ lines of production code)

## Value Proposition

GHL users who use voice AI (Retell, Assistable, etc.) still need to:
- Parse transcripts into actions
- Move pipeline stages automatically
- Schedule callbacks
- Add tags based on outcomes
- Run follow-up sequences
- Manage disposition automation

**This system does ALL of that automatically.**

## Feature Tiers (Toggle System)

| Tier | Price | Features |
|------|-------|----------|
| **Voice Broadcast** | $59/mo | Twilio broadcasts, GHL contact import, basic tagging |
| **Pipeline Automation** | $149/mo | + Auto-disposition, pipeline stage sync, callbacks |
| **AI Dialing** | $299/mo | + Retell AI integration, transcript analysis, predictive pacing |
| **Autonomous Mode** | $499/mo | + AI Pipeline Manager, self-learning, full autonomy |
| **Enterprise** | $1,000+/mo | + Multi-carrier, custom dashboard, 500K calls/day |

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind + shadcn/ui
- **Backend**: Supabase (PostgreSQL + 63 Edge Functions)
- **Voice**: Retell AI, Twilio, Telnyx
- **CRM**: Go High Level (primary), Airtable, n8n

## Key Components

### GHL Integration (COMPLETE)
- `src/hooks/useGoHighLevel.ts` - 830 lines, full GHL API wrapper
- `src/components/GoHighLevelManager.tsx` - 958 lines, full UI
- `src/components/GHLFieldMappingTab.tsx` - Field mapping UI
- `supabase/functions/ghl-integration/` - Backend edge function

**GHL Capabilities:**
- OAuth / API key authentication
- Contact sync (import/export/bidirectional)
- Tag management and filtering
- Pipeline stage sync
- Custom field mapping
- Calendar integration
- Post-call contact updates
- Opportunity creation

### Voice Broadcast (COMPLETE)
- `src/components/VoiceBroadcastManager.tsx` - 2,689 lines
- `supabase/functions/voice-broadcast-engine/` - 1,582 lines

### AI/Automation (COMPLETE)
- `supabase/functions/ai-brain/` - 4,400 lines
- `supabase/functions/disposition-router/` - Auto-actions
- `supabase/functions/workflow-executor/` - Multi-step sequences
- `supabase/functions/outbound-calling/` - Retell AI calls

## Quick Start

```bash
npm install
npm run dev     # Starts on port 8080
npm run build   # Production build
```

## Environment Variables

```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
```

## GHL Integration Points

### What Users Configure
1. GHL API Key (from GHL Settings > API Keys)
2. Location ID (sub-account ID)
3. Optional: Webhook signing key

### What Happens Automatically
- Contacts imported from GHL with tag filtering
- Call outcomes sync back to GHL as tags
- Pipeline stages update based on disposition
- Callbacks scheduled in GHL calendar
- Custom fields updated with call data

## For GHL Marketplace

### OAuth Flow (To Build)
Currently uses API key auth. For marketplace:
1. Register app at marketplace.gohighlevel.com
2. Implement OAuth 2.0 flow
3. Store tokens in `user_credentials` table
4. Refresh tokens automatically

### Iframe Embedding
Can be embedded immediately:
```html
<iframe src="https://your-domain.com/ghl-embed" />
```

### Webhook Endpoints
- `POST /functions/v1/ghl-integration` - Main GHL sync
- `POST /functions/v1/call-tracking-webhook` - Call status updates
- `POST /functions/v1/disposition-router` - Post-call actions

## Database Tables (Key)

**GHL-Specific:**
- `user_credentials` - Stores GHL API keys (encrypted)
- `ghl_sync_settings` - Field mappings, tag rules, sync preferences

**Core:**
- `leads` - Synced from GHL contacts
- `call_logs` - Call history
- `phone_numbers` - Number pool management
- `voice_broadcasts` - Broadcast campaigns

## Development Notes

### Toggle System Implementation
Feature toggles stored in database:
- `user_feature_flags` table (to create)
- Check flags in components to show/hide features
- Stripe subscription updates toggle states

### GHL-First UI Changes Needed
1. Simplify navigation for GHL users
2. Hide standalone features behind toggles
3. Add "Connect to GHL" as primary onboarding step
4. GHL-branded color scheme option

## Testing with Moses (VICIdial User)

Key pain points to address:
1. Simple voice broadcast setup
2. Automatic GHL pipeline updates after calls
3. Callback scheduling that syncs to GHL
4. No need for n8n/Make/Zapier workarounds

## Files to Potentially Simplify

For GHL-focused version, these could be hidden/removed:
- Standalone campaign management (use GHL campaigns)
- Complex analytics (use GHL reporting)
- Multi-org features (single GHL location focus)

Keep as toggleable premium features:
- Predictive dialing
- AI autonomous mode
- Multi-carrier routing

---

**Created**: January 13, 2026
**Parent Project**: dial-smart-system
**Purpose**: GHL Marketplace app + white-label automation engine
