'use client';

import { AssessmentType } from './AssessmentDashboard';
import { DISCChart } from './charts/DISCChart';
import { WheelOfLifeChart } from './charts/WheelOfLifeChart';
import { ThinkingStylesChart } from './charts/ThinkingStylesChart';
import { EnneagramBadge } from './charts/EnneagramBadge';
import { MyersBriggsBadge } from './charts/MyersBriggsBadge';
import { PersonalitiesBadge } from './charts/PersonalitiesBadge';
import { BigFiveChart } from './charts/BigFiveChart';
import { SpiritualGiftsBadge } from './charts/SpiritualGiftsBadge';

interface AssessmentTileProps {
  assessment: {
    id: AssessmentType;
    title: string;
    description: string;
    result: any;
  };
  isSelected: boolean;
  onClick: () => void;
}

const chartComponents: Record<AssessmentType, React.ComponentType<{result: any}>> = {
  'disc': DISCChart,
  'wheel-of-life': WheelOfLifeChart,
  'thinking-styles': ThinkingStylesChart,
  'enneagram': EnneagramBadge,
  'myers-briggs': MyersBriggsBadge,
  '16-personalities': PersonalitiesBadge,
  'big-five': BigFiveChart,
  'spiritual-gifts': SpiritualGiftsBadge,
};

export function AssessmentTile({ assessment, isSelected, onClick }: AssessmentTileProps) {
  const ChartComponent = chartComponents[assessment.id];

  return (
    <button
      onClick={onClick}
      className={`
        group relative flex flex-col items-center justify-center p-6 rounded-lg
        bg-white border border-gray-200 transition-all duration-200
        hover:shadow-lg hover:border-gray-300
        focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2
        ${isSelected ? 'ring-2 ring-navy-500 shadow-lg' : ''}
      `}
      aria-pressed={isSelected}
      aria-label={`${assessment.title}: ${assessment.description}`}
    >
      {/* Title */}
      <h3 className="text-center font-semibold text-navy-900 mb-4 text-sm md:text-base tracking-tight">
        {assessment.title}
      </h3>

      {/* Chart/Visual */}
      <div className="w-full flex items-center justify-center mb-3">
        <div className="w-full max-w-xs">
          <ChartComponent result={assessment.result} />
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-charcoal-600 text-center group-hover:text-charcoal-700 transition-colors">
        {assessment.description}
      </p>

      {/* Hover indicator */}
      <div className="absolute inset-0 rounded-lg bg-navy-900 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
    </button>
  );
}
