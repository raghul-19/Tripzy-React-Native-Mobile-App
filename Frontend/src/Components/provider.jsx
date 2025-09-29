import React from 'react';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
export default function Provider({ children }) {
    return <GluestackUIProvider config={config}>{children}</GluestackUIProvider>;
}
  