import React from 'react';
import { BarChart3, LineChart, PieChart, Circle, TrendingUp, Grid3x3, Droplets, Box, Filter, Layers } from 'lucide-react';

interface ChartIconProps {
  icon: string;
  className?: string;
}

const iconMap: Record<string, React.ElementType> = {
  BarChart3,
  LineChart,
  PieChart,
  Circle,
  TrendingUp,
  Grid3x3,
  Droplets,
  Box,
  Filter,
  Layers,
};

export const ChartIcon: React.FC<ChartIconProps> = ({ icon, className }) => {
  const IconComponent = iconMap[icon] || BarChart3;
  return <IconComponent className={className} strokeWidth={2.5} />;
};
