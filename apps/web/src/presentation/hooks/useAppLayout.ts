import { useState } from 'react';

export function useAppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return {
    isSidebarOpen,
    toggleSidebar,
  };
}
