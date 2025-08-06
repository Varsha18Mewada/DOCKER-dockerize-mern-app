import { PrivateRoutes } from './PrivateRoutes';
import { PublicRoutes } from './PublicRoutes';

export const Routing = () => {
  return (
    <div>
      <PrivateRoutes />
      <PublicRoutes />
    </div>
  );
};
