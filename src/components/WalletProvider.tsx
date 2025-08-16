import React, { createContext, useContext, ReactNode, useState } from 'react';
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider as SuiWalletProvider,
  ConnectButton as SuiConnectButton,
  ConnectModal,
  useCurrentAccount,
  useSignTransaction,
  useSuiClient,
  lightTheme
} from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create network config
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
});

// Create a query client
const queryClient = new QueryClient();

interface WalletContextType {
  currentAccount: any;
  signTransaction: any;
  suiClient: any;
}

const WalletContext = createContext<WalletContextType | null>(null);

interface WalletProviderProps {
  children: ReactNode;
}

// Inner component that uses the hooks
const WalletContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signTransaction } = useSignTransaction();
  const suiClient = useSuiClient();

  const value = {
    currentAccount,
    signTransaction,
    suiClient
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <SuiWalletProvider autoConnect theme={lightTheme}>
          <WalletContextProvider>
            {children}
          </WalletContextProvider>
        </SuiWalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

// export { ConnectButton, ConnectModal };

export function ConnectButton({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ConnectModal 
      trigger={
      <button className={className} onClick={() => setIsOpen(true)}>
        Connect Wallet
      </button>}
			open={isOpen}
			onOpenChange={(isOpen) => setIsOpen(isOpen)}
    />
  )
}
