"use client";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    gender: "",
    allergies: [] as string[],
    chronicDiseases: [] as string[],
    dietaryPreferences: [] as string[],
  });

  const [newAllergy, setNewAllergy] = useState("");
  const [newDietaryPreference, setNewDietaryPreference] = useState("");
  const [customDisease, setCustomDisease] = useState(""); // For "Other" input
  const [showCustomDisease, setShowCustomDisease] = useState(false);

  const chronicDiseasesList = [
    "Diabetes",
    "Hypertension",
    "Heart Disease",
    "Celiac Disease",
    "Lactose Intolerance",
    "Other",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile saved!");
  };

  const addItem = (key: keyof typeof profile, value: string) => {
    if (value.trim() && !profile[key].includes(value.trim())) {
      setProfile({ ...profile, [key]: [...profile[key], value.trim()] });
      toast.success(`${key.replace(/([A-Z])/g, " $1")} added`);
    }
  };

  const removeItem = (key: keyof typeof profile, value: string) => {
    setProfile({ ...profile, [key]: profile[key].filter((item) => item !== value) });
    toast.success(`${key.replace(/([A-Z])/g, " $1")} removed`);
  };

  const toggleChronicDisease = (disease: string) => {
    if (disease === "Other") {
      setShowCustomDisease(!showCustomDisease);
    } else {
      setProfile({
        ...profile,
        chronicDiseases: profile.chronicDiseases.includes(disease)
          ? profile.chronicDiseases.filter((d) => d !== disease)
          : [...profile.chronicDiseases, disease],
      });
    }
  };

  const addCustomDisease = () => {
    if (customDisease.trim() && !profile.chronicDiseases.includes(customDisease.trim())) {
      setProfile({ ...profile, chronicDiseases: [...profile.chronicDiseases, customDisease.trim()] });
      setCustomDisease("");
      setShowCustomDisease(false);
      toast.success("Chronic disease added");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["name", "age", "weight", "height"].map((field) => (
                <div className="space-y-2" key={field}>
                  <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                  <Input
                    id={field}
                    type={field === "age" || field === "weight" || field === "height" ? "number" : "text"}
                    value={profile[field]}
                    onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
                    placeholder={`Enter your ${field}`}
                  />
                </div>
              ))}
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={profile.gender} onValueChange={(value) => setProfile({ ...profile, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Health Information</h2>
            <Accordion type="single" collapsible className="w-full">
              {/* Allergies */}
              <AccordionItem value="allergies">
                <AccordionTrigger>Allergies</AccordionTrigger>
                <AccordionContent>
                  <div className="flex gap-2">
                    <Input value={newAllergy} onChange={(e) => setNewAllergy(e.target.value)} placeholder="Add allergy" />
                    <Button type="button" onClick={() => addItem("allergies", newAllergy)} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.allergies.map((allergy) => (
                      <div key={allergy} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                        {allergy}
                        <button type="button" onClick={() => removeItem("allergies", allergy)}>
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Chronic Diseases */}
              <AccordionItem value="chronic-diseases">
                <AccordionTrigger>Chronic Diseases</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2">
                    {chronicDiseasesList.map((disease) => (
                      <div key={disease} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={disease}
                          checked={profile.chronicDiseases.includes(disease)}
                          onChange={() => toggleChronicDisease(disease)}
                        />
                        <label htmlFor={disease}>{disease}</label>
                      </div>
                    ))}
                  </div>
                  {showCustomDisease && (
                    <div className="mt-4 flex gap-2">
                      <Input value={customDisease} onChange={(e) => setCustomDisease(e.target.value)} placeholder="Enter custom disease" />
                      <Button type="button" onClick={addCustomDisease} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          <Button type="submit" className="w-full bg-[#2E8B57] hover:bg-[#236B43]" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
