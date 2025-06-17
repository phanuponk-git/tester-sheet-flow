
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bug } from "@/types/Bug";
import { Trash2, Edit, Search, Filter, Calendar, Globe, Monitor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BugEditDialog from "./BugEditDialog";

interface BugListProps {
  bugs: Bug[];
  onUpdate: (bug: Bug) => void;
  onDelete: (bugId: string) => void;
}

const BugList = ({ bugs, onUpdate, onDelete }: BugListProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [editingBug, setEditingBug] = useState<Bug | null>(null);

  const handleDelete = (bugId: string, bugTitle: string) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ที่จะลบ Bug: "${bugTitle}"?`)) {
      onDelete(bugId);
      toast({
        title: "ลบ Bug สำเร็จ",
        description: `Bug "${bugTitle}" ถูกลบแล้ว`,
      });
    }
  };

  const filteredBugs = bugs.filter(bug => {
    const matchesSearch = bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bug.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bug.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || bug.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getSeverityColor = (severity: Bug['severity']) => {
    switch (severity) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Critical': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: Bug['status']) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'In Progress': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-300';
      case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            ค้นหาและกรอง
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ค้นหา Bug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="กรองตามสถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกสถานะ</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="กรองตามความรุนแรง" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกระดับ</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bug List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            พบ {filteredBugs.length} Bug จากทั้งหมด {bugs.length} Bug
          </h3>
        </div>

        {filteredBugs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-500">
                {bugs.length === 0 ? 'ยังไม่มี Bug ที่แจ้ง' : 'ไม่พบ Bug ที่ตรงกับเงื่อนไขการค้นหา'}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredBugs.map((bug) => (
            <Card key={bug.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-2">{bug.title}</h4>
                    <p className="text-gray-600 mb-3">{bug.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className={getSeverityColor(bug.severity)}>
                        {bug.severity}
                      </Badge>
                      <Badge className={getStatusColor(bug.status)}>
                        {bug.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                      {bug.url && (
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          <a href={bug.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 truncate">
                            {bug.url}
                          </a>
                        </div>
                      )}
                      {bug.browser && (
                        <div className="flex items-center gap-1">
                          <Monitor className="h-4 w-4" />
                          {bug.browser}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(bug.createdAt).toLocaleDateString('th-TH')}
                      </div>
                    </div>

                    {bug.steps && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-sm mb-1">ขั้นตอนการทำซ้ำ:</div>
                        <pre className="text-sm text-gray-600 whitespace-pre-wrap">{bug.steps}</pre>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingBug(bug)}
                      className="hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(bug.id, bug.title)}
                      className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      {editingBug && (
        <BugEditDialog
          bug={editingBug}
          onSave={(updatedBug) => {
            onUpdate(updatedBug);
            setEditingBug(null);
            toast({
              title: "แก้ไข Bug สำเร็จ",
              description: `Bug "${updatedBug.title}" ถูกแก้ไขแล้ว`,
            });
          }}
          onCancel={() => setEditingBug(null)}
        />
      )}
    </div>
  );
};

export default BugList;
