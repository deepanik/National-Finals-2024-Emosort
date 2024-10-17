// NFTDashboard.jsx
import React, { useState } from 'react';

const NFTDashboard = ({ contract }) => {
    const [tokenId, setTokenId] = useState('');
    const [toAddress, setToAddress] = useState('');
    const [approvedAddress, setApprovedAddress] = useState('');

    // Approve a specific address to transfer NFT
    const approve = async () => {
        try {
            const tx = await contract.approve(approvedAddress, tokenId);
            await tx.wait();
            alert('NFT Approved!');
        } catch (error) {
            console.error("Error approving NFT", error);
        }
    };

    // Approve or revoke approval for all NFTs
    const approveAll = async () => {
        try {
            const tx = await contract.setApprovalForAll(toAddress, true);
            await tx.wait();
            alert('Approval for All Set!');
        } catch (error) {
            console.error("Error setting approval for all", error);
        }
    };

    // Burn NFT
    const burnNFT = async () => {
        try {
            const tx = await contract.burnNFT(tokenId);
            await tx.wait();
            alert('NFT Burned!');
        } catch (error) {
            console.error("Error burning NFT", error);
        }
    };

    // Safe Transfer
    const safeTransfer = async () => {
        try {
            const tx = await contract['safeTransferFrom(address,address,uint256)'](currentAccount, toAddress, tokenId);
            await tx.wait();
            alert('NFT Safely Transferred!');
        } catch (error) {
            console.error("Error with safe transfer", error);
        }
    };

    // Transfer From
    const transferFrom = async () => {
        try {
            const tx = await contract.transferFrom(currentAccount, toAddress, tokenId);
            await tx.wait();
            alert('NFT Transferred!');
        } catch (error) {
            console.error("Error with transfer from", error);
        }
    };

    return (
        <div>
            <h2>NFT Dashboard</h2>
            <input
                type="text"
                placeholder="Token ID"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
            />
            <input
                type="text"
                placeholder="To Address"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
            />
            <input
                type="text"
                placeholder="Approved Address"
                value={approvedAddress}
                onChange={(e) => setApprovedAddress(e.target.value)}
            />
            <button onClick={approve}>Approve NFT</button>
            <button onClick={approveAll}>Approve All NFTs</button>
            <button onClick={burnNFT}>Burn NFT</button>
            <button onClick={safeTransfer}>Safe Transfer</button>
            <button onClick={transferFrom}>Transfer From</button>
        </div>
    );
};

export default NFTDashboard;
