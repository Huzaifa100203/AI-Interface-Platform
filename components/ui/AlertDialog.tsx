import React, { useEffect } from 'react';

interface Button {
  label: string;
  onClick: () => void;
  variant?: 'contained' | 'outlined';
  disabled?: boolean;
  color?: 'primary' | 'error';
}

interface AlertDialogProps {
  open: boolean;
  fullScreen?: boolean;
  confirm?: () => void;
  cancel?: () => void;
  buttons?: Button[];
  disableConfirmBtn?: boolean;
  disableCancelBtn?: boolean;
  Component?: React.ReactNode;
  showCancelBtn?: boolean;
  showConfirmBtn?: boolean;
  borderRadius?: string;
  disableEscapeKeyDown?: boolean;
}

export default function AlertDialog({
  open,
  fullScreen,
  confirm,
  cancel,
  buttons,
  disableConfirmBtn,
  disableCancelBtn,
  Component,
  showCancelBtn,
  showConfirmBtn,
  borderRadius,
  disableEscapeKeyDown
}: AlertDialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !disableEscapeKeyDown && !disableCancelBtn && cancel) {
        cancel();
      }
    };
    
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, disableEscapeKeyDown, disableCancelBtn, cancel]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !disableEscapeKeyDown && !disableCancelBtn && cancel) {
      cancel();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={handleBackdropClick}
      />
      
      {/* Dialog */}
      <div 
        className={`relative bg-white dark:bg-gray-800 shadow-xl w-full max-w-md mx-4 ${
          fullScreen ? 'max-w-4xl h-[90vh]' : 'max-h-[90vh]'
        } ${borderRadius ? '' : 'rounded-lg'} overflow-hidden`}
        style={borderRadius ? { borderRadius } : {}}
      >
        {/* Content */}
        <div className={`p-6 ${fullScreen ? 'h-full overflow-auto' : ''}`}>
          {Component}
        </div>
        
        {/* Actions */}
        {(showCancelBtn || showConfirmBtn || buttons?.length) && (
          <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
            {showCancelBtn && (
              <button
                onClick={cancel}
                disabled={disableCancelBtn}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Cancel
              </button>
            )}
            
            {showConfirmBtn && (
              <button
                onClick={confirm}
                disabled={disableConfirmBtn}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            )}
            
            {buttons?.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                disabled={button.disabled}
                className={`px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${
                  button.variant === 'outlined'
                    ? button.color === 'error'
                      ? 'border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20'
                      : 'border border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20'
                    : button.color === 'error'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {button.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
