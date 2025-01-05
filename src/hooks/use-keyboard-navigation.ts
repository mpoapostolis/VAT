import { useState, useCallback } from 'react';
import { addDays, addWeeks, subDays, subWeeks } from 'date-fns';

export function useKeyboardNavigation() {
  const [focusedDate, setFocusedDate] = useState<Date>(new Date());

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    
    switch (e.key) {
      case 'ArrowLeft':
        setFocusedDate(prev => subDays(prev, 1));
        break;
      case 'ArrowRight':
        setFocusedDate(prev => addDays(prev, 1));
        break;
      case 'ArrowUp':
        setFocusedDate(prev => subWeeks(prev, 1));
        break;
      case 'ArrowDown':
        setFocusedDate(prev => addWeeks(prev, 1));
        break;
      case 'Home':
        setFocusedDate(prev => subDays(prev, prev.getDate() - 1)); // Start of month
        break;
      case 'End':
        setFocusedDate(prev => {
          const lastDay = new Date(prev.getFullYear(), prev.getMonth() + 1, 0);
          return lastDay;
        }); // End of month
        break;
      case 'PageUp':
        if (e.shiftKey) {
          setFocusedDate(prev => new Date(prev.getFullYear() - 1, prev.getMonth(), prev.getDate()));
        } else {
          setFocusedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, prev.getDate()));
        }
        break;
      case 'PageDown':
        if (e.shiftKey) {
          setFocusedDate(prev => new Date(prev.getFullYear() + 1, prev.getMonth(), prev.getDate()));
        } else {
          setFocusedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, prev.getDate()));
        }
        break;
    }
  }, []);

  return { focusedDate, handleKeyDown };
}
