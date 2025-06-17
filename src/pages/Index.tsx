
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bug, BarChart3, FileText, Settings } from "lucide-react";
import BugReportForm from "@/components/BugReportForm";
import BugList from "@/components/BugList";
import Dashboard from "@/components/Dashboard";
import GoogleSheetsConfig from "@/components/GoogleSheetsConfig";
import { Bug as BugType } from "@/types/Bug";

const Index = () => {
  const [bugs, setBugs] = useState<BugType[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Load bugs from localStorage on component mount
    const savedBugs = localStorage.getItem('tester-bugs');
    if (savedBugs) {
      setBugs(JSON.parse(savedBugs));
    }

    // Check Google Sheets connection
    const sheetsConfig = localStorage.getItem('google-sheets-config');
    setIsConnected(!!sheetsConfig);
  }, []);

  const addBug = (newBug: Omit<BugType, 'id' | 'createdAt'>) => {
    const bug: BugType = {
      ...newBug,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    const updatedBugs = [...bugs, bug];
    setBugs(updatedBugs);
    localStorage.setItem('tester-bugs', JSON.stringify(updatedBugs));
    
    // Send to Google Sheets if connected
    if (isConnected) {
      sendToGoogleSheets(bug);
    }
  };

  const updateBug = (updatedBug: BugType) => {
    const updatedBugs = bugs.map(bug => 
      bug.id === updatedBug.id ? updatedBug : bug
    );
    setBugs(updatedBugs);
    localStorage.setItem('tester-bugs', JSON.stringify(updatedBugs));
  };

  const deleteBug = (bugId: string) => {
    const updatedBugs = bugs.filter(bug => bug.id !== bugId);
    setBugs(updatedBugs);
    localStorage.setItem('tester-bugs', JSON.stringify(updatedBugs));
  };

  const sendToGoogleSheets = async (bug: BugType) => {
    const config = localStorage.getItem('google-sheets-config');
    if (!config) return;

    try {
      const { webhookUrl } = JSON.parse(config);
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          timestamp: bug.createdAt,
          title: bug.title,
          description: bug.description,
          severity: bug.severity,
          status: bug.status,
          url: bug.url,
          browser: bug.browser,
          steps: bug.steps
        }),
      });
      console.log('Bug sent to Google Sheets:', bug.title);
    } catch (error) {
      console.error('Failed to send to Google Sheets:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-orange-500">
              <Bug className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
              Tester Bug Reporter
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            ระบบแจ้ง Bug สำหรับ Tester - เชื่อมต่อกับ Google Sheets
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
              {isConnected ? 'เชื่อมต่อ Google Sheets แล้ว' : 'ยังไม่ได้เชื่อมต่อ Google Sheets'}
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-2">
              <Bug className="h-4 w-4" />
              แจ้ง Bug
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              รายการ Bug
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              ตั้งค่า
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard bugs={bugs} />
          </TabsContent>

          <TabsContent value="report">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="h-5 w-5" />
                  แจ้ง Bug ใหม่
                </CardTitle>
                <CardDescription>
                  กรอกรายละเอียด Bug ที่พบเจอ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BugReportForm onSubmit={addBug} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list">
            <BugList 
              bugs={bugs} 
              onUpdate={updateBug} 
              onDelete={deleteBug} 
            />
          </TabsContent>

          <TabsContent value="settings">
            <GoogleSheetsConfig 
              onConnectionChange={(connected) => setIsConnected(connected)} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
