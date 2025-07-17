import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, FileDown, Calendar } from "lucide-react";

interface Engineer {
  name: string;
  hours: { [key: string]: number };
}

const TimeEntryTab = () => {
  const [weeks, setWeeks] = useState(["Week 1", "Week 2", "Week 3"]);
  const [engineers, setEngineers] = useState<Engineer[]>([
    { name: "John Smith", hours: { "Week 1": 20, "Week 2": 30, "Week 3": 0 } },
    { name: "Sarah Johnson", hours: { "Week 1": 25, "Week 2": 28, "Week 3": 0 } },
    { name: "Mike Davis", hours: { "Week 1": 15, "Week 2": 20, "Week 3": 0 } }
  ]);

  const addWeek = () => {
    const newWeek = `Week ${weeks.length + 1}`;
    setWeeks([...weeks, newWeek]);
    setEngineers(engineers.map(eng => ({
      ...eng,
      hours: { ...eng.hours, [newWeek]: 0 }
    })));
  };

  const addEngineer = () => {
    const newEngineer: Engineer = {
      name: `Engineer ${engineers.length + 1}`,
      hours: weeks.reduce((acc, week) => ({ ...acc, [week]: 0 }), {} as { [key: string]: number })
    };
    setEngineers([...engineers, newEngineer]);
  };

  const updateHours = (engineerIndex: number, week: string, hours: number) => {
    const updatedEngineers = [...engineers];
    updatedEngineers[engineerIndex].hours[week] = hours;
    setEngineers(updatedEngineers);
  };

  const getEngineerTotal = (engineer: Engineer) => {
    return Object.values(engineer.hours).reduce((sum: number, hours: number) => sum + (hours || 0), 0);
  };

  const getWeekTotal = (week: string) => {
    return engineers.reduce((sum, engineer) => sum + (engineer.hours[week] || 0), 0);
  };

  const getTotalHours = () => {
    return engineers.reduce((sum, engineer) => sum + getEngineerTotal(engineer), 0);
  };

  return (
    <div className="space-y-6">
      {/* Project Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Project Name</label>
              <p className="font-semibold">Vision System Integration</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Project ID</label>
              <p className="font-semibold">PRJ-2024-001</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Client</label>
              <p className="font-semibold">TechCorp Industries</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Deadline</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="font-semibold">Dec 31, 2024</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Entry Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Time Entry & Man-Hour Tracking</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileDown className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Engineer Name</th>
                  {weeks.map((week) => (
                    <th key={week} className="text-center p-3 font-semibold min-w-24">
                      {week}
                    </th>
                  ))}
                  <th className="text-center p-3 font-semibold">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addWeek}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </th>
                  <th className="text-center p-3 font-semibold bg-muted">Total</th>
                </tr>
              </thead>
              <tbody>
                {engineers.map((engineer, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{engineer.name}</td>
                    {weeks.map((week) => (
                      <td key={week} className="p-3 text-center">
                        <Input
                          type="number"
                          value={engineer.hours[week] || 0}
                          onChange={(e) => updateHours(index, week, parseInt(e.target.value) || 0)}
                          className="w-16 text-center"
                          min="0"
                        />
                      </td>
                    ))}
                    <td className="p-3 text-center">
                      <Badge variant="secondary">
                        {getEngineerTotal(engineer)}h
                      </Badge>
                    </td>
                  </tr>
                ))}
                <tr className="border-b bg-muted/30">
                  <td className="p-3 font-semibold">Weekly Total</td>
                  {weeks.map((week) => (
                    <td key={week} className="p-3 text-center">
                      <Badge variant="outline">
                        {getWeekTotal(week)}h
                      </Badge>
                    </td>
                  ))}
                  <td className="p-3 text-center">
                    <Badge variant="default">
                      {getTotalHours()}h
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <Button variant="outline" onClick={addEngineer}>
              <Plus className="h-4 w-4 mr-2" />
              Add Engineer
            </Button>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Project Hours</p>
              <p className="text-2xl font-bold text-primary">{getTotalHours()} hours</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle>Project Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Total Engineers</p>
              <p className="text-2xl font-bold">{engineers.length}</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Active Weeks</p>
              <p className="text-2xl font-bold">{weeks.length}</p>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Average Hours/Week</p>
              <p className="text-2xl font-bold text-primary">
                {weeks.length > 0 ? (getTotalHours() / weeks.length).toFixed(1) : 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeEntryTab;