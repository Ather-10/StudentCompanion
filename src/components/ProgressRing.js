import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

// A circular progress ring. `progress` goes from 0 to 1. Children are shown in the middle.
export default function ProgressRing({ size = 250, stroke = 14, progress = 0, color, track, children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const c = size / 2;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={c} cy={c} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <Circle
          cx={c}
          cy={c}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - Math.min(1, Math.max(0, progress)))}
          transform={`rotate(-90 ${c} ${c})`}
        />
      </Svg>
      {children}
    </View>
  );
}
