
"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

export default function RecipesPage() {
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState('');
  const [formData, setFormData] = useState({
    ingredients: '',
    mealType: '',
    cuisine: '',
    cookingTime: '',
    complexity: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setRecipe('');

  try {
    const response = await axios.post('/api/recipe', formData, {
      headers: { 'Content-Type': 'application/json' },
    });

    setRecipe(response.data.recipe);
    toast.success('Recipe generated successfully!');
  } catch (error) {
    toast.error('Failed to generate recipe. Please try again.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Recipe Generator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients</Label>
              <Input
                id="ingredients"
                placeholder="Enter ingredients"
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mealType">Meal Type</Label>
              <Input
                id="mealType"
                placeholder="e.g., Breakfast, Lunch, Dinner"
                value={formData.mealType}
                onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cuisine">Cuisine</Label>
              <Input
                id="cuisine"
                placeholder="e.g., Italian, Indian, Mexican"
                value={formData.cuisine}
                onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cookingTime">Cooking Time</Label>
              <Input
                id="cookingTime"
                placeholder="e.g., 30 minutes, 1 hour"
                value={formData.cookingTime}
                onChange={(e) => setFormData({ ...formData, cookingTime: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complexity">Complexity</Label>
              <Input
                id="complexity"
                placeholder="e.g., Easy, Medium, Hard"
                value={formData.complexity}
                onChange={(e) => setFormData({ ...formData, complexity: e.target.value })}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#2E8B57] hover:bg-[#236B43]"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Recipe
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Recipe</h2>
          <div className="prose max-w-none">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#2E8B57]" />
              </div>
            ) : recipe ? (
              <div className="whitespace-pre-line">{recipe}</div>
            ) : (
              <p className="text-muted-foreground">
                Your generated recipe will appear here...
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}


// "use client";

// import { useState } from 'react';
// import { Card } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';
// import { Loader2 } from 'lucide-react';
// import axios from 'axios';

// export default function RecipesPage() {
//   const [loading, setLoading] = useState(false);
//   const [recipe, setRecipe] = useState('');
//   const [formData, setFormData] = useState({
//     ingredients: '',
//     mealType: '',
//     cuisine: '',
//     cookingTime: '',
//     complexity: ''
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setRecipe('');

//     try {
//       const response = await axios.post('/api/recipe', formData, {
//         headers: { 'Content-Type': 'application/json' },
//       });

//       if (response.data.recipe) {
//         setRecipe(response.data.recipe);
//         toast.success('Recipe generated successfully!');
//       } else {
//         throw new Error('No recipe generated.');
//       }
//     } catch (error) {
//       toast.error('Failed to generate recipe. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-8 max-w-6xl mx-auto">
//       <h1 className="text-3xl font-bold mb-8">Recipe Generator</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <Card className="p-6">
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="ingredients">Ingredients</Label>
//               <Input
//                 id="ingredients"
//                 placeholder="Enter ingredients"
//                 value={formData.ingredients}
//                 onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="mealType">Meal Type</Label>
//               <Input
//                 id="mealType"
//                 placeholder="e.g., Breakfast, Lunch, Dinner"
//                 value={formData.mealType}
//                 onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="cuisine">Cuisine</Label>
//               <Input
//                 id="cuisine"
//                 placeholder="e.g., Italian, Indian, Mexican"
//                 value={formData.cuisine}
//                 onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="cookingTime">Cooking Time</Label>
//               <Input
//                 id="cookingTime"
//                 placeholder="e.g., 30 minutes, 1 hour"
//                 value={formData.cookingTime}
//                 onChange={(e) => setFormData({ ...formData, cookingTime: e.target.value })}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="complexity">Complexity</Label>
//               <Input
//                 id="complexity"
//                 placeholder="e.g., Easy, Medium, Hard"
//                 value={formData.complexity}
//                 onChange={(e) => setFormData({ ...formData, complexity: e.target.value })}
//               />
//             </div>

//             <Button 
//               type="submit" 
//               className="w-full bg-[#2E8B57] hover:bg-[#236B43]"
//               disabled={loading}
//             >
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Generate Recipe
//             </Button>
//           </form>
//         </Card>

//         <Card className="p-6">
//           <h2 className="text-xl font-semibold mb-4">Generated Recipe</h2>
//           <div className="prose max-w-none">
//             {loading ? (
//               <div className="flex items-center justify-center h-64">
//                 <Loader2 className="h-8 w-8 animate-spin text-[#2E8B57]" />
//               </div>
//             ) : recipe ? (
//               <div className="whitespace-pre-line">{recipe}</div>
//             ) : (
//               <p className="text-muted-foreground">
//                 Your generated recipe will appear here...
//               </p>
//             )}
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// }




// "use client";

// import { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";
// import axios from "axios";

// export default function RecipesPage() {
//   const [loading, setLoading] = useState(false);
//   const [recipe, setRecipe] = useState<string>("");
//   const [formData, setFormData] = useState({
//     ingredients: "",
//     mealType: "",
//     cuisine: "",
//     cookingTime: "",
//     complexity: "",
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setRecipe("");

//     // Validate inputs
//     const { ingredients, mealType, cuisine, cookingTime, complexity } = formData;
//     if (!ingredients || !mealType || !cuisine || !cookingTime || !complexity) {
//       toast.error("Please fill in all fields");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post("/api/recipe", formData, {
//         headers: { "Content-Type": "application/json" },
//       });

//       setRecipe(response.data.recipe);
//       toast.success("Recipe generated and saved successfully!");
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.error || "Failed to generate recipe. Please try again.";
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   return (
//     <div className="p-8 max-w-6xl mx-auto">
//       <h1 className="text-3xl font-bold mb-8">Recipe Generator</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <Card className="p-6">
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="ingredients">Ingredients</Label>
//               <Input
//                 id="ingredients"
//                 placeholder="e.g., chicken, rice, tomatoes"
//                 value={formData.ingredients}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="mealType">Meal Type</Label>
//               <Input
//                 id="mealType"
//                 placeholder="e.g., Breakfast, Lunch, Dinner"
//                 value={formData.mealType}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="cuisine">Cuisine</Label>
//               <Input
//                 id="cuisine"
//                 placeholder="e.g., Italian, Indian, Mexican"
//                 value={formData.cuisine}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="cookingTime">Cooking Time</Label>
//               <Input
//                 id="cookingTime"
//                 placeholder="e.g., 30 minutes, 1 hour"
//                 value={formData.cookingTime}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="complexity">Complexity</Label>
//               <Input
//                 id="complexity"
//                 placeholder="e.g., Easy, Medium, Hard"
//                 value={formData.complexity}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <Button
//               type="submit"
//               className="w-full bg-[#2E8B57] hover:bg-[#236B43]"
//               disabled={loading}
//             >
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Generate Recipe
//             </Button>
//           </form>
//         </Card>

//         <Card className="p-6">
//           <h2 className="text-xl font-semibold mb-4">Generated Recipe</h2>
//           <div className="prose max-w-none">
//             {loading ? (
//               <div className="flex items-center justify-center h-64">
//                 <Loader2 className="h-8 w-8 animate-spin text-[#2E8B57]" />
//               </div>
//             ) : recipe ? (
//               <div className="whitespace-pre-line">{recipe}</div>
//             ) : (
//               <p className="text-muted-foreground">
//                 Your generated recipe will appear here...
//               </p>
//             )}
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// }