import { useState } from 'react';
import AIAssistantChat from '../components/AIAssistantChat';
import BottomNavigation from '../components/BottomNavigation';

export default function AIAssistantPage() {
  const [notificationCount] = useState(3);

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Main Content - Full Width */}
      <div className="min-h-screen">
        <AIAssistantChat />
      </div>

      {/* Bottom Navigation - Always Visible */}
      <BottomNavigation notificationCount={notificationCount} />
    </div>
  );
}
