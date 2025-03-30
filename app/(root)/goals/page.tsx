// "use client";
// import { useState, useEffect } from "react";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Progress } from "@/components/ui/progress";
// import { Plus, Trash2 } from "lucide-react";
// import { toast } from "sonner";
// import { addGoalAction, updateGoalAction, deleteGoalAction, fetchGoalsAction } from "@/actions/goal";


// interface Goal {
//   id: string;
//   title: string;
//   target: number;
//   current: number;
//   unit: string;
//   category: "nutrition" | "fitness" | "health";
// }

// export default function GoalsPage() {
//   const [goals, setGoals] = useState<Goal[]>([]);
//   const [newGoal, setNewGoal] = useState({
//     title: "",
//     target: 0,
//     unit: "",
//     category: "nutrition" as const,
//   });

//   // Fetch the goals when the component mounts
//   useEffect(() => {
//     const loadGoals = async () => {
//       try {
//         const fetchedGoals = await fetchGoalsAction();
//         setGoals(fetchedGoals);
//       } catch (error) {
//         toast.error("Error fetching goals");
//       }
//     };
//     loadGoals();
//   }, []);

//   // Add a new goal using server-side action
//   const addGoal = async () => {
//     if (!newGoal.title || !newGoal.target || !newGoal.unit) {
//       toast.error("Please fill in all fields");
//       return;
//     }

//     try {
//       const result = await addGoalAction({
//         title: newGoal.title,
//         target: newGoal.target,
//         unit: newGoal.unit,
//         category: newGoal.category,
//       });

//       setGoals([...goals, result]);
//       setNewGoal({
//         title: "",
//         target: 0,
//         unit: "",
//         category: "nutrition",
//       });
//       toast.success("Goal added successfully");
//     } catch (error) {
//       toast.error("Error adding goal");
//     }
//   };

//   // Update progress of a goal
//   const updateProgress = async (goalId: string, value: number) => {
//     try {
//       await updateGoalAction(goalId, value);
//       setGoals(
//         goals.map((goal) => (goal.id === goalId ? { ...goal, current: Math.min(value, goal.target) } : goal))
//       );
//       toast.success("Goal progress updated");
//     } catch (error) {
//       toast.error("Error updating goal progress");
//     }
//   };

//   // Delete a goal
//   const deleteGoal = async (goalId: string) => {
//     try {
//       await deleteGoalAction(goalId);
//       setGoals(goals.filter((goal) => goal.id !== goalId));
//       toast.success("Goal deleted");
//     } catch (error) {
//       toast.error("Error deleting goal");
//     }
//   };

//   // Calculate progress percentage
//   const calculateProgress = (current: number, target: number) => {
//     return (current / target) * 100;
//   };

//   return (
//     <div className="p-8 max-w-4xl mx-auto">
//       <h1 className="text-3xl font-bold mb-8">Health Goals</h1>

//       <Card className="p-6 mb-8">
//         <h2 className="text-xl font-semibold mb-4">Add New Goal</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="title">Goal Title</Label>
//             <Input
//               id="title"
//               value={newGoal.title}
//               onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
//               placeholder="e.g., Daily Water Intake"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="target">Target Amount</Label>
//             <Input
//               id="target"
//               type="number"
//               value={newGoal.target || ""}
//               onChange={(e) => setNewGoal({ ...newGoal, target: Number(e.target.value) })}
//               placeholder="Enter target amount"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="unit">Unit</Label>
//             <Input
//               id="unit"
//               value={newGoal.unit}
//               onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
//               placeholder="e.g., glasses, steps, hours"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="category">Category</Label>
//             <select
//               id="category"
//               className="w-full p-2 border rounded-md"
//               value={newGoal.category}
//               onChange={(e) =>
//                 setNewGoal({
//                   ...newGoal,
//                   category: e.target.value as "nutrition" | "fitness" | "health",
//                 })
//               }
//             >
//               <option value="nutrition">Nutrition</option>
//               <option value="fitness">Fitness</option>
//               <option value="health">General Health</option>
//             </select>
//           </div>

//           <div className="md:col-span-2">
//             <Button onClick={addGoal} className="w-full bg-[#2E8B57] hover:bg-[#236B43]">
//               <Plus className="mr-2 h-4 w-4" /> Add Goal
//             </Button>
//           </div>
//         </div>
//       </Card>

//       <div className="space-y-4">
//         {goals.map((goal) => (
//           <Card key={goal.id} className="p-6">
//             <div className="flex justify-between items-start mb-4">
//               <div>
//                 <h3 className="text-lg font-semibold">{goal.title}</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Target: {goal.target} {goal.unit}
//                 </p>
//               </div>
//               <Button variant="destructive" size="icon" onClick={() => deleteGoal(goal.id)}>
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </div>

//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span>
//                   Progress: {goal.current} / {goal.target} {goal.unit}
//                 </span>
//                 <span>{Math.round(calculateProgress(goal.current, goal.target))}%</span>
//               </div>
//               <Progress value={calculateProgress(goal.current, goal.target)} />

//               <Input
//                 type="number"
//                 value={goal.current}
//                 onChange={(e) => updateProgress(goal.id, Number(e.target.value))}
//                 className="mt-2"
//                 placeholder="Update progress"
//               />
//             </div>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }



"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
// import { fetchGoalsAction } from "@/actions/goal";
import { addGoalAction, updateGoalAction, deleteGoalAction, fetchGoalsAction } from "@/actions/goal"; // Corrected import path

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  category: "nutrition" | "fitness" | "health";
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: "",
    target: 0,
    unit: "",
    category: "nutrition" as const,
  });

  // Fetch goals on mount
  useEffect(() => {
    const loadGoals = async () => {
      try {
        const fetchedGoals = await fetchGoalsAction();
        setGoals(fetchedGoals);
      } catch (error: any) {
        toast.error(error.message || "Error fetching goals");
      }
    };
    loadGoals();
  }, []);

  // Add a new goal
  const addGoal = async () => {
    if (!newGoal.title || newGoal.target <= 0 || !newGoal.unit) {
      toast.error("Please fill in all fields with valid values");
      return;
    }

    try {
      const result = await addGoalAction({
        title: newGoal.title,
        target: newGoal.target,
        unit: newGoal.unit,
        category: newGoal.category,
      });

      setGoals([...goals, result]);
      setNewGoal({ title: "", target: 0, unit: "", category: "nutrition" });
      toast.success("Goal added successfully");
    } catch (error: any) {
      toast.error(error.message || "Error adding goal");
    }
  };

  // Update goal progress
  const updateProgress = async (goalId: string, value: number) => {
    if (value < 0) {
      toast.error("Progress cannot be negative");
      return;
    }

    try {
      const updatedGoal = await updateGoalAction(goalId, value);
      setGoals(goals.map((goal) => (goal.id === goalId ? { ...goal, current: updatedGoal.current } : goal)));
      toast.success("Goal progress updated");
    } catch (error: any) {
      toast.error(error.message || "Error updating goal progress");
    }
  };

  // Delete a goal
  const deleteGoal = async (goalId: string) => {
    try {
      await deleteGoalAction(goalId);
      setGoals(goals.filter((goal) => goal.id !== goalId));
      toast.success("Goal deleted");
    } catch (error: any) {
      toast.error(error.message || "Error deleting goal");
    }
  };

  // Calculate progress percentage
  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100); // Cap at 100%
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
              value={newGoal.target || ""}
              onChange={(e) => setNewGoal({ ...newGoal, target: Number(e.target.value) })}
              placeholder="Enter target amount"
              min="0"
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
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              className="w-full p-2 border rounded-md"
              value={newGoal.category}
              onChange={(e) =>
                setNewGoal({
                  ...newGoal,
                  category: e.target.value as "nutrition" | "fitness" | "health",
                })
              }
            >
              <option value="nutrition">Nutrition</option>
              <option value="fitness">Fitness</option>
              <option value="health">General Health</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <Button onClick={addGoal} className="w-full bg-[#2E8B57] hover:bg-[#236B43]">
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
                  Target: {goal.target} {goal.unit} ({goal.category})
                </p>
              </div>
              <Button variant="destructive" size="icon" onClick={() => deleteGoal(goal.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  Progress: {goal.current} / {goal.target} {goal.unit}
                </span>
                <span>{Math.round(calculateProgress(goal.current, goal.target))}%</span>
              </div>
              <Progress value={calculateProgress(goal.current, goal.target)} />
              <Input
                type="number"
                value={goal.current || ""}
                onChange={(e) => updateProgress(goal.id, Number(e.target.value))}
                className="mt-2"
                placeholder="Update progress"
                min="0"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}