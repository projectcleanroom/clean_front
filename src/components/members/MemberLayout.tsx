import MemberHeader from './MemberHeader';
import { Outlet } from 'react-router-dom';

const MemberLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <MemberHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MemberLayout;
