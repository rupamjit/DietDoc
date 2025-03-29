"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  category: 'nutrition' | 'fitness' | 'health';
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: 0,
    unit: '',
    deadline: '',
    category: 'nutrition' as const
  });

  const addGoal = () => {
    if (!newGoal.title || !newGoal.target || !newGoal.unit || !newGoal.deadline) {
      toast.error('Please fill in all fields');
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal,
      current: 0
    };

    setGoals([...goals, goal]);
    setNewGoal({
      title: '',
      target: 0,
      unit: '',
      deadline: '',
      category: 'nutrition'
    });
    toast.success('Goal added successfully');
  };

  const updateProgress = (goalId: string, value: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        return { ...goal, current: Math.min(value, goal.target) };
      }
      return goal;
    }));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
    toast.success('Goal deleted');
  };

  const calculateProgress = (current: number, target: number) => {
    return (current / target) * 100;
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Health Goals</h1>

      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Goal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              placeholder="e.g., Daily Water Intake"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Target Amount</Label>
            <Input
              id="target"
              type="number"
              value={newGoal.target || ''}
              onChange={(e) => setNewGoal({ ...newGoal, target: Number(e.target.value) })}
              placeholder="Enter target amount"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              value={newGoal.unit}
              onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
              placeholder="e.g., glasses, steps, hours"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Target Date</Label>
            <Input
              id="deadline"
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              className="w-full p-2 border rounded-md"
              value={newGoal.category}
              onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as 'nutrition' | 'fitness' | 'health' })}
            >
              <option value="nutrition">Nutrition</option>
              <option value="fitness">Fitness</option>
              <option value="health">General Health</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <Button
              onClick={addGoal}
              className="w-full bg-[#2E8B57] hover:bg-[#236B43]"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Goal
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {goals.map((goal) => (
          <Card key={goal.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{goal.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Target: {goal.target} {goal.unit} by {goal.deadline}
                </p>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteGoal(goal.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress: {goal.current} / {goal.target} {goal.unit}</span>
                <span>{Math.round(calculateProgress(goal.current, goal.target))}%</span>
              </div>
              <Progress value={calculateProgress(goal.current, goal.target)} />
              
              <Input
                type="number"
                value={goal.current}
                onChange={(e) => updateProgress(goal.id, Number(e.target.value))}
                className="mt-2"
                placeholder="Update progress"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}