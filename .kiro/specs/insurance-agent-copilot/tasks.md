# Implementation Plan

## Overview
This implementation plan breaks down the Insurance Agent AI Copilot into discrete, manageable coding tasks. Each task builds incrementally on previous work, starting with project setup, then core UI components, followed by AI integration, and finally AutoPilot features.

## Tasks

- [x] 1. Project setup and configuration
  - Initialize React + TypeScript project with Vite
  - Configure Tailwind CSS with custom design tokens (colors, typography, shadows, border radius)
  - Set up project structure: `/src/components`, `/src/pages`, `/src/services`, `/src/data/mock`, `/src/hooks`, `/src/types`
  - Install dependencies: React Router, React Query, Framer Motion, Axios
  - Create environment variables file for Gemini API key
  - Configure PWA manifest and service worker for mobile installation
  - _Requirements: 1.1, 19.1, 19.2, 19.3, 19.4, 19.5_

- [x] 2. Create mock data layer
  - [x] 2.1 Create mock data JSON files
    - Create `/src/data/mock/users.json` with 4 user records
    - Create `/src/data/mock/leads.json` with 4 lead records (hot, warm, cold temperatures)
    - Create `/src/data/mock/interactions.json` with 4 interaction records
    - Create `/src/data/mock/templates.json` with 4 template records
    - Create `/src/data/mock/auditLog.json` with 4 audit entries
    - _Requirements: All requirements depend on data_

  - [x] 2.2 Create TypeScript interfaces for data models
    - Define interfaces in `/src/types/models.ts`: User, Lead, Interaction, Template, AuditLog, NextBestAction, PredictedObjection, QueuedAction
    - Export all interfaces for use across the application
    - _Requirements: All requirements depend on type safety_

- [x] 3. Build global layout and navigation
  - [x] 3.1 Create NavigationRail component
    - Build icon-only vertical navigation with Home, Leads, Tasks, Calls, Maps, Notifications, Settings
    - Implement active route highlighting
    - Add notification badge counter
    - Apply hover animations (4px lift, 200ms duration)
    - _Requirements: 2.1, 20.1_

  - [x] 3.2 Create CommandBar component
    - Build centered search bar with rounded border and glow-on-focus animation
    - Implement placeholder "Ask anything…"
    - Add keyboard shortcut (Cmd/Ctrl + K) to focus
    - Style with soft glow animation on focus (200ms duration)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 20.2_

  - [x] 3.3 Create AppLayout component
    - Combine NavigationRail, CommandBar, and main content area
    - Add SmartContextPanel slot on the right (dynamic)
    - Implement mobile-first responsive design with collapsible navigation
    - Apply page transition animations (fade + upward spring, 260ms)
    - _Requirements: 2.1, 19.1, 20.3_

- [x] 4. Implement voice assistant UI
  - [x] 4.1 Create VoiceAssistant floating button component
    - Build circular floating button (bottom-right position)
    - Implement pulsing glow animation when listening
    - Add microphone icon with Feather-style design
    - Position fixed for mobile accessibility
    - _Requirements: 1.1, 1.5, 19.5, 20.4_

  - [x] 4.2 Implement microphone permission handling
    - Create custom hook `useVoicePermission` to check and request microphone access
    - Display permission request dialog on first use
    - Handle permission denied state with helpful message
    - Store permission status in local state
    - _Requirements: 1.1_

  - [x] 4.3 Integrate Web Speech API for voice input
    - Create custom hook `useVoiceRecognition` with Web Speech API
    - Implement real-time transcript capture
    - Support language detection (en, hi, mr, ta)
    - Handle speech recognition errors gracefully
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 4.4 Create VoiceOverlay component
    - Build expandable overlay that shows when voice is active
    - Display real-time transcript with auto-scroll
    - Show suggested action chips below transcript
    - Add close/stop button
    - Apply smooth pop-open animation
    - _Requirements: 1.4, 20.4_

- [x] 5. Build dashboard page components
  - [x] 5.1 Create TodaysBriefingCard component
    - Display "Today's Summary" header
    - Render bullet-point list of urgent items
    - Highlight high-priority items with color coding
    - Add loading skeleton state
    - _Requirements: 3.1, 3.2_

  - [x] 5.2 Create WorkZoneCard component
    - Build horizontal swipeable card with snap scroll
    - Display zone title, lead count, and summary
    - Show 3-4 lead previews with avatars and names
    - Add "View All" action button
    - Implement snap scroll animation
    - _Requirements: 3.2, 3.3, 20.1_

  - [x] 5.3 Create HomePage component
    - Compose TodaysBriefingCard and horizontal WorkZone carousel
    - Add AutoPilot toggle button at bottom
    - Add Quick Create Lead floating action button
    - Fetch mock data and display loading states
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 6. Build lead management components
  - [x] 6.1 Create LeadCard component
    - Display lead avatar, name, age, tags
    - Show last interaction snapshot
    - Add temperature indicator (color-coded: hot=red, warm=orange, cold=blue)
    - Implement 4px lift on hover animation
    - _Requirements: 4.1, 20.1_

  - [x] 6.2 Create LeadListPage component
    - Display vertical list of LeadCard components
    - Add filter chips: Hot, Follow-up, Renewals, High-Value
    - Implement search bar (optional)
    - Load leads from mock data
    - Handle empty state
    - _Requirements: 4.1_

  - [x] 6.3 Create SentimentGraph component
    - Build line graph with 4-6 data points using Chart.js or Recharts
    - Color graph in Info Blue (#2196F3)
    - Add hover tooltips showing sentiment score and date
    - Animate graph on mount
    - _Requirements: 4.3_

  - [x] 6.4 Create ConversionGauge component
    - Build semi-circular radial gauge using SVG
    - Display conversion probability percentage
    - Show confidence score below gauge
    - Animate gauge fill on mount
    - _Requirements: 4.4_

  - [x] 6.5 Create LeadProfile page
    - Build split layout: primary info on left, context panel on right
    - Display header with name, age, location, tags
    - Add quick action buttons: Call, WhatsApp, Message
    - Show Last Interaction Summary section
    - Embed SentimentGraph and ConversionGauge
    - Display chronological timeline of interactions
    - Make responsive for mobile (stack vertically)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 7. Build Smart Context Panel components
  - [x] 7.1 Create NextBestActionCard component
    - Display AI-generated action with clear header
    - Show numbered list of action steps
    - Add color-coded difficulty indicator (easy=green, medium=yellow, hard=red)
    - Display reasoning/explanation section
    - Show confidence score badge
    - Add "Execute Action" button
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 7.2 Create ObjectionPredictorPanel component
    - Display list of 3-5 predicted objections
    - Make each objection tappable to expand
    - Show IRDAI-safe response script on tap
    - Display probability percentage for each objection
    - Highlight source signals used for prediction
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 7.3 Create TemplatesPanel component
    - Add search bar to filter templates
    - Display list of WhatsApp-safe templates by category
    - Show template preview with dynamic field placeholders
    - Implement template selection and auto-fill
    - Display data source for each dynamic value
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 7.4 Create ComplianceFlagBadge component
    - Display small warning icon when violations detected
    - Show tooltip on hover with rule explanation
    - List flagged phrases
    - Display suggested IRDAI-safe rewrites
    - Color-code by severity (error=red, warning=yellow)
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [x] 7.5 Create SmartContextPanel container
    - Build dynamic right-side panel that updates based on context
    - Conditionally render NextBestAction, Objections, Templates, Compliance sections
    - Add loading states for each section
    - Make collapsible on mobile
    - _Requirements: 5.1, 6.1, 7.1, 8.1_

- [x] 8. Implement maps and routing features
  - [x] 8.1 Create MapView component
    - Embed Google Maps with mock lead locations
    - Display lead clusters as light violet markers with count
    - Implement marker click to show lead preview popup
    - Add filter controls: Near Me, 30-min radius, Follow-up pending, High value
    - Use mock coordinates from leads.json
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 8.2 Create RouteOptimizerCard component
    - Display optimized travel path on map
    - Show waypoint list with estimated arrival times
    - Calculate total distance and time (mock calculation)
    - Add "Start Route" CTA button
    - _Requirements: 9.4, 9.5_

  - [x] 8.3 Create MapsPage component
    - Compose MapView and RouteOptimizerCard
    - Handle lead selection for route planning
    - Position RouteOptimizerCard at bottom as overlay
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 9. Build notification system
  - [x] 9.1 Create NotificationCard component
    - Display category tag, summary, and timestamp
    - Add quick action buttons (View, Dismiss, Mark Done)
    - Apply card styling with 18-22px radius
    - _Requirements: 17.2, 17.3_

  - [x] 9.2 Create NotificationsPage component
    - Add category tabs: Renewal, Follow-up, Compliance, Missed Calls
    - Display filtered NotificationCard list per tab
    - Show notification count badge
    - Handle mark as done action
    - _Requirements: 17.1, 17.2, 17.3, 17.4_

- [x] 10. Set up backend API server
  - [x] 10.1 Initialize Node.js Express server
    - Create `/server` directory with Express setup
    - Configure CORS for frontend origin
    - Set up environment variables for Gemini API key
    - Create basic error handling middleware
    - Add request logging
    - _Requirements: All AI-related requirements_

  - [x] 10.2 Create mock data service
    - Load JSON files from `/src/data/mock` into memory on startup
    - Create in-memory store with CRUD operations
    - Implement GET /api/leads, GET /api/leads/:id, PATCH /api/leads/:id, POST /api/leads
    - Implement GET /api/interactions, GET /api/templates
    - Return mock data with proper TypeScript types
    - _Requirements: All data-dependent requirements_

  - [x] 10.3 Create Compliance Guard middleware
    - Implement rule-based pattern matching for IRDAI violations
    - Create rules list: "guaranteed returns", "assured profit", "100% safe", etc.
    - Build validation function that checks content against rules
    - Return violations array with phrase, rule, severity, and safe alternative
    - Export as middleware function
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 11. Integrate Google Gemini AI
  - [x] 11.1 Set up Gemini API client
    - Install @google/generative-ai SDK
    - Create Gemini service wrapper in `/server/services/gemini.service.ts`
    - Initialize Gemini 1.5 Pro model with API key
    - Implement error handling and retry logic (max 3 attempts with exponential backoff)
    - _Requirements: 1.2, 5.2, 13.1_

  - [x] 11.2 Implement intent detection endpoint
    - Create POST /api/ai/intent endpoint
    - Send user text/transcript to Gemini with intent extraction prompt
    - Parse Gemini response to extract intent, entities, and confidence
    - Return structured action object (type, payload)
    - _Requirements: 1.2, 2.2, 2.3_

  - [x] 11.3 Implement summarization endpoint
    - Create POST /api/ai/summarize endpoint
    - Support call, chat, and period summarization types
    - Send interaction data to Gemini with summarization prompt
    - Format response in standard AI Summary Format (Summary, Insights, Next Action)
    - Extract entities (name, age, premium, dates)
    - Pass summary through Compliance Guard before returning
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [x] 11.4 Implement Next Best Action generation endpoint
    - Create POST /api/ai/next-action endpoint
    - Send lead context (history, temperature, last interaction) to Gemini
    - Generate action with steps, reasoning, confidence, and difficulty
    - Validate action through Compliance Guard
    - Return action with compliance status
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 11.5 Implement objection prediction endpoint
    - Create POST /api/ai/predict-objections endpoint
    - Send lead data and product type to Gemini
    - Generate 3-5 predicted objections with probabilities
    - Generate IRDAI-safe response scripts for each objection
    - Validate all responses through Compliance Guard
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 11.6 Implement template auto-fill endpoint
    - Create POST /api/ai/fill-template endpoint
    - Extract dynamic field values from lead data
    - Use Gemini to intelligently fill missing values
    - Validate filled template through Compliance Guard
    - Return filled template with data sources cited
    - _Requirements: 7.2, 7.3, 7.4, 7.5_

- [x] 12. Build AutoPilot engine
  - [x] 12.1 Create AutoPilot service
    - Create `/server/services/autopilot.service.ts`
    - Implement session management (start, pause, resume, abort)
    - Build prioritized queue generation from leads
    - Create action execution logic with confidence thresholds
    - Implement audit logging for all actions
    - _Requirements: 10.1, 10.2, 10.3, 11.1, 11.5_

  - [x] 12.2 Create AutoPilot API endpoints
    - Implement POST /api/autopilot/start with settings
    - Implement POST /api/autopilot/pause
    - Implement GET /api/autopilot/queue
    - Implement POST /api/autopilot/action/:id/apply
    - Implement POST /api/autopilot/action/:id/skip
    - Add WebSocket support for real-time action streaming
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 12.3 Create AutoPilotMiniPanel component
    - Display current lead name, progress bar, and next action
    - Add Pause/Resume and Abort buttons
    - Show persistent mini-panel while AutoPilot runs
    - Position at bottom of screen for mobile
    - _Requirements: 11.1, 11.2, 11.3_

  - [x] 12.4 Create ActivityFeedPanel component
    - Display list of queued actions with action summary cards
    - Add Apply, Edit, Skip, Undo buttons for each action
    - Show confidence score and compliance status badges
    - Display AI reasoning in expandable section
    - Implement real-time updates via WebSocket
    - _Requirements: 10.3, 10.4, 11.2, 11.3, 11.4, 11.5_

  - [x] 12.5 Implement AutoPilot settings and controls
    - Create settings modal with granular toggles
    - Add toggles: Auto-apply CRM updates, Auto-send messages, Auto-open profiles
    - Add Preview Mode toggle
    - Add timebox slider (10-60 minutes)
    - Add confidence threshold slider (50-90%)
    - Store settings in local storage
    - _Requirements: 10.4, 11.4, 11.5_

  - [x] 12.6 Implement AutoPilot safety overrides
    - Pause AutoPilot when Compliance Guard flags action
    - Surface mandatory rewrite flow for compliance violations
    - Require confirmation for low-confidence actions (< threshold)
    - Block policy-adjacent updates and require human approval
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 13. Implement audit trail and compliance features
  - [x] 13.1 Create audit logging system
    - Implement audit log writing on all CRM updates
    - Store user ID, action type, entity, changes, source, AI confidence, reasoning
    - Record user decision (applied, edited, skipped)
    - Store compliance status for each action
    - _Requirements: 18.1, 18.2, 18.5_

  - [x] 13.2 Create audit UI for admins
    - Build admin page to view audit logs
    - Add filters: date range, agent, action type, compliance status
    - Display audit entries in table with expandable details
    - Show AI reasoning and user decisions
    - Export audit logs as CSV
    - _Requirements: 18.3, 18.4_

- [x] 14. Connect frontend to backend APIs
  - [x] 14.1 Create API client service
    - Set up Axios instance with base URL and interceptors
    - Create typed API functions for all endpoints
    - Implement error handling and retry logic
    - Add request/response logging for debugging
    - _Requirements: All requirements_

  - [x] 14.2 Integrate React Query for data fetching
    - Create custom hooks: useLeads, useLead, useNextAction, useObjections, useTemplates
    - Configure cache times and stale-while-revalidate
    - Implement optimistic updates for CRM changes
    - Add loading and error states to all components
    - _Requirements: All requirements_

  - [x] 14.3 Connect CommandBar to AI intent endpoint
    - Send command bar input to POST /api/ai/intent
    - Parse intent response and execute corresponding action
    - Navigate to pages or trigger actions based on intent
    - Show autocomplete suggestions from AI
    - _Requirements: 2.2, 2.3, 2.4_

  - [x] 14.4 Connect VoiceAssistant to AI intent endpoint
    - Send voice transcript to POST /api/ai/intent
    - Display suggested actions as chips in overlay
    - Execute action on chip tap
    - Handle multi-step voice commands
    - _Requirements: 1.2, 1.3, 1.4_

  - [x] 14.5 Connect LeadProfile to AI endpoints
    - Fetch Next Best Action from POST /api/ai/next-action
    - Fetch predicted objections from POST /api/ai/predict-objections
    - Fetch templates and auto-fill from POST /api/ai/fill-template
    - Display compliance status from all responses
    - _Requirements: 5.1, 6.1, 7.1, 8.1_

  - [x] 14.6 Connect AutoPilot components to backend
    - Start AutoPilot session via POST /api/autopilot/start
    - Subscribe to WebSocket for real-time action updates
    - Apply/skip actions via POST /api/autopilot/action/:id/apply or skip
    - Update UI in real-time as actions are processed
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 15. Polish UI and animations
  - [x] 15.1 Implement all micro-animations
    - Add command bar glow on focus
    - Add card lift on hover (4px, 200ms)
    - Add voice button pulsing glow
    - Add page transition animations (fade + upward spring, 260ms)
    - Add snap scroll for horizontal work zones
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

  - [x] 15.2 Ensure mobile responsiveness
    - Test all pages on mobile viewport (375px - 428px width)
    - Make navigation collapsible on mobile
    - Stack LeadProfile layout vertically on mobile
    - Ensure touch targets are minimum 44px
    - Test voice assistant on mobile browsers
    - _Requirements: 19.1, 1.1_

  - [x] 15.3 Apply design system consistently
    - Verify all colors match palette (Violet Indigo #6A5AE0, etc.)
    - Ensure all cards use 18-22px radius
    - Verify typography uses Inter/SF Pro with correct weights
    - Apply VisionOS shadows (0px 8px 20px rgba(0,0,0,0.08))
    - Use Feather-style icons throughout
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

- [x] 16. Testing and deployment
  - [x] 16.1 Test critical user flows
    - Test voice command → lead creation → profile view
    - Test AutoPilot session → action approval → CRM update
    - Test lead search → map view → route optimization
    - Test template selection → compliance validation → message preview
    - Test command bar navigation and AI suggestions
    - _Requirements: All requirements_

  - [x] 16.2 Test Gemini API integration
    - Verify intent detection accuracy with sample commands
    - Test summarization with mock interaction data
    - Verify Next Best Action generation quality
    - Test objection prediction relevance
    - Verify Compliance Guard catches all risky phrases
    - _Requirements: 1.2, 5.2, 6.2, 8.1, 13.1_

  - [x] 16.3 Configure PWA for mobile installation
    - Create manifest.json with app name, icons, theme color
    - Configure service worker for offline support
    - Test "Add to Home Screen" on iOS and Android
    - Verify app launches in standalone mode
    - _Requirements: 19.1_

  - [x] 16.4 Deploy to production
    - Build frontend for production (npm run build)
    - Deploy frontend to Vercel or Netlify
    - Deploy backend to Railway, Render, or similar
    - Configure environment variables in production
    - Test production deployment end-to-end
    - _Requirements: All requirements_
