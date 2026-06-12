import { useMemo, useState } from 'react';
import type { EnergyLevel, Task } from './types';
import { useTasks } from './hooks/useTasks';
import { useClients } from './hooks/useClients';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DEFAULT_FILTERS, DEFAULT_SORT, type FilterState, type SortState } from './types-filters';
import { EnergyCheckIn } from './components/EnergyCheckIn';
import { TopThree } from './components/TopThree';
import { Filters } from './components/Filters';
import { QuickAdd } from './components/QuickAdd';
import { TaskList } from './components/TaskList';
import { ParkingLot } from './components/ParkingLot';
import { TaskFormModal } from './components/TaskFormModal';
import { isDueSoon } from './utils/energy';
import { sortTasks } from './utils/sort';

function App() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { clients, addClient } = useClients();
  const [currentEnergy, setCurrentEnergy] = useLocalStorage<EnergyLevel>('second-brain-energy', 'Medium');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortState>(DEFAULT_SORT);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.bucket !== 'All' && task.bucket !== filters.bucket) return false;
      if (filters.energy !== 'All' && task.energyNeeded !== filters.energy) return false;
      if (filters.dueSoon && !isDueSoon(task.deadline)) return false;
      if (filters.statusGroup === 'In Progress' && task.status !== 'In Progress') return false;
      if (filters.statusGroup === 'Parked' && task.status !== 'Parked') return false;
      if (filters.client !== 'All' && task.client !== filters.client) return false;
      if (filters.search.trim()) {
        const q = filters.search.trim().toLowerCase();
        const haystack = `${task.title} ${task.client} ${task.notes} ${task.nextAction}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [tasks, filters]);

  // Main list excludes parked tasks unless the user explicitly filters for them —
  // parked items live in the Parking Lot section instead.
  const mainListTasks = useMemo(() => {
    const base = filters.statusGroup === 'Parked' ? filteredTasks : filteredTasks.filter((t) => t.status !== 'Parked');
    return sortTasks(base, sort);
  }, [filteredTasks, sort]);

  function openNewTaskModal() {
    setEditingTask(null);
    setModalOpen(true);
  }

  function openEditModal(task: Task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingTask(null);
  }

  function handleSave(draft: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    if (editingTask) {
      updateTask(editingTask.id, draft);
    } else {
      addTask(draft);
    }
    closeModal();
  }

  function handleDelete() {
    if (editingTask) {
      deleteTask(editingTask.id);
    }
    closeModal();
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-ink sm:text-3xl">🧠 Second Brain</h1>
            <p className="text-sm text-ink-soft">Your calm home for client work and personal ideas.</p>
          </div>
          <button
            type="button"
            onClick={openNewTaskModal}
            className="rounded-full bg-lilac-deep px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-lilac-deep/90 sm:px-5"
          >
            + New
          </button>
        </header>

        <EnergyCheckIn currentEnergy={currentEnergy} onChange={setCurrentEnergy} />

        <TopThree tasks={tasks} currentEnergy={currentEnergy} onSelect={openEditModal} />

        <QuickAdd onAdd={addTask} onOpenFull={openNewTaskModal} />

        <section className="flex flex-col gap-3">
          <Filters filters={filters} onChange={setFilters} clients={clients} />
          <TaskList
            tasks={mainListTasks}
            currentEnergy={currentEnergy}
            sort={sort}
            onSortChange={setSort}
            onSelect={openEditModal}
          />
        </section>

        <ParkingLot tasks={filteredTasks} currentEnergy={currentEnergy} onSelect={openEditModal} />

        <footer className="py-4 text-center text-xs text-ink-soft">
          Everything is saved automatically in your browser.
        </footer>
      </div>

      {modalOpen && (
        <TaskFormModal
          task={editingTask}
          clients={clients}
          onAddClient={addClient}
          onSave={handleSave}
          onDelete={editingTask ? handleDelete : undefined}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default App;
