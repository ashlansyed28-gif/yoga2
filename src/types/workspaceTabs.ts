/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TabContentType =
  | 'home'
  | 'pose'
  | 'protocol'
  | 'protocols-list'
  | 'sequence'
  | 'flow'
  | 'intention'
  | 'chanting'
  | 'consult'
  | 'emergency'
  | 'sleep'
  | 'faceyoga'
  | 'progress'
  | 'community'
  | 'game'
  | 'aipose'
  | 'matcher'
  | 'prescriptions'
  | 'dosha';

export interface WorkspaceTab {
  id: string;
  type: TabContentType;
  title: string;
  subtitle?: string;
  iconName?: string;
  itemId?: string;
  data?: any;
  canClose: boolean;
}
