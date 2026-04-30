'use client';

import { useState } from 'react';
import { AssessmentTile } from './AssessmentTile';
import { AssessmentModal } from './AssessmentModal';

export type AssessmentType =
  | 'disc'
  | 'wheel-of-life'
  | 'thinking-styles'
  | 'enneagram'

  | '16-personalities'
  | 'big-five'
  | 'spiritual-gifts';

interface Assessment {
  id: AssessmentType;
  title: string;
  description: string;
  result: any;
  detailContent: React.ReactNode;
}

const ASSESSMENTS: Assessment[] = [
  {
    id: 'disc',
    title: 'DISC Profile',
    description: 'Behavioral tendencies and communication style',
    result: { D: 35, I: 25, S: 20, C: 20 },
    detailContent: <div className="space-y-4">
      <p className="text-charcoal-600">Your DISC profile reveals how you approach work, interact with others, and respond to change.</p>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">Dominance (D)</span>
          <span className="text-xl font-bold text-disc-d">35%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-disc-d" style={{width: '35%'}}></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">Influence (I)</span>
          <span className="text-xl font-bold text-disc-i">25%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-disc-i" style={{width: '25%'}}></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">Steadiness (S)</span>
          <span className="text-xl font-bold text-disc-s">20%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-disc-s" style={{width: '20%'}}></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">Conscientiousness (C)</span>
          <span className="text-xl font-bold text-disc-c">20%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-disc-c" style={{width: '20%'}}></div>
        </div>
      </div>
    </div>
  },
  {
    id: 'wheel-of-life',
    title: 'Wheel of Life',
    description: 'Life balance across key dimensions',
    result: { family: 7, health: 6, work: 8, faith: 9, relationships: 7, finances: 6, growth: 8, community: 7 },
    detailContent: <div className="space-y-4">
      <p className="text-charcoal-600">Your Wheel of Life shows balance and satisfaction across important life areas.</p>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-wheel-warm-1">7</div>
          <div className="text-sm text-charcoal-600">Family</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-wheel-warm-2">6</div>
          <div className="text-sm text-charcoal-600">Health</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-wheel-warm-3">8</div>
          <div className="text-sm text-charcoal-600">Work</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-wheel-warm-4">9</div>
          <div className="text-sm text-charcoal-600">Faith</div>
        </div>
      </div>
    </div>
  },
  {
    id: 'thinking-styles',
    title: 'Thinking Styles',
    description: 'How you process information',
    result: { conceptual: 45, holistic: 30, intuitive: 25 },
    detailContent: <div className="space-y-4">
      <p className="text-charcoal-600">Your thinking style describes how you naturally process information and solve problems.</p>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Conceptual</span>
            <span className="text-sm font-bold text-thinking-1">45%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-thinking-1" style={{width: '45%'}}></div>
          </div>
          <p className="text-xs text-charcoal-600 mt-1">Abstract thinking, theory, big-picture perspective</p>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Holistic</span>
            <span className="text-sm font-bold text-thinking-2">30%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-thinking-2" style={{width: '30%'}}></div>
          </div>
          <p className="text-xs text-charcoal-600 mt-1">Seeing connections, systems thinking, relationships</p>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Intuitive</span>
            <span className="text-sm font-bold text-thinking-3">25%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-thinking-3" style={{width: '25%'}}></div>
          </div>
          <p className="text-xs text-charcoal-600 mt-1">Instinct, pattern recognition, immediate insight</p>
        </div>
      </div>
    </div>
  },
  {
    id: 'enneagram',
    title: 'Enneagram',
    description: 'Core motivations and personality',
    result: { type: 3, wing: 2 },
    detailContent: <div className="space-y-4">
      <p className="text-charcoal-600">You are a Type 3 with a 2 wing—the Supportive Achiever. You are driven to succeed and be valued, with an emphasis on connecting with and supporting others.</p>
      <div className="bg-enneagram-3-light p-4 rounded-lg border border-enneagram-3 mt-4">
        <h4 className="font-semibold text-enneagram-3 mb-2">Core Motivations</h4>
        <ul className="text-sm text-charcoal-600 space-y-1">
          <li>• To be successful and achieve goals</li>
          <li>• To be valued and appreciated</li>
          <li>• To help others succeed</li>
        </ul>
      </div>
    </div>
  },
  {
    id: '16-personalities',
    title: '16 Personalities',
    description: 'Role and strategywithin personality',
    result: { type: 'Logistician' },
    detailContent: <div className="space-y-4">
      <p className="text-charcoal-600">The Logistician—a practical leader with a gift for organization and implementation. You excel at creating structure and ensuring accountability.</p>
      <div className="bg-personalities-light p-4 rounded-lg border border-personalities mt-4">
        <h4 className="font-semibold text-personalities mb-2">Key Strengths</h4>
        <ul className="text-sm text-charcoal-600 space-y-1">
          <li>• Organized and detail-oriented</li>
          <li>• Reliable and dependable</li>
          <li>• Strong sense of responsibility</li>
          <li>• Natural leader</li>
        </ul>
      </div>
    </div>
  },
  {
    id: 'big-five',
    title: 'Big Five',
    description: 'Universal personality dimensions',
    result: { openness: 65, conscientiousness: 78, extraversion: 72, agreeableness: 68, neuroticism: 35 },
    detailContent: <div className="space-y-4">
      <p className="text-charcoal-600">Your personality across the five dimensions that psychologists use to describe everyone.</p>
      <div className="space-y-4 mt-6">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Openness to Experience</span>
            <span className="text-sm font-bold text-big5-o">65</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-big5-o" style={{width: '65%'}}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Conscientiousness</span>
            <span className="text-sm font-bold text-big5-c">78</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-big5-c" style={{width: '78%'}}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Extraversion</span>
            <span className="text-sm font-bold text-big5-e">72</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-big5-e" style={{width: '72%'}}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Agreeableness</span>
            <span className="text-sm font-bold text-big5-a">68</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-big5-a" style={{width: '68%'}}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Neuroticism</span>
            <span className="text-sm font-bold text-big5-n">35</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-big5-n" style={{width: '35%'}}></div>
          </div>
        </div>
      </div>
    </div>
  },
  {
    id: 'spiritual-gifts',
    title: 'Spiritual Gifts',
    description: 'How you serve in God\'s Kingdom',
    result: { primary: 'Mercy', secondary: ['Teaching', 'Encouragement'] },
    detailContent: <div className="space-y-4">
      <p className="text-charcoal-600">Spiritual gifts reveal how God has equipped you to serve. Your primary gift shows your deepest calling.</p>
      <div className="bg-gifts-primary-light p-4 rounded-lg border-2 border-gifts-primary mt-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-gifts-primary mb-2">💙</div>
          <h4 className="font-semibold text-gifts-primary text-lg mb-2">Mercy</h4>
          <p className="text-sm text-charcoal-600">You are deeply moved by the suffering of others and motivated to comfort and support them. Your compassion is a gift to the body of Christ.</p>
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-charcoal-800 mb-2">Secondary Gifts</h4>
        <div className="space-y-2">
          <div className="p-2 bg-gray-100 rounded">Teaching</div>
          <div className="p-2 bg-gray-100 rounded">Encouragement</div>
        </div>
      </div>
    </div>
  },
];

export function AssessmentDashboard() {
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentType | null>(null);
  const selectedData = ASSESSMENTS.find(a => a.id === selectedAssessment);

  return (
    <>
      <div className="bg-off-white-100 min-h-screen p-6 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-navy-900 mb-2 tracking-tight">
            My Assessments
          </h1>
          <p className="text-lg text-charcoal-600 mb-12">
            Your leadership profile across eight dimensions. Click any tile to explore your results.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ASSESSMENTS.map((assessment) => (
              <AssessmentTile
                key={assessment.id}
                assessment={assessment}
                isSelected={selectedAssessment === assessment.id}
                onClick={() => setSelectedAssessment(assessment.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedData && (
        <AssessmentModal
          assessment={selectedData}
          isOpen={selectedAssessment !== null}
          onClose={() => setSelectedAssessment(null)}
        />
      )}
    </>
  );
}
