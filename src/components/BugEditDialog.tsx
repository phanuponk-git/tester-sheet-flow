
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bug } from "@/types/Bug";
import { Save, X } from "lucide-react";

interface BugEditDialogProps {
  bug: Bug;
  onSave: (bug: Bug) => void;
  onCancel: () => void;
}

const BugEditDialog = ({ bug, onSave, onCancel }: BugEditDialogProps) => {
  const [formData, setFormData] = useState(bug);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    onSave(formData);
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>แก้ไข Bug</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">หัวข้อ Bug</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="หัวข้อ Bug"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">รายละเอียด</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="รายละเอียด Bug"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-steps">ขั้นตอนการทำซ้ำ</Label>
            <Textarea
              id="edit-steps"
              value={formData.steps || ''}
              onChange={(e) => setFormData({...formData, steps: e.target.value})}
              placeholder="ขั้นตอนการทำซ้ำ"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-url">URL</Label>
              <Input
                id="edit-url"
                value={formData.url || ''}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                placeholder="URL ที่พบ Bug"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-browser">Browser</Label>
              <Input
                id="edit-browser"
                value={formData.browser || ''}
                onChange={(e) => setFormData({...formData, browser: e.target.value})}
                placeholder="Browser ที่ใช้"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ความรุนแรง</Label>
              <Select value={formData.severity} onValueChange={(value: Bug['severity']) => setFormData({...formData, severity: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>สถานะ</Label>
              <Select value={formData.status} onValueChange={(value: Bug['status']) => setFormData({...formData, status: value})}>
                <SelectTrigger>
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
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              บันทึก
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              ยกเลิก
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BugEditDialog;
