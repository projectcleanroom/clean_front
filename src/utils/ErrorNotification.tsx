import React from 'react';

interface ErrorNotificationProps {
  message: string;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({ message }) => {
  return <div className="error">{message}</div>;
};

export default ErrorNotification;
