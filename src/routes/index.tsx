import React, { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Routes as RouterRoutes,
  Route,
  Navigate,
} from "react-router-dom";

import { protectedRoutes, publicRoutes } from "../configs/routes-config";
import AppRoute from "./app-routes";
import Loader from "../components/loader/loader";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { setSettingsLoading, setUsers } from "../redux/settings/settings.slice"
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getUser } from "../redux/settings/settings.selector";
import { APP_PREFIX_PATH } from "../configs/app-configs";
import PageNotFound from "../pages/page-not-found/page-not-found";
import PublicRoute from "./public-routes";
import ProtectedRoute from "./protected-routes";

const AuthLayout = lazy(() => import("../components/auth-layout/auth-layout"));
const AppLayout = lazy(() => import("../components/app-layout/app-layout"));

const Routes = () => {
  const dispatch = useDispatch();

  const user = useSelector(getUser, shallowEqual);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        dispatch(setUsers(user));
      }
      dispatch(setSettingsLoading(false))
    });

    return () => unsubscribe();
  }, [dispatch])

  const Layout = user ? AppLayout : AuthLayout;

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader loadingMessage="Page loading" />}>
        <Layout>
          <RouterRoutes>
            <Route path="/" element={<Navigate to={`${APP_PREFIX_PATH}`} />} />
            <Route path="/" element={user ? <ProtectedRoute /> : <PublicRoute />}>
              {protectedRoutes
                .map((route) => (
                  <Route
                    key={route.key}
                    path={route.path}
                    element={
                      <AppRoute
                        routeKey={route.key}
                        component={route.component}
                      />
                    }
                  />
                ))}
                {publicRoutes
                .map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <AppRoute
                        routeKey={route.key}
                        component={route.component}
                      />
                    }
                  />
                ))}
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </RouterRoutes>
        </Layout>
      </Suspense>
    </BrowserRouter>
  );
};

export default Routes;
