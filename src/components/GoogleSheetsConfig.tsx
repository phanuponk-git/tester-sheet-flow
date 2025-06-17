
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

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
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

      toast({
        title: "ส่งข้อมูลทดสอบแล้ว",
        description: "กรุณาตรวจสอบใน Google Sheets ว่าได้รับข้อมูลหรือไม่",
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งข้อมูลทดสอบได้",
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
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>วิธีการตั้งค่า Google Sheets:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                <li>สร้าง Google Sheets ใหม่</li>
                <li>ไปที่ Extensions → Apps Script</li>
                <li>วางโค้ด Apps Script ด้านล่างแล้วบันทึก</li>
                <li>คลิก Deploy → New deployment</li>
                <li>เลือก Type เป็น Web app</li>
                <li>ตั้งค่า Execute as: Me, Who has access: Anyone</li>
                <li>คัดลอก Web app URL มาใส่ด้านล่าง</li>
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
    }
    
    // Add the bug data to the sheet
    sheet.appendRow([
      new Date(data.timestamp),
      data.title,
      data.description,
      data.severity,
      data.status,
      data.url || '',
      data.browser || '',
      data.steps || ''
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({result: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({result: 'error', error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`}</code></pre>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            คัดลอกโค้ดนี้ไปวางใน Google Apps Script Editor
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
