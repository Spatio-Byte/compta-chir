import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-60 h-screen fixed top-0 left-0 bg-gray-800 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-6">HCT-Compta</h1>
      <nav className="flex flex-col gap-4">
        <Link to="/compta-chir/devis" className="page-linked-css">Créer un devis</Link>
        <Link to="/compta-chir/resume" className="page-linked-css">Résumé comptable</Link>
      </nav>
    </div>
  );
};

export default Sidebar;