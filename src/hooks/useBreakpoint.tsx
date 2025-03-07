import { useState, useEffect } from "react";

type BreakpointKeys = "xs" | "sm" | "md" | "lg" | "xl";

const breakpoints: Record<BreakpointKeys, number> = {
  xs: 480,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1600,
};

type BreakpointState = Partial<Record<BreakpointKeys, boolean>>;

const useBreakpoint = (): BreakpointState => {
  const [screens, setScreens] = useState<BreakpointState>(() =>
    Object.keys(breakpoints).reduce((acc, key) => {
      acc[key as BreakpointKeys] = false;
      return acc;
    }, {} as BreakpointState)
  );

  useEffect(() => {
    const mediaQueries = Object.entries(breakpoints).map(([key, value]) => ({
      key: key as BreakpointKeys,
      query: window.matchMedia(`(min-width: ${value}px)`),
    }));

    const handleChange = () => {
      const updatedScreens: BreakpointState = {};
      mediaQueries.forEach(({ key, query }) => {
        updatedScreens[key] = query.matches;
      });
      setScreens(updatedScreens);
    };

    // Initialize state
    handleChange();

    // Add listeners
    mediaQueries.forEach(({ query }) =>
      query.addEventListener("change", handleChange)
    );

    return () => {
      // Remove listeners
      mediaQueries.forEach(({ query }) =>
        query.removeEventListener("change", handleChange)
      );
    };
  }, []);

  return screens;
};

export default useBreakpoint;
