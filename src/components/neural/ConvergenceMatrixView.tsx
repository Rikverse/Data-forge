import React from 'react';
import { ConvergencePanel, ConvergencePanelProps } from './ConvergencePanel';

export type ConvergenceMatrixViewProps = ConvergencePanelProps;

/**
 * ConvergenceMatrixView — wraps the unified ConvergencePanel for backward-compatibility.
 */
export const ConvergenceMatrixView: React.FC<ConvergenceMatrixViewProps> = (props) => {
  return <ConvergencePanel {...props} />;
};

export default ConvergenceMatrixView;
