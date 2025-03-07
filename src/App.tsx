import React, { useMemo } from 'react';

import Routes from './routes';

export default function App() {

  const renderHome = useMemo(() => {
    return (
      <Routes />
    )
  }, []);
  return renderHome;
}
