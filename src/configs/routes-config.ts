import { lazy } from "react";
import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from "./app-configs";

export const publicRoutes = [
    {
        key: 'home.default',
        path: `${APP_PREFIX_PATH}`,
        component: lazy(() => import('../pages/prod-home/prod-home'))
    },
    {
        key: 'login',
        path: `${AUTH_PREFIX_PATH}/login`,
        component: lazy(() => import('../pages/authentication/authentication'))
    },
    {
        key: 'about',
        path: `${APP_PREFIX_PATH}/about`,
        component: lazy(() => import('../pages/about/about'))
    },
    {
        key: 'terms.condition',
        path: `${APP_PREFIX_PATH}/terms-and-conditions`,
        component: lazy(() => import('../pages/terms-condition/terms-condition'))
    },
    {
        key: 'privacy.policy',
        path: `${APP_PREFIX_PATH}/policy-privacy`,
        component: lazy(() => import('../pages/privacy-policy/privacy-policy'))
    },
    {
        key: 'refunds.policy',
        path: `${APP_PREFIX_PATH}/refund-policy`,
        component: lazy(() => import('../pages/refund-policy/refund-policy'))
    },
    {
        key: 'pricing.plan',
        path: `${APP_PREFIX_PATH}/pricing-plan`,
        component: lazy(() => import('../pages/pricing/pricing'))
    },
    {
        key: 'not.found',
        path: `${APP_PREFIX_PATH}/*`,
        component: lazy(() => import('../pages/page-not-found/page-not-found'))
    }
];

export const protectedRoutes = [
    {
        key: 'home.default',
        path: `${APP_PREFIX_PATH}`,
        component: lazy(() => import('../pages/prod-home/prod-home'))
    },
    {
        key: 'workspace.default',
        path: `${APP_PREFIX_PATH}/workspace/default`,
        component: lazy(() => import('../pages/workspace/workspace'))
    },
    {
        key: 'workspace.task',
        path: `${APP_PREFIX_PATH}/workspace/:workspaceId`,
        component: lazy(() => import('../pages/workspace-tasks/workspace-tasks'))
    },
    {
        key: 'about',
        path: `${APP_PREFIX_PATH}/about`,
        component: lazy(() => import('../pages/about/about'))
    },
    {
        key: 'onboarding',
        path: `${APP_PREFIX_PATH}/create-first-workspace`,
        component: lazy(() => import('../pages/create-first-workspace/create-first-workspace'))
    },
    {
        key: 'terms.condition',
        path: `${APP_PREFIX_PATH}/terms-and-conditions`,
        component: lazy(() => import('../pages/terms-condition/terms-condition'))
    },
    {
        key: 'privacy.policy',
        path: `${APP_PREFIX_PATH}/policy-privacy`,
        component: lazy(() => import('../pages/privacy-policy/privacy-policy'))
    },
    {
        key: 'refunds.policy',
        path: `${APP_PREFIX_PATH}/refund-policy`,
        component: lazy(() => import('../pages/refund-policy/refund-policy'))
    },
    {
        key: 'pricing.plan',
        path: `${APP_PREFIX_PATH}/pricing-plan`,
        component: lazy(() => import('../pages/pricing/pricing'))
    },
    {
        key: 'device.limit',
        path: `${APP_PREFIX_PATH}/device-login-limit`,
        component: lazy(() => import('../pages/device-exceed/device-exceed'))
    },
    {
        key: 'not.found',
        path: `${APP_PREFIX_PATH}/*`,
        component: lazy(() => import('../pages/page-not-found/page-not-found'))
    }
];
