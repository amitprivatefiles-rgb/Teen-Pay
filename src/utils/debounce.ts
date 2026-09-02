export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function useDebounceClick() {
  let isProcessing = false;

  return async <T>(fn: () => Promise<T>): Promise<T | void> => {
    if (isProcessing) {
      return;
    }

    isProcessing = true;
    try {
      return await fn();
    } finally {
      isProcessing = false;
    }
  };
}
