import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";

export interface EthereumContext {
  ethereum: unknown;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  chainId: number;
  address: string;
  isConnected: boolean;
  onConnect: () => void;
  onSwitchToMainnet: () => void;
}

const useEthereum = (): EthereumContext => {
  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState(0);
  const [ethereum, setEthereum] = useState();

  useEffect(() => {
    detectEthereumProvider().then((p) => {
      setEthereum(p);
      if (!p) alert("Please install MetaMask!");
    });
  }, [window.ethereum]);

  const isConnected = ethereum?.isConnected() && !!address;

  const onConnect = () => {
    if (ethereum) {
      ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => setAddress(accounts[0]))
        .catch((e) => {
          console.error(e);
          alert(e.message);
        });
      ethereum
        .request({ method: "eth_chainId" })
        .then((id) => {
          setChainId(Number.parseInt(id, 16));
        })
        .catch((e) => {
          console.error(e);
          alert(e.message);
        });
      ethereum.on("accountsChanged", () => window.location.reload());
      ethereum.on("chainChanged", () => window.location.reload());
    }
  };

  const onSwitchToMainnet = () => {
    if (ethereum) {
      ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1" }],
      });
    }
  };

  const provider = ethereum ? new Web3Provider(ethereum) : null;
  const signer = provider ? provider.getSigner() : null;
  return {
    ethereum,
    provider,
    signer,
    chainId,
    address,
    isConnected,
    onConnect,
    onSwitchToMainnet,
  };
};

export default useEthereum;
