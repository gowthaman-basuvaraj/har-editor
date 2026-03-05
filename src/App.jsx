import React from 'react';
import { Stack } from "@fluentui/react";
import { HeaderBar } from './components/HeaderBar';
import { Content } from './components/Content';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import './App.css';

initializeIcons();

function App() {
  return (
    <Stack>
      <HeaderBar />
      <Content />
    </Stack>
  );
}

export default App;
