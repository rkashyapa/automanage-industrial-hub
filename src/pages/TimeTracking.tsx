import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TimeEntryTab from "@/components/TimeTracking/TimeEntryTab";
import CostCalculationTab from "@/components/TimeTracking/CostCalculationTab";

const TimeTracking = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("time-entry");

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Time Tracking</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="time-entry" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Entry
            </TabsTrigger>
            <TabsTrigger value="cost-calculation" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Cost Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="time-entry" className="mt-6">
            <TimeEntryTab />
          </TabsContent>

          <TabsContent value="cost-calculation" className="mt-6">
            <CostCalculationTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TimeTracking;