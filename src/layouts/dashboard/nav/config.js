// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Tài khoản',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Sản phẩm',
    path: '/dashboard/products',
    icon: icon('ic_cart'),
  },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Nhà cung cấp',
    path: '/dashboard/supplier',
    icon: icon('ic_supplier'),
  },
  {
    title: 'Loại sản phẩm',
    path: '/dashboard/category',
    icon: icon('ic_category'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
