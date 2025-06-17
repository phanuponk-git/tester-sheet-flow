
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Save, TestTube, AlertCircle, CheckCircle, ExternalLink, Settings } from "lucide-react";

interface GoogleSheetsConfigProps {
  onConnectionChange: (connected: boolean) => void;
}

const GoogleSheetsConfig = ({ onConnectionChange }: GoogleSheetsConfigProps) => {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const config = localStorage.getItem('google-sheets-config');
    if (config) {
      const { webhookUrl: savedUrl } = JSON.parse(config);
      setWebhookUrl(savedUrl);
      setIsConnected(true);
      onConnectionChange(true);
    }
  }, [onConnectionChange]);

  const handleSave = () => {
    if (!webhookUrl) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณากรอก Webhook URL",
        variant: "destructive",
      });
      return;
    }

    try {
      const config = { webhookUrl };
      localStorage.setItem('google-sheets-config', JSON.stringify(config));
      setIsConnected(true);
      onConnectionChange(true);
      
      toast({
        title: "บันทึกสำเร็จ!",
        description: "การตั้งค่า Google Sheets ถูกบันทึกแล้ว",
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกการตั้งค่าได้",
        variant: "destructive",
      });
    }
  };

  const handleTest = async () => {
    if (!webhookUrl) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณากรอก Webhook URL ก่อนทดสอบ",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    console.log("Testing webhook URL:", webhookUrl);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          title: 'ทดสอบการเชื่อมต่อ',
          description: 'นี่คือข้อมูลทดสอบจากระบบ Bug Reporter',
          severity: 'Medium',
          status: 'Open',
          url: 'https://example.com',
          browser: 'Chrome Test',
          steps: '1. เปิดระบบ\n2. ทดสอบการเชื่อมต่อ\n3. ตรวจสอบใน Google Sheets'
        }),
      });

      console.log("Response status:", response.status);
      
      if (response.status === 401) {
        toast({
          title: "ข้อผิดพลาด 401 Unauthorized",
          description: "กรุณาตรวจสอบการตั้งค่า Apps Script - ต้องเปลี่ยน 'Execute as' เป็น 'Me' และ 'Who has access' เป็น 'Anyone'",
          variant: "destructive",
        });
        return;
      }

      if (response.ok) {
        const result = await response.text();
        console.log("Success response:", result);
        toast({
          title: "ทดสอบสำเร็จ!",
          description: "เชื่อมต่อ Google Sheets ได้แล้ว กรุณาตรวจสอบข้อมูลใน Google Sheets",
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error details:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: `ไม่สามารถเชื่อมต่อได้: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('google-sheets-config');
    setWebhookUrl('');
    setIsConnected(false);
    onConnectionChange(false);
    
    toast({
      title: "ยกเลิกการเชื่อมต่อแล้ว",
      description: "การตั้งค่า Google Sheets ถูกลบแล้ว",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            การตั้งค่า Google Sheets
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
              {isConnected ? 'เชื่อมต่อแล้ว' : 'ยังไม่ได้เชื่อมต่อ'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>⚠️ สำคัญมาก - แก้ไขข้อผิดพลาด 401:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                <li>ใน Google Apps Script Editor</li>
                <li>คลิก <strong>Deploy → Manage deployments</strong></li>
                <li>คลิกไอคอน ✏️ (Edit) ของ deployment</li>
                <li>ตั้งค่า <strong>Execute as: Me</strong></li>
                <li>ตั้งค่า <strong>Who has access: Anyone</strong></li>
                <li>คลิก <strong>Done</strong> แล้ว <strong>Deploy</strong></li>
                <li>คัดลอก URL ใหม่มาใส่ด้านล่าง</li>
              </ol>
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>วิธีการตั้งค่า Google Sheets (ครั้งแรก):</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                <li>สร้าง Google Sheets ใหม่</li>
                <li>ไปที่ Extensions → Apps Script</li>
                <li>วางโค้ด Apps Script ด้านล่างแล้วบันทึก</li>
                <li>คลิก Deploy → New deployment</li>
                <li>เลือก Type เป็น Web app</li>
                <li><strong>Execute as: Me</strong> (สำคัญ!)</li>
                <li><strong>Who has access: Anyone</strong> (สำคัญ!)</li>
                <li>คลิก Deploy และคัดลอก URL</li>
              </ol>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="webhook-url">Google Sheets Webhook URL</Label>
            <Input
              id="webhook-url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              บันทึกการตั้งค่า
            </Button>
            <Button 
              variant="outline" 
              onClick={handleTest} 
              disabled={isTesting || !webhookUrl}
            >
              <TestTube className="h-4 w-4 mr-2" />
              {isTesting ? 'กำลังทดสอบ...' : 'ทดสอบ'}
            </Button>
            {isConnected && (
              <Button variant="destructive" onClick={handleDisconnect}>
                ยกเลิกการเชื่อมต่อ
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Google Apps Script Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm"><code>{`function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSheet();
    
    // Parse the JSON data
    var data = JSON.parse(e.postData.contents);
    
    // Check if this is the first row (add headers)
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 8).setValues([[
        'Timestamp', 'Title', 'Description', 'Severity', 
        'Status', 'URL', 'Browser', 'Steps'
      ]]);
      
      // Format headers
      var headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#f0f0f0');
    }
    
    // Add the bug data to the sheet
    sheet.appendRow([
      new Date(data.timestamp),
      data.title || '',
      data.description || '',
      data.severity || '',
      data.status || '',
      data.url || '',
      data.browser || '',
      data.steps || ''
    ]);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, 8);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        result: 'success', 
        message: 'Data added successfully',
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        result: 'error', 
        error: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`}</code></pre>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            คัดลอกโค้ดนี้ไปวางใน Google Apps Script Editor และบันทึกด้วยชื่อ "doPost"
          </p>
        </CardContent>
      </Card>

      {isConnected && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <div>
                <div className="font-medium">เชื่อมต่อ Google Sheets สำเร็จ!</div>
                <div className="text-sm">Bug ที่แจ้งใหม่จะถูกส่งไปยัง Google Sheets โดยอัตโนมัติ</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoogleSheetsConfig;
