import { ContractFactory, Signer } from "ethers";
import React, { useState } from "react";
import abi from "./abi.json";

import "./App.css";
import { AUTH_MESSAGE, SERVER_URL, SUSHIB } from "./constants";
import useEthereum from "./hooks/useEthereum";

const getContract = (signer: Signer) => {
  return ContractFactory.getContract(SUSHIB, abi, signer);
};

function App() {
  const context = useEthereum();
  const [checking, setChecking] = useState(false);
  const [zeroAmount, setZeroAmount] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const onClaim = async () => {
    setChecking(true);
    setZeroAmount(false);
    setTxHash("");
    setError("");
    if (context.signer) {
      try {
        const signature = await context.signer.signMessage(AUTH_MESSAGE);
        const res = await fetch(SERVER_URL + "/snapshot/" + signature);
        const json = await res.json();
        const contract = getContract(context.signer);
        if (json.amount == "0") {
          setZeroAmount(true);
          return true;
        }
        const tx = await contract.claim(
          json.account,
          json.amount,
          json.v,
          json.r,
          json.s,
          context.address
        );
        setTxHash(tx.hash);
      } catch (e) {
        setError(e.message);
      } finally {
        setChecking(false);
      }
    } else {
      setError("Metamask not connected");
    }
    return true;
  };
  const onViewTx = (txHash: string) => () =>
    window.open("https://etherscan.io/tx/" + txHash, "_blank");

  return (
    <div className="App">
      <header className="App-header">
        <div>🍣SUSHI 1:1 🐶SUSHIB</div>
        {zeroAmount ? (
          <button className="App-button" disabled={true}>
            You didn't have $SUSHI at snapshot
          </button>
        ) : checking ? (
          <button className="App-button" disabled={true}>
            Checking...
          </button>
        ) : txHash ? (
          <button className="App-button" onClick={onViewTx(txHash)}>
            View Transaction
          </button>
        ) : context.isConnected && context.address ? (
          <button className="App-button" onClick={onClaim}>
            Claim
          </button>
        ) : (
          <button className="App-button" onClick={context.onConnect}>
            Connect Wallet
          </button>
        )}
        <div className={"description"}>
          You should have held $SUSHI at{" "}
          <a href={"https://etherscan.io/block/13553257"} target={"_blank"}>
            block 13,553,257
          </a>{" "}
          for claiming $SUSHIB
        </div>
        <div className={"error"}>{error || " "}</div>
      </header>
    </div>
  );
}

export default App;
