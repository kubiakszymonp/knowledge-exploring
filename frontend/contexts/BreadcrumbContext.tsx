"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import type { Entity, Route } from "@/model/pilot/types";

const SHORT_NAME_MAX_LEN = 28;

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbContextValue {
  items: BreadcrumbItem[];
  backHref: string | null;
}

const defaultValue: BreadcrumbContextValue = {
  items: [],
  backHref: null,
};

const BreadcrumbContext = createContext<BreadcrumbContextValue>(defaultValue);

export function BreadcrumbProvider({
  value,
  children,
}: {
  value: BreadcrumbContextValue;
  children: ReactNode;
}) {
  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb(): BreadcrumbContextValue {
  return useContext(BreadcrumbContext);
}

function shortName(name: string): string {
  if (name.length <= SHORT_NAME_MAX_LEN) return name;
  return name.slice(0, SHORT_NAME_MAX_LEN).trim() + "…";
}

const HOME_ITEM: BreadcrumbItem = { label: "Strona główna", href: "/" };

/** Strategy: entity/[id] – breadcrumb: Home → short entity name; back to /. */
export function entityBreadcrumb(entity: Entity): BreadcrumbContextValue {
  return {
    items: [HOME_ITEM, { label: shortName(entity.name) }],
    backHref: "/",
  };
}

/** Strategy: route/[id] – breadcrumb: Home → route name; back to /. */
export function routeBreadcrumb(route: Route): BreadcrumbContextValue {
  return {
    items: [HOME_ITEM, { label: route.name }],
    backHref: "/",
  };
}

/** Strategy: route/[id]/entity/[entityId] – Home → route name → entity name; back to route. */
export function routeEntityBreadcrumb(
  routeId: string,
  routeName: string,
  entityName: string
): BreadcrumbContextValue {
  return {
    items: [
      HOME_ITEM,
      { label: routeName, href: `/route/${routeId}` },
      { label: entityName },
    ],
    backHref: `/route/${routeId}`,
  };
}
