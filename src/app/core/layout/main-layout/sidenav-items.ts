type SidenavItem = {
  label: string;
  icon: string;
  route: string;
  roles: string[];
};

export const sidenavItems: SidenavItem[] = [
  {
    label: 'Inicio',
    icon: 'home',
    route: 'home',
    roles: ['ROLE_USER', 'ROLE_ADMIN'],
  },
  {
    label: 'Usuarios',
    icon: 'people',
    route: 'users',
    roles: ['ROLE_ADMIN'],
  },
];