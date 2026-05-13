// ========================================
// Upload Page
// ========================================
import { supabase } from '@/lib/supabase'
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload as UploadIcon, FileText, X, Check, ChevronRight, ChevronLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Elements';
import { useUIStore } from '@/stores/uiStore';
import { SUBJECTS, SEMESTERS, UNIVERSITIES, COURSES, YEARS } from '@/lib/constants';
import { validateFile } from '@/lib/utils';

export default function UploadPage() {
  const { addToast } = useUIStore();
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '', subject: '', semester: '', university: '', course: '', year: '', description: '', type: 'paper',
    tags: [] as string[],
  });

  const steps = ['Upload File', 'Details', 'Review'];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  }, []);

  const processFile = (f: File) => {
    const result = validateFile(f);
    if (!result.valid) { addToast({ type: 'error', message: result.error! }); return; }
    setFile(f);
    addToast({ type: 'success', message: 'File added successfully' });
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setIsSubmitting(true);

    try {
      addToast({ type: 'success', message: 'Uploading your file...' });

       const { data: { user } } = await supabase.auth.getUser();

      // Step 1: Upload PDF to Supabase Storage
      const fileName = `${Date.now()}_${file.name}`;
      const { error: storageError } = await supabase.storage
        .from('papers')
        .upload(fileName, file);

      if (storageError) throw storageError;

      // Step 2: Get the public URL of the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('papers')
        .getPublicUrl(fileName);

      // Step 3: Save all form details + file URL to database
      const { error: dbError } = await supabase
        .from('papers')
        .insert({
          title: form.title,
          subject: form.subject,
          semester: form.semester,
          university: form.university,
          course: form.course,
          year: form.year,
          description: form.description,
          type: form.type,
          tags: form.tags,
          file_url: publicUrl,
          file_name: file.name,
          file_size: file.size,
          uploader_id: user?.id,
        });

      if (dbError) throw dbError;

      // Step 4: Success — reset everything
      addToast({ type: 'success', message: 'Paper submitted successfully! 🎉' });
      setStep(0);
      setFile(null);
      setForm({ title: '', subject: '', semester: '', university: '', course: '', year: '', description: '', type: 'paper', tags: [] });

    } catch (err: any) {
      addToast({ type: 'error', message: err.message || 'Upload failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectClass = 'w-full card-bg border border-themed rounded-xl px-4 py-3 text-sm text-primary appearance-none';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-primary mb-2">Upload Paper</h1>
        <p className="text-secondary mb-8">Share study materials with the community</p>
      </motion.div>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 transition-colors ${
              i <= step ? 'bg-accent text-white' : 'bg-[var(--color-bg-tertiary)] text-tertiary'}`}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-sm hidden sm:block ${i <= step ? 'text-primary font-medium' : 'text-tertiary'}`}>{s}</span>
            {i < steps.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-accent' : 'bg-[var(--color-bg-tertiary)]'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: File Upload */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card padding="lg">
              <div onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                  dragActive ? 'border-[var(--color-accent)] accent-light-bg' : 'border-themed hover:border-[var(--color-border-hover)]'}`}
                onClick={() => document.getElementById('file-input')?.click()}>
                <input id="file-input" type="file" accept=".pdf" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0]; if (f) processFile(f);
                }} />
                <UploadIcon className={`w-12 h-12 mx-auto mb-4 ${dragActive ? 'text-accent' : 'text-tertiary'}`} />
                <p className="text-lg font-medium text-primary mb-2">{dragActive ? 'Drop your file here' : 'Drag & drop your PDF'}</p>
                <p className="text-sm text-tertiary">or click to browse • PDF only • Max 50MB</p>
              </div>
              {file && (
                <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-tertiary)]">
                  <FileText className="w-8 h-8 text-accent" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{file.name}</p>
                    <p className="text-xs text-tertiary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button onClick={() => setFile(null)} className="p-1 rounded-lg hover:bg-[var(--color-bg-tertiary)]"><X className="w-4 h-4 text-tertiary" /></button>
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <Button disabled={!file} onClick={() => setStep(1)}>Next <ChevronRight className="w-4 h-4" /></Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Details */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card padding="lg">
              <div className="space-y-5">
                <Input label="Title" placeholder="e.g. Mathematics Final 2024" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-medium text-secondary mb-1.5">Type</label>
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={selectClass}>
                      <option value="paper">Question Paper</option><option value="note">Study Notes</option>
                    </select></div>
                  <div><label className="block text-sm font-medium text-secondary mb-1.5">Subject</label>
                    <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={selectClass}>
                      <option value="">Select subject</option>{SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select></div>
                  <div><label className="block text-sm font-medium text-secondary mb-1.5">Semester</label>
                    <select value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} className={selectClass}>
                      <option value="">Select</option>{SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
                    </select></div>
                  <div><label className="block text-sm font-medium text-secondary mb-1.5">University</label>
                    <select value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} className={selectClass}>
                      <option value="">Select</option>{UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                    </select></div>
                  <div><label className="block text-sm font-medium text-secondary mb-1.5">Course</label>
                    <select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} className={selectClass}>
                      <option value="">Select</option>{COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select></div>
                  <div><label className="block text-sm font-medium text-secondary mb-1.5">Year</label>
                    <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={selectClass}>
                      <option value="">Select</option>{YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe the content..." rows={3}
                    className="w-full card-bg border border-themed rounded-xl px-4 py-3 text-sm text-primary placeholder:text-tertiary resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">Tags</label>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {form.tags.map(t => (
                      <Badge key={t} variant="primary">
                        {t} <button onClick={() => setForm({ ...form, tags: form.tags.filter(x => x !== t) })} className="ml-1"><X className="w-3 h-3" /></button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); }}}
                      placeholder="Add tag..." className="flex-1 card-bg border border-themed rounded-xl px-4 py-2.5 text-sm text-primary placeholder:text-tertiary" />
                    <Button variant="secondary" size="sm" onClick={addTag} icon={<Plus className="w-4 h-4" />}>Add</Button>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="secondary" onClick={() => setStep(0)}><ChevronLeft className="w-4 h-4" /> Back</Button>
                <Button disabled={!form.title || !form.subject} onClick={() => setStep(2)}>Review <ChevronRight className="w-4 h-4" /></Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Review */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-primary mb-6">Review Submission</h2>
              <div className="space-y-3 mb-6">
                {[
                  ['File', file?.name || '-'],
                  ['Title', form.title || '-'],
                  ['Type', form.type === 'paper' ? 'Question Paper' : 'Study Notes'],
                  ['Subject', form.subject || '-'],
                  ['Semester', form.semester ? `Semester ${form.semester}` : '-'],
                  ['University', form.university || '-'],
                  ['Course', form.course || '-'],
                  ['Year', form.year || '-'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-themed text-sm">
                    <span className="text-secondary">{k}</span><span className="text-primary font-medium">{v}</span>
                  </div>
                ))}
                {form.description && <div className="py-2 text-sm"><span className="text-secondary block mb-1">Description</span><p className="text-primary">{form.description}</p></div>}
                {form.tags.length > 0 && <div className="py-2"><span className="text-secondary text-sm block mb-2">Tags</span>
                  <div className="flex flex-wrap gap-2">{form.tags.map(t => <Badge key={t} variant="primary">{t}</Badge>)}</div>
                </div>}
              </div>
              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep(1)}><ChevronLeft className="w-4 h-4" /> Back</Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  icon={<UploadIcon className="w-4 h-4" />}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}