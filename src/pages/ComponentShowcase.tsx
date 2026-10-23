import React, { useState } from 'react';
import {
  Button,
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
  DangerButton,
  IconButton,
} from '@/components/ui/Button';
import {
  TextInput,
  PasswordInput,
  SearchInput,
  Select,
  MultiSelect,
  Textarea,
  FileUpload,
} from '@/components/ui/Inputs';
import {
  SkeletonLoader,
  SuccessMessage,
  Toast,
  ConfirmationDialog,
} from '@/components/ui/Feedback';
import {
  Card,
  StatCard,
  UserCard,
  TeamCard,
  EventCard,
} from '@/components/ui/Cards';
import { Breadcrumb, Tabs, Pagination } from '@/components/ui/NavigationComponents';
import { Modal, Drawer } from '@/components/ui/OverlayComponents';
import { FilterPanel } from '@/components/ui/FilterPanel';
import { Sparkles, Heart, Bell, Shield, Check } from 'lucide-react';

export const ComponentShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('buttons');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [multiSelectValues, setMultiSelectValues] = useState<string[]>(['react', 'ts']);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);

  const filterConfig = [
    {
      label: 'College / Institution',
      name: 'college',
      type: 'select' as const,
      options: [
        { label: 'All Colleges', value: '' },
        { label: 'Stanford University', value: 'stanford' },
        { label: 'MIT', value: 'mit' },
      ],
    },
    {
      label: 'Department',
      name: 'department',
      type: 'select' as const,
      options: [
        { label: 'All Departments', value: '' },
        { label: 'Computer Science', value: 'cs' },
        { label: 'Electrical Engineering', value: 'ee' },
      ],
    },
    {
      label: 'Skills',
      name: 'skills',
      type: 'multiselect' as const,
      options: [
        { label: 'React', value: 'react' },
        { label: 'TypeScript', value: 'ts' },
        { label: 'Python', value: 'python' },
        { label: 'FastAPI', value: 'fastapi' },
      ],
    },
    {
      label: 'Availability',
      name: 'availability',
      type: 'select' as const,
      options: [
        { label: 'Any Status', value: '' },
        { label: 'Available', value: 'AVAILABLE' },
        { label: 'In Team', value: 'BUSY' },
      ],
    },
  ];

  return (
    <div className="space-y-8 text-left pb-12">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-brand-600 mb-1">
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Frontend Design System</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Module 1 Reusable Component Library</h1>
        <p className="text-xs text-slate-500 mt-1">
          Interactive showcase of all design tokens, buttons, form controls, cards, feedback, overlays, and filter primitives.
        </p>
      </div>

      {/* Tabs navigation */}
      <Tabs
        tabs={[
          { id: 'buttons', label: 'Buttons & Triggers' },
          { id: 'inputs', label: 'Form Controls & Inputs' },
          { id: 'cards', label: 'Cards & Stat Primitives' },
          { id: 'feedback', label: 'Feedback & Modals' },
          { id: 'filters', label: 'Filter & Nav Systems' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab Content: Buttons */}
      {activeTab === 'buttons' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Button Variants & States</h3>
            <Button size="sm" variant="outline" onClick={() => setIsLoadingState((prev) => !prev)}>
              Toggle Loading State: {isLoadingState ? 'ON' : 'OFF'}
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
            <PrimaryButton isLoading={isLoadingState}>Primary Button</PrimaryButton>
            <SecondaryButton isLoading={isLoadingState}>Secondary Button</SecondaryButton>
            <OutlineButton isLoading={isLoadingState}>Outline Button</OutlineButton>
            <DangerButton isLoading={isLoadingState}>Danger Button</DangerButton>
            <Button variant="ghost" isLoading={isLoadingState}>
              Ghost Button
            </Button>
            <IconButton icon={<Heart className="w-4 h-4 text-rose-500" />} aria-label="Favorite" />
            <IconButton icon={<Bell className="w-4 h-4" />} aria-label="Alerts" variant="secondary" />
          </div>
        </section>
      )}

      {/* Tab Content: Inputs */}
      {activeTab === 'inputs' && (
        <section className="space-y-6">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Form Inputs & Selection Primitives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
            <TextInput label="Standard Text Input" placeholder="Enter student name..." helperText="Will be validated on blur" />
            <PasswordInput label="Password Input" placeholder="••••••••" />
            <SearchInput label="Search Component" placeholder="Search profiles, skills..." />
            <Select
              label="Role Selector"
              options={[
                { value: 'STUDENT', label: 'Student Role' },
                { value: 'PROFESSIONAL', label: 'Professional / Mentor' },
                { value: 'COLLEGE', label: 'College Institution' },
              ]}
            />
            <MultiSelect
              label="Multi-Select Skills"
              options={[
                { value: 'react', label: 'React.js' },
                { value: 'ts', label: 'TypeScript' },
                { value: 'python', label: 'Python' },
                { value: 'fastapi', label: 'FastAPI' },
              ]}
              value={multiSelectValues}
              onChange={setMultiSelectValues}
            />
            <FileUpload label="Resume / Certificate Upload" />
            <div className="md:col-span-2">
              <Textarea label="Bio / Team Overview" placeholder="Write a short summary..." />
            </div>
          </div>
        </section>
      )}

      {/* Tab Content: Cards */}
      {activeTab === 'cards' && (
        <section className="space-y-6">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Stat Cards & Domain Cards</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Teams" value="128" change="+14%" icon={<Sparkles className="w-5 h-5 text-brand-600" />} />
            <StatCard title="Active Hackathons" value="8" description="Active this month" icon={<Bell className="w-5 h-5 text-emerald-600" />} />
            <StatCard title="Mentors Online" value="42" change="+3" icon={<Shield className="w-5 h-5 text-violet-600" />} />
            <StatCard title="Avg Team Match" value="94%" change="+2%" icon={<Check className="w-5 h-5 text-indigo-600" />} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UserCard
              name="Elena Rostova"
              role="STUDENT"
              institution="Stanford University"
              department="Computer Science"
              skills={['React', 'TypeScript', 'Node.js', 'Tailwind']}
              availability="AVAILABLE"
              onAction={() => alert('View profile clicked')}
            />
            <TeamCard
              name="AI Visionaries"
              description="Building a real-time computer vision application for university safety."
              memberCount={3}
              maxMembers={4}
              skillsNeeded={['OpenCV', 'PyTorch', 'React']}
              status="OPEN"
              onJoin={() => alert('Join clicked')}
            />
            <EventCard
              title="Global AI Hackathon 2026"
              organizer="Stanford AI Club"
              date="Oct 15 - Oct 17"
              location="San Francisco, CA"
              category="Hackathon"
              onExplore={() => alert('Explore clicked')}
            />
          </div>
        </section>
      )}

      {/* Tab Content: Feedback */}
      {activeTab === 'feedback' && (
        <section className="space-y-6">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Feedback & Overlays</h3>
          <div className="flex gap-4">
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
            <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>
              Open Drawer
            </Button>
            <Button variant="danger" onClick={() => setIsConfirmOpen(true)}>
              Open Confirm Dialog
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">Toasts & Success Messages</h4>
              <div className="space-y-3">
                <SuccessMessage title="Team Request Sent" message="Your request has been routed to team lead." />
                <Toast type="info" title="New Hackathon Announcement" message="Global Hackathon registration opens tomorrow." />
                <Toast type="warning" title="Profile Incomplete" message="Add 2 more skills to boost AI matching." />
              </div>
            </Card>

            <Card>
              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">Skeleton Loader & Empty State</h4>
              <SkeletonLoader variant="card" count={1} />
            </Card>
          </div>
        </section>
      )}

      {/* Tab Content: Filters */}
      {activeTab === 'filters' && (
        <section className="space-y-6">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Filter Panel & Navigation</h3>
          <FilterPanel
            filtersConfig={filterConfig}
            values={filterValues}
            onChange={(k, v) => setFilterValues((prev) => ({ ...prev, [k]: v }))}
            onReset={() => setFilterValues({})}
          />
          <Card>
            <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Explore Teams', path: '/teams' }, { label: 'NeuralForge' }]} />
            <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} className="mt-4" />
          </Card>
        </section>
      )}

      {/* Modals & Dialogs */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Sample Action Modal" description="Demonstrating reusable modal behavior">
        <p className="text-xs text-slate-600">Modal content goes here. Easily supports forms, descriptions, and action buttons.</p>
      </Modal>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Side Drawer">
        <p className="text-xs text-slate-600">Drawer content goes here. Great for filters or detail panels.</p>
      </Drawer>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        title="Confirm Removal"
        description="Are you sure you want to remove this item? This operation cannot be undone."
        isDanger
        onConfirm={() => setIsConfirmOpen(false)}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};
