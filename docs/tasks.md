# Implementation Plan: Generative UI Dashboard

## Overview

This implementation plan converts the generative UI dashboard design into a series of incremental coding tasks. The plan focuses on building a React-based web application with Mastra agent integration and CopilotKit dynamic UI generation, following a component-by-component approach that ensures each step builds on previous work.

## Tasks

- [x] 1. Set up project foundation and core dependencies

- [x] 1. Audit current project setup and create TypeScript interfaces

  - Review existing Mastra agent configuration and CopilotKit integration
  - Create TypeScript interfaces and types from design document
  - Set up state management structure (React Context)
  - Document current MCP tools and agent capabilities
  - _Requirements: 1.1, 2.1, 6.1_

- [ ]\* 1.1 Write property test for message processing

  - **Property 1: Message Processing and Response Generation**
  - **Validates: Requirements 1.2, 1.3**

- [ ] 2. Create dashboard layout and core UI components

  - [ ] 2.1 Create AppLayout component with split-panel design

    - Build main layout container with chat panel (right) and dashboard area (left)
    - Implement responsive layout with panel resizing capabilities
    - Integrate AppProvider context wrapper for state management
    - _Requirements: 1.1, 2.1, 6.1_

  - [ ] 2.2 Create Dashboard page component

    - Build new dashboard page that uses AppLayout
    - Add route for /dashboard alongside existing /personal-assistant
    - Implement dashboard metrics display area and AI activity status section
    - _Requirements: 1.1, 2.1, 5.1, 5.2_

  - [ ] 2.3 Create ChatPanel component

    - Build message display with conversation history
    - Implement user input handling and message sending
    - Add typing indicators and loading states
    - Connect to Mastra agent via existing CopilotKit integration
    - _Requirements: 1.2, 1.3, 1.4_

  - [ ]\* 2.4 Write unit tests for layout components
    - Test dashboard layout and panel positioning
    - Test routing and navigation between pages
    - Test chat panel message display and input handling
    - _Requirements: 1.1, 1.2, 2.1_

- [ ] 3. Implement dashboard metrics and AI activity status

  - [ ] 3.1 Create Dashboard component structure

    - Build productivity metrics cards layout (emails processed, events scheduled, conflicts)
    - Implement upcoming events and priority inbox sections
    - Connect to dashboard state from AppContext
    - _Requirements: 5.1, 5.2, 5.5_

  - [ ] 3.2 Create AIActivityStatus component

    - Display real-time Mastra workflow execution progress
    - Show activity history with timestamps and status updates
    - Handle status transitions (processing → completed/error)
    - Connect to Mastra state from AppContext
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ] 3.3 Implement dashboard data management

    - Create dashboard metrics calculation logic
    - Handle real-time metrics updates from Mastra workflows
    - Implement data persistence and caching
    - _Requirements: 5.1, 5.2, 6.4_

  - [ ]\* 3.4 Write property test for dashboard metrics

    - **Property 8: Dashboard Metrics Updates**
    - **Validates: Requirements 3.2, 5.1, 5.2, 6.4**

  - [ ]\* 3.5 Write property test for activity status lifecycle

    - **Property 3: AI Activity Status Lifecycle**
    - **Validates: Requirements 2.2, 2.3, 2.4**

- [ ] 4. Implement Mastra workflow integration and monitoring

  - [ ] 4.1 Create MastraAgentInterface component

    - Implement agent lifecycle management and workflow execution
    - Handle tool call results and status updates
    - Process email and calendar operations through existing MCP tools
    - Connect to Mastra state management in AppContext
    - _Requirements: 1.5, 2.2, 2.3, 2.4_

  - [ ] 4.2 Integrate chat with Mastra workflows

    - Connect ChatPanel to MastraAgentInterface for tool call routing
    - Handle agent responses and workflow triggers from chat input
    - Implement real-time message updates and workflow status
    - _Requirements: 1.2, 1.5, 6.3_

  - [ ]\* 4.3 Write property test for tool call routing

    - **Property 2: Tool Call Routing**
    - **Validates: Requirements 1.5, 3.1, 4.1**

  - [ ]\* 4.4 Write property test for activity history

    - **Property 4: Activity History Persistence**
    - **Validates: Requirements 2.6**

  - [ ]\* 4.5 Write property test for real-time updates
    - **Property 12: Real-time UI Updates**
    - **Validates: Requirements 6.1, 6.2, 6.3**

- [ ] 5. Checkpoint - Ensure core UI and Mastra integration works

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement email and calendar management features

  - [ ] 6.1 Create email management UI components

    - Build email metrics display and processing status
    - Implement email operation feedback and progress tracking
    - Connect to existing Zapier MCP Gmail tools through Mastra
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 6.2 Create calendar management UI components

    - Build calendar scanning results and scheduling interface
    - Implement event scheduling confirmation and conflict detection display
    - Connect to existing Zapier MCP calendar tools through Mastra
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 6.3 Implement daily briefing generation

    - Generate briefings with processed emails and scheduled events
    - Calculate and display productivity statistics
    - Handle briefing content updates and refresh
    - _Requirements: 5.4_

  - [ ]\* 6.4 Write property test for email operations

    - **Property 6: Email Operations Support**
    - **Validates: Requirements 3.4, 3.5**

  - [ ]\* 6.5 Write property test for calendar operations

    - **Property 7: Calendar Operations Support**
    - **Validates: Requirements 4.2, 4.3, 4.4**

  - [ ]\* 6.6 Write property test for conflict detection
    - **Property 9: Conflict Detection and Visualization**
    - **Validates: Requirements 5.3**

- [ ] 7. Implement CopilotKit dynamic UI generation

  - [ ] 7.1 Create CopilotUIRenderer component

    - Parse Mastra agent responses for UI generation
    - Render CopilotKit components dynamically based on operation type
    - Handle user interactions with generated UI components
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ] 7.2 Implement layout adaptation and styling

    - Adapt layout based on AI operation type (email, calendar, dashboard)
    - Maintain consistent styling across dynamic components
    - Handle component lifecycle and state management
    - _Requirements: 7.4, 7.5_

  - [ ]\* 7.3 Write property test for dynamic UI generation

    - **Property 13: Dynamic UI Component Generation**
    - **Validates: Requirements 7.1, 7.2, 7.3**

  - [ ]\* 7.4 Write property test for layout adaptation

    - **Property 14: Layout Adaptation**
    - **Validates: Requirements 7.4**

  - [ ]\* 7.5 Write property test for styling consistency
    - **Property 15: Styling Consistency**
    - **Validates: Requirements 7.5**

- [ ] 8. Integration and final wiring

  - [ ] 8.1 Connect all components and establish data flow

    - Wire Mastra agents to UI components through AppContext
    - Connect CopilotKit renderer to agent responses
    - Establish real-time update mechanisms between all components
    - _Requirements: 1.4, 6.1, 6.2_

  - [ ] 8.2 Implement error handling and recovery

    - Add comprehensive error handling for all components
    - Implement graceful degradation for service failures
    - Add user feedback for error conditions
    - _Requirements: 2.4_

  - [ ]\* 8.3 Write integration tests
    - Test end-to-end user workflows
    - Test Mastra and CopilotKit integration
    - Test error handling and recovery scenarios
    - _Requirements: All requirements_

- [ ] 9. Final checkpoint - Ensure all functionality works
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties from the design
- Unit tests validate specific examples and edge cases
- The foundation (TypeScript interfaces, state management, Mastra setup) is already complete
- Focus on building UI components and connecting them to existing Mastra/CopilotKit infrastructure
- Maintain real-time updates and responsive user experience throughout
