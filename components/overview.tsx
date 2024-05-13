"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface OverviewProps {
  data: any[];
};

export const Overview: React.FC<OverviewProps> = ({ data }) => {
  const barColors = ["#e81416", "#ffa500", "#faeb36", "#79c314", "#487de7", "#4b369d", "#70369d", "#487de7", "#4b369d", "#70369d", "#487de7", "#4b369d", "#70369d"]

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={value => `${value}`} />
        <Bar dataKey='total' fill="#3498db" radius={[4, 4, 0, 0]} >
          {
            data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={barColors[index % 20]} />
            ))
          }
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}