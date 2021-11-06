import React from 'react';

import SidebarContent from './SidebarContent';

function DesktopSidebar() {
  return (
    <aside className='z-30 flex-shrink-0 hidden w-64 overflow-y-auto bg-white lg:block bg-blue-900'>
      <SidebarContent />
    </aside>
  );
}

export default DesktopSidebar;
