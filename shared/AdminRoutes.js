import Fooldal from '../src/views/Admin/Fooldal/Fooldal';
import Projektek from '../src/views/Admin/Projektek/Projektek';
import Ingatlanok from '../src/views/Admin/Ingatlanok/Ingatlanok';
import Jogosultsagok from '../src/views/Admin/Jogosultsagok/Jogosultsagok';
import AdminUsers from '../src/views/Admin/Adminusers/AdminUsers';
import Vevok from '../src/views/Admin/Vevok/Vevok';
import IngatlanSzolgaltatasok from '../src/views/Admin/IngatlanSzolgaltatasok/IngatlanSzolgaltasok';
import PenzugyiSzolgaltatasok from '../src/views/Admin/PenzugyiSzolgaltatasok/PenzugyiSzolgaltatasok';
import Gdpr from '../src/views/Admin/GDPR/Gdpr';
import Rolunk from '../src/views/Admin/Rolunk/Rolunk';
import Kapcsolatok from '../src/views/Admin/Kapcsolatok/Kapcsolatok';
import MyArtBase from '../src/views/Admin/MyArt/MyArtBase';

const AdminRoutes = [
    { path: '/admin', element: Fooldal },
    { path: '/admin/projektek', element: Projektek },
    { path: '/admin/ingatlanok', element: Ingatlanok },
    { path: '/admin/jogosultsagok', element: Jogosultsagok },
    { path: '/admin/felhasznalok', element: AdminUsers },
    { path: '/admin/vevok', element: Vevok },
    { path: '/admin/ingatlanszolg', element: IngatlanSzolgaltatasok },
    { path: '/admin/penzugyiszolg', element: PenzugyiSzolgaltatasok },
    { path: '/admin/adatkezeles', element: Gdpr },
    { path: '/admin/rolunk', element: Rolunk },
    { path: '/admin/kapcsolat', element: Kapcsolatok },
    { path: '/admin/myArt', element: MyArtBase }
];

export default AdminRoutes;
