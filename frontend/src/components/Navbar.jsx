import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-(--color-neutral)/15 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-(--color-primary) shrink-0"></div>
        <span className="font-display text-lg sm:text-xl font-bold text-(--color-primary)">FoodBridge</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Link to="/profile" className="text-xs sm:text-sm font-medium text-(--color-neutral) hover:text-(--color-primary) transition">
          Profile
        </Link>
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-(--color-neutral) capitalize">{user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs sm:text-sm font-medium text-(--color-secondary) border border-(--color-secondary)/30 px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg hover:bg-(--color-secondary)/10 transition shrink-0"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}