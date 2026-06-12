import type { EnergyEffect, EnergyLevel, Priority, Status } from '../types';
import type { EnergyMatch } from './energy';

export const STATUS_STYLES: Record<Status, string> = {
  'Not Started': 'bg-lilac text-[#6b5a96]',
  'In Progress': 'bg-sky text-[#3f6e96]',
  Waiting: 'bg-butter text-[#9c7a1f]',
  Parked: 'bg-[#ece8e3] text-[#857d6f]',
  Done: 'bg-sage text-[#4c7a59]',
};

export const PRIORITY_STYLES: Record<Priority, string> = {
  High: 'bg-blush text-[#c0506f]',
  Medium: 'bg-butter text-[#9c7a1f]',
  Low: 'bg-sage text-[#4c7a59]',
};

export const ENERGY_STYLES: Record<EnergyLevel, string> = {
  High: 'bg-peach text-[#c06a3f]',
  Medium: 'bg-butter text-[#9c7a1f]',
  Low: 'bg-sky text-[#3f6e96]',
};

export const ENERGY_EFFECT_STYLES: Record<EnergyEffect, string> = {
  Boost: 'bg-sage text-[#4c7a59]',
  Drain: 'bg-blush text-[#c0506f]',
  Neutral: 'bg-[#ece8e3] text-[#857d6f]',
};

export const ENERGY_EFFECT_ICON: Record<EnergyEffect, string> = {
  Boost: '↑',
  Drain: '↓',
  Neutral: '·',
};

export const ENERGY_MATCH_STYLES: Record<EnergyMatch, string> = {
  match: 'bg-sage text-[#4c7a59]',
  stretch: 'bg-butter text-[#9c7a1f]',
  mismatch: 'bg-[#ece8e3] text-[#a39b8e]',
};

export const ENERGY_MATCH_LABEL: Record<EnergyMatch, string> = {
  match: 'Great fit',
  stretch: 'Doable',
  mismatch: "Not now",
};
