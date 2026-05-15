'use client';

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  TestTube,
  Beaker,
  Activity,
  X,
  Check,
  ClipboardList,
  FlaskConical,
  Settings2,
  AlertCircle,
  FileSpreadsheet,
  Info
} from 'lucide-react';
import { 
  useLabTestsSearch, 
  useCreateLabTest, 
  useUpdateLabTest,
  useBulkUploadLabTests,
  useExportLabTests 
} from '@/modules/lab-tests/hooks';
import type { LabTest } from '@/modules/lab-tests/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/shared/lib/utils';
import { useRef } from 'react';
import { Upload, Download, FileText, FileDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

export default function AdminLabTestsPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [editingTest, setEditingTest] = useState<LabTest | null>(null);
  const limit = 10;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: labTestsData, isLoading, error } = useLabTestsSearch({
    q: query,
    page,
    limit,
  });

  const createMutation = useCreateLabTest();
  const updateMutation = useUpdateLabTest();
  const bulkUploadMutation = useBulkUploadLabTests();
  const exportMutation = useExportLabTests();

  const handleExportData = async () => {
    try {
      const blob = await exportMutation.mutateAsync();
      const url = window.URL.createObjectURL(blob as Blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'lab_tests_directory.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Directory exported successfully!');
    } catch (err) {
      console.error('Export failed:', err);
      toast.error('Failed to export data.');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setUploadError('Please select a valid CSV file.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleBulkUploadExecute = async () => {
    if (!selectedFile) return;

    try {
      const result = await bulkUploadMutation.mutateAsync(selectedFile);
      toast.success('Bulk upload completed successfully!', {
        description: `Created: ${result.data.successCount} | Skipped: ${result.data.skippedCount}`,
      });
      handleCloseBulkModal();
    } catch (err: unknown) {
      console.error('Bulk upload failed:', err);
      let errorMessage = 'An unexpected error occurred during upload.';
      if (err instanceof Error) {
        const errorWithResponse = err as { response?: { data?: { message?: string } } };
        errorMessage = errorWithResponse.response?.data?.message || err.message;
      }
      setUploadError(errorMessage);
    }
  };

  const handleCloseBulkModal = () => {
    setIsBulkModalOpen(false);
    setSelectedFile(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadSampleCSV = () => {
    const headers = 'name,slug,shortName,category,description,specimen,preparation,normalRange,unit,isActive,metadata';
    const sampleRow = 'Complete Blood Count,complete-blood-count,CBC,BLOOD,"Evaluates red cells, white cells, hemoglobin, and platelets.",Blood,No special preparation needed,Varies by parameter,,True,"{""department"": ""Pathology""}"';
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${sampleRow}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'lab_tests_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadGuidelinesPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;

    // Title
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Lab Test Bulk Upload Guidelines', margin, y);
    y += 15;

    // Introduction
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Follow these rules strictly to ensure your bulk upload is successful.', margin, y);
    y += 15;

    // Rule 1: File Format
    doc.setFont('helvetica', 'bold');
    doc.text('1. File Format:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text('Only .csv (Comma Separated Values) files are supported.', margin + 35, y);
    y += 10;

    // Rule 2: Headers
    doc.setFont('helvetica', 'bold');
    doc.text('2. Required Headers:', margin, y);
    y += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('name, slug, shortName, category, description, specimen, preparation, normalRange, unit, isActive, metadata', margin + 5, y);
    y += 10;

    // Rule 3: Column Rules
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('3. Column Specific Rules:', margin, y);
    y += 10;

    const rules = [
      { col: 'name', rule: 'Required. Must be unique. If name exists, record will be skipped.' },
      { col: 'slug', rule: 'Optional. Unique URL identifier. If empty, auto-generated from name.' },
      { col: 'isActive', rule: 'Boolean. Use "True" or "False". Default is True.' },
      { col: 'metadata', rule: 'Optional. Must be a valid JSON string, e.g., {"key": "value"}.' },
      { col: 'Other cols', rule: 'Text fields. Can be empty.' },
    ];

    doc.setFontSize(10);
    rules.forEach((item) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`• ${item.col}:`, margin + 5, y);
      doc.setFont('helvetica', 'normal');
      doc.text(item.rule, margin + 40, y);
      y += 8;
    });

    y += 5;
    // Rule 4: Duplicates
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('4. Duplicate Handling:', margin, y);
    doc.setFont('helvetica', 'normal');
    y += 7;
    doc.text('If a lab test with the same name already exists in the database, the system will', margin + 5, y);
    y += 6;
    doc.text('automatically skip that record and continue with the rest of the file.', margin + 5, y);
    y += 15;

    // Rule 5: Encoding
    doc.setFont('helvetica', 'bold');
    doc.text('5. Encoding:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text('Ensure the file is saved with UTF-8 encoding to support special characters.', margin + 35, y);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Medicine Hub Administrative Documentation v1.0', margin, 280);

    doc.save('lab_test_upload_rules.pdf');
  };

  if (error) {
    return (
      <div className="p-12 border-2 border-dashed border-destructive/20 rounded-3xl bg-destructive/5 text-center">
        <h2 className="text-xl font-bold text-destructive">Failed to load lab tests</h2>
        <p className="text-muted-foreground mt-2">Please check if the backend server is running and try again.</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10">
          Retry
        </Button>
      </div>
    );
  }

  const handleOpenAddModal = () => {
    setEditingTest(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (test: LabTest) => {
    setEditingTest(test);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTest(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: Partial<LabTest> = {
      name: formData.get('name') as string,
      shortName: formData.get('shortName') as string,
      category: formData.get('category') as string,
      specimen: formData.get('specimen') as string,
      preparation: formData.get('preparation') as string,
      normalRange: formData.get('normalRange') as string,
      unit: formData.get('unit') as string,
      description: formData.get('description') as string,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      if (editingTest) {
        await updateMutation.mutateAsync({ id: editingTest.id, data });
        toast.success('Lab test updated successfully!');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Lab test created successfully!');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save lab test:', error);
      toast.error('Failed to save lab test. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-primary flex items-center gap-3">
            <TestTube className="h-8 w-8 text-primary/40" />
            Lab Test Management
          </h1>
          <p className="text-muted-foreground font-medium mt-1">Manage the clinical lab test directory and normal ranges.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            onClick={downloadGuidelinesPDF}
            className="rounded-full px-6 border-primary/10 hover:bg-primary/5 text-xs font-bold transition-all active:scale-95 text-emerald-600"
          >
            <FileText className="w-4 h-4 mr-2" />
            Upload Rules (PDF)
          </Button>

          <Button 
            variant="outline"
            onClick={downloadSampleCSV}
            className="rounded-full px-6 border-primary/10 hover:bg-primary/5 text-xs font-bold transition-all active:scale-95"
          >
            <Download className="w-4 h-4 mr-2" />
            Sample CSV
          </Button>
          <Button 
            variant="outline"
            onClick={handleExportData}
            disabled={exportMutation.isPending}
            className="rounded-full px-6 border-primary/10 hover:bg-primary/5 text-xs font-bold transition-all active:scale-95"
          >
            {exportMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4 mr-2" />
            )}
            Export Data (CSV)
          </Button>

          <Button 
            variant="outline"
            onClick={() => setIsBulkModalOpen(true)}
            className="rounded-full px-6 border-primary/10 hover:bg-primary/5 text-xs font-bold transition-all active:scale-95"
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>

          <Button 
            onClick={handleOpenAddModal}
            className="rounded-full px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Test
          </Button>
        </div>
      </div>

      <Card className="p-2 border-primary/5 bg-white/50 backdrop-blur-xl shadow-2xl shadow-primary/5 rounded-3xl">
        <div className="p-4 border-b border-primary/5 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by test name, category or specimen..." 
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="pl-11 bg-muted/30 border-none rounded-2xl focus-visible:ring-primary/20 h-12 text-base"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-primary/5">
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Test Details</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Specimen</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Normal Range</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <div className="h-4 bg-muted rounded w-48" />
                        <div className="h-3 bg-muted rounded w-24" />
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-32" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-32" /></td>
                    <td className="px-6 py-4"><div className="h-8 bg-muted rounded w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : labTestsData?.data?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Beaker className="h-12 w-12 text-muted-foreground/20" />
                      <p className="text-muted-foreground font-medium">No lab tests found matching your search.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                labTestsData?.data?.map((test) => (
                  <tr key={test.id} className="hover:bg-primary/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-primary group-hover:text-primary/80 transition-colors">
                          {test.name}
                        </span>
                        {test.shortName && (
                          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                            AKA: {test.shortName}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-bold">
                        {test.category || 'Uncategorized'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Activity className="h-3.5 w-3.5 text-muted-foreground/40" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {test.specimen || 'Not specified'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-muted-foreground line-clamp-1">
                          {test.normalRange || 'N/A'}
                        </span>
                        {test.unit && (
                          <span className="text-[10px] font-medium text-primary/40 uppercase">
                            Unit: {test.unit}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleOpenEditModal(test)}
                        className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {labTestsData?.meta && labTestsData.meta.total > 0 && (
          <div className="p-4 border-t border-primary/5 flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-medium">
              Showing <span className="text-primary font-bold">{(page - 1) * limit + 1}</span> to <span className="text-primary font-bold">{Math.min(page * limit, labTestsData.meta.total)}</span> of <span className="text-primary font-bold">{labTestsData.meta.total}</span> lab tests
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="rounded-xl border-primary/10 hover:bg-primary/5 active:scale-95"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Prev
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                disabled={page * limit >= (labTestsData?.meta?.total ?? 0)}
                onClick={() => setPage(p => p + 1)}
                className="rounded-xl border-primary/10 hover:bg-primary/5 active:scale-95"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 border border-primary/5 flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-primary/5 flex items-center justify-between bg-primary/[0.02]">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-primary">
                  {editingTest ? 'Edit Lab Test' : 'Add New Lab Test'}
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                  {editingTest ? `Updating ${editingTest.name}` : 'Create a new entry in the clinical lab test directory.'}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseModal} className="rounded-full hover:bg-primary/10">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary/40">
                    <ClipboardList className="h-4 w-4" />
                    <h3 className="text-sm font-bold uppercase tracking-widest">Identification</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Test Name</Label>
                    <Input id="name" name="name" defaultValue={editingTest?.name} placeholder="e.g. Complete Blood Count (CBC)" required className="rounded-xl border-primary/10 focus-visible:ring-primary/20 h-11" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shortName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Short Name/Abbreviation</Label>
                      <Input id="shortName" name="shortName" defaultValue={editingTest?.shortName || ''} placeholder="e.g. CBC" className="rounded-xl border-primary/10 focus-visible:ring-primary/20 h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Category</Label>
                      <Input id="category" name="category" defaultValue={editingTest?.category || ''} placeholder="e.g. Hematology" className="rounded-xl border-primary/10 focus-visible:ring-primary/20 h-11" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Description</Label>
                    <Textarea id="description" name="description" defaultValue={editingTest?.description || ''} placeholder="Briefly describe the test purpose..." className="rounded-xl border-primary/10 focus-visible:ring-primary/20 min-h-[100px]" />
                  </div>
                </div>

                {/* Clinical Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary/40">
                    <FlaskConical className="h-4 w-4" />
                    <h3 className="text-sm font-bold uppercase tracking-widest">Clinical Parameters</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specimen" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Specimen</Label>
                      <Input id="specimen" name="specimen" defaultValue={editingTest?.specimen || ''} placeholder="e.g. Whole Blood" className="rounded-xl border-primary/10 focus-visible:ring-primary/20 h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Measurement Unit</Label>
                      <Input id="unit" name="unit" defaultValue={editingTest?.unit || ''} placeholder="e.g. g/dL" className="rounded-xl border-primary/10 focus-visible:ring-primary/20 h-11" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preparation" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Preparation/Instructions</Label>
                    <Input id="preparation" name="preparation" defaultValue={editingTest?.preparation || ''} placeholder="e.g. 12 hours fasting required" className="rounded-xl border-primary/10 focus-visible:ring-primary/20 h-11" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="normalRange" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Normal Range</Label>
                    <Textarea id="normalRange" name="normalRange" defaultValue={editingTest?.normalRange || ''} placeholder="Define clinical normal ranges..." className="rounded-xl border-primary/10 focus-visible:ring-primary/20 min-h-[80px]" />
                  </div>
                </div>

                {/* Status & Options */}
                <div className="md:col-span-2 space-y-4 bg-primary/5 p-6 rounded-3xl border border-primary/5">
                  <div className="flex items-center gap-2 text-primary/40">
                    <Settings2 className="h-4 w-4" />
                    <h3 className="text-sm font-bold uppercase tracking-widest">System Settings</h3>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      id="isActive" 
                      name="isActive" 
                      defaultChecked={editingTest ? editingTest.isActive : true}
                      className="w-5 h-5 text-primary rounded-lg border-primary/20 focus:ring-primary/20"
                    />
                    <div className="flex flex-col">
                      <Label htmlFor="isActive" className="text-sm font-bold text-primary cursor-pointer">
                        Active in Directory
                      </Label>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Inactive tests won&apos;t appear in public searches</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-primary/5 flex items-center justify-end gap-3 sticky bottom-0 bg-white pb-2 mt-4">
                <Button type="button" variant="ghost" onClick={handleCloseModal} className="rounded-full px-6">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="rounded-full px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                  {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingTest ? (
                    <><Check className="w-4 h-4 mr-2" /> Update Test</>
                  ) : (
                    <><Plus className="w-4 h-4 mr-2" /> Create Test</>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Bulk Upload Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseBulkModal} />
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 border border-primary/5 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-primary/5 flex items-center justify-between bg-primary/[0.02]">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-primary">Bulk Upload Lab Tests</h2>
                <p className="text-sm text-muted-foreground font-medium">Upload a CSV file to add multiple tests at once.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseBulkModal} className="rounded-full hover:bg-primary/10">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-8 space-y-6">
              {/* File Upload Area */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group",
                  selectedFile ? "border-primary bg-primary/[0.02]" : "border-primary/10 hover:border-primary/30 hover:bg-primary/[0.01]"
                )}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  className="hidden" 
                  accept=".csv"
                />
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
                  selectedFile ? "bg-primary text-white scale-110" : "bg-primary/5 text-primary group-hover:scale-110"
                )}>
                  <FileSpreadsheet className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-primary">
                    {selectedFile ? selectedFile.name : "Select CSV File"}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">
                    {selectedFile ? `${(selectedFile.size / 1024).toFixed(2)} KB` : "Click to browse or drag and drop"}
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {uploadError && (
                <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-destructive">Upload Error</p>
                    <p className="text-xs text-destructive/80 font-medium mt-0.5">{uploadError}</p>
                  </div>
                </div>
              )}

              {/* Info Area */}
              {!uploadError && !selectedFile && (
                <div className="bg-primary/5 p-4 rounded-2xl flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-primary/70 font-medium">
                    Make sure your CSV follows the required format. Download the guidelines PDF or sample CSV if you&apos;re unsure.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="ghost" 
                  onClick={handleCloseBulkModal} 
                  className="flex-1 rounded-full h-12 font-bold"
                >
                  Cancel
                </Button>
                <Button 
                  disabled={!selectedFile || bulkUploadMutation.isPending}
                  onClick={handleBulkUploadExecute}
                  className="flex-[2] rounded-full h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold transition-all active:scale-95"
                >
                  {bulkUploadMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
                  ) : (
                    <><Upload className="w-4 h-4 mr-2" /> Start Upload</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


