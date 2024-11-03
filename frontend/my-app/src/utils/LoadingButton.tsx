import React, { useState } from 'react';
import { Spinner, ButtonProps } from 'react-bootstrap';

type UseLoadingResult = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  LoadingButton: React.FC<ButtonProps>;
};

const useLoading = (): UseLoadingResult => {
  const [isLoading, setIsLoading] = useState(false);

  const LoadingButton: React.FC<ButtonProps> = ({ children, ...props }) => (
    <button {...props} disabled={isLoading}>
      {isLoading ? <Spinner animation="border" size="sm" /> : children}
    </button>
  );

  return { isLoading, setIsLoading, LoadingButton };
};

export default useLoading;
