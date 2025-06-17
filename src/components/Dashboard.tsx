
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bug } from "@/types/Bug";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Bug as BugIcon, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";

interface DashboardProps {
  bugs: Bug[];
}

const Dashboard = ({ bugs }: DashboardProps) => {
  const totalBugs = bugs.length;
  const openBugs = bugs.filter(bug => bug.status === 'Open').length;
  const inProgressBugs = bugs.filter(bug => bug.status === 'In Progress').length;
  const resolvedBugs = bugs.filter(bug => bug.status === 'Resolved').length;
  const closedBugs = bugs.filter(bug => bug.status === 'Closed').length;

  const criticalBugs = bugs.filter(bug => bug.severity === 'Critical').length;
  const highBugs = bugs.filter(bug => bug.severity === 'High').length;
  const mediumBugs = bugs.filter(bug => bug.severity === 'Medium').length;
  const lowBugs = bugs.filter(bug => bug.severity === 'Low').length;

  const severityData = [
    { name: 'Critical', value: criticalBugs, color: '#ef4444' },
    { name: 'High', value: highBugs, color: '#f97316' },
    { name: 'Medium', value: mediumBugs, color: '#eab308' },
    { name: 'Low', value: lowBugs, color: '#22c55e' }
  ].filter(item => item.value > 0);

  const statusData = [
    { name: 'Open', value: openBugs, color: '#3b82f6' },
    { name: 'In Progress', value: inProgressBugs, color: '#8b5cf6' },
    { name: 'Resolved', value: resolvedBugs, color: '#22c55e' },
    { name: 'Closed', value: closedBugs, color: '#6b7280' }
  ].filter(item => item.value > 0);

  const recentBugs = bugs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getSeverityColor = (severity: Bug['severity']) => {
    switch (severity) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Bug['status']) => {
    switch (status) {
      case 'Open': return <BugIcon className="h-4 w-4 text-blue-600" />;
      case 'In Progress': return <Clock className="h-4 w-4 text-purple-600" />;
      case 'Resolved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Closed': return <XCircle className="h-4 w-4 text-gray-600" />;
      default: return <BugIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">ทั้งหมด</CardTitle>
            <BugIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">{totalBugs}</div>
            <p className="text-xs text-blue-600">Bug ทั้งหมด</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">เปิดอยู่</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">{openBugs}</div>
            <p className="text-xs text-red-600">รอการแก้ไข</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">กำลังแก้ไข</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">{inProgressBugs}</div>
            <p className="text-xs text-orange-600">อยู่ระหว่างดำเนินการ</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">แก้ไขแล้ว</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">{resolvedBugs + closedBugs}</div>
            <p className="text-xs text-green-600">เสร็จสิ้นแล้ว</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bug ตามระดับความรุนแรง</CardTitle>
          </CardHeader>
          <CardContent>
            {severityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                ยังไม่มีข้อมูล Bug
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bug ตามสถานะ</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                ยังไม่มีข้อมูล Bug
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Bugs */}
      <Card>
        <CardHeader>
          <CardTitle>Bug ล่าสุด</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBugs.length > 0 ? (
            <div className="space-y-4">
              {recentBugs.map((bug) => (
                <div key={bug.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(bug.status)}
                    <div>
                      <div className="font-medium">{bug.title}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(bug.createdAt).toLocaleDateString('th-TH')}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getSeverityColor(bug.severity)}>
                      {bug.severity}
                    </Badge>
                    <Badge variant="outline">
                      {bug.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              ยังไม่มี Bug ที่แจ้ง
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
