import TaskList from '@/components/TaskList';
import TaskHeader from '@/components/TaskHeader';

export default function TasksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <TaskHeader title="All Tasks" />
      <TaskList />
    </div>
  );
}
