import CreateNewStrategyCard from '@/app/components/CreateNewStrategyCard';

export default async function Dashboard() {
  return (
    <div className='min-h-screen'>
      <div className='w-64 h-64'>
        <CreateNewStrategyCard />
      </div>
    </div>
  );
}
