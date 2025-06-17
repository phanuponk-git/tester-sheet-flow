
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Bug } from "@/types/Bug";
import { useToast } from "@/hooks/use-toast";
import { Send, AlertTriangle } from "lucide-react";

interface BugReportFormProps {
  onSubmit: (bug: Omit<Bug, 'id' | 'createdAt'>) => void;
}

const BugReportForm = ({ onSubmit }: BugReportFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'Medium' as Bug['severity'],
    status: 'Open' as Bug['status'],
    url: '',
    browser: '',
    steps: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกหัวข้อและรายละเอียด Bug",
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      severity: 'Medium',
      status: 'Open',
      url: '',
      browser: '',
      steps: ''
    });

    toast({
      title: "แจ้ง Bug สำเร็จ!",
      description: "Bug ถูกบันทึกแล้ว และส่งไปยัง Google Sheets (หากเชื่อมต่อแล้ว)",
    });
  };

  const severityColors = {
    Low: "text-green-600 bg-green-50",
    Medium: "text-yellow-600 bg-yellow-50", 
    High: "text-orange-600 bg-orange-50",
    Critical: "text-red-600 bg-red-50"
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            หัวข้อ Bug <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="เช่น ปุ่ม Login ไม่ทำงาน"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="url" className="text-sm font-medium">URL ที่พบ Bug</Label>
          <Input
            id="url"
            value={formData.url}
            onChange={(e) => setFormData({...formData, url: e.target.value})}
            placeholder="https://example.com/page"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          รายละเอียด Bug <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="อธิบายรายละเอียด Bug ที่พบ..."
          rows={4}
          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="steps" className="text-sm font-medium">ขั้นตอนการทำซ้ำ</Label>
        <Textarea
          id="steps"
          value={formData.steps}
          onChange={(e) => setFormData({...formData, steps: e.target.value})}
          placeholder="1. เข้าหน้า Login&#10;2. กรอก username/password&#10;3. คลิกปุ่ม Login&#10;4. ไม่มีการตอบสนอง"
          rows={3}
          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">ความรุนแรง</Label>
          <Select value={formData.severity} onValueChange={(value: Bug['severity']) => setFormData({...formData, severity: value})}>
            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Low
                </div>
              </SelectItem>
              <SelectItem value="Medium">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  Medium
                </div>
              </SelectItem>
              <SelectItem value="High">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  High
                </div>
              </SelectItem>
              <SelectItem value="Critical">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  Critical
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">สถานะ</Label>
          <Select value={formData.status} onValueChange={(value: Bug['status']) => setFormData({...formData, status: value})}>
            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="browser" className="text-sm font-medium">Browser</Label>
          <Input
            id="browser"
            value={formData.browser}
            onChange={(e) => setFormData({...formData, browser: e.target.value})}
            placeholder="เช่น Chrome 120.0.0"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <Card className={`p-4 border-l-4 ${severityColors[formData.severity]} border-l-current`}>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span className="font-medium">ตัวอย่างการแสดงผลใน Google Sheet</span>
        </div>
        <div className="text-sm mt-2 opacity-80">
          หัวข้อ: {formData.title || "หัวข้อ Bug"} | ความรุนแรง: {formData.severity} | สถานะ: {formData.status}
        </div>
      </Card>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105"
        size="lg"
      >
        <Send className="h-4 w-4 mr-2" />
        แจ้ง Bug
      </Button>
    </form>
  );
};

export default BugReportForm;
