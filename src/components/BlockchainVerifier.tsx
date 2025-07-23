import { useState, useEffect } from 'react';
import { VoiceLinkAPI } from '../services/api';

interface BlockchainVerifierProps {
  meetingId?: string;
}

interface WalletStatus {
  connected: boolean;
  address?: string;
  balance?: string;
  network?: string;
}

interface BlockchainRecord {
  transaction_hash: string;
  block_number: number;
  timestamp: string;
  document_hash: string;
  verified: boolean;
}

export default function BlockchainVerifier({ meetingId }: BlockchainVerifierProps) {
  const [walletStatus, setWalletStatus] = useState<WalletStatus | null>(null);
  const [blockchainRecord, setBlockchainRecord] = useState<BlockchainRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    loadWalletStatus();
    if (meetingId) {
      loadBlockchainRecord();
    }
  }, [meetingId]);

  const loadWalletStatus = async () => {
    try {
      const status = await VoiceLinkAPI.getWalletStatus();
      setWalletStatus(status);
    } catch (err) {
      console.error('Failed to load wallet status:', err);
    }
  };

  const loadBlockchainRecord = async () => {
    if (!meetingId) return;
    
    try {
      setLoading(true);
      const record = await VoiceLinkAPI.getBlockchainRecord(meetingId);
      setBlockchainRecord(record);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blockchain record');
    } finally {
      setLoading(false);
    }
  };

  const recordMeetingOnBlockchain = async () => {
    if (!meetingId) return;
    
    try {
      setIsRecording(true);
      const result = await VoiceLinkAPI.recordMeetingOnBlockchain(meetingId);
      
      // Refresh the blockchain record
      await loadBlockchainRecord();
      
      alert('Meeting successfully recorded on blockchain!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record on blockchain');
    } finally {
      setIsRecording(false);
    }
  };

  const getStatusColor = (connected: boolean) => {
    return connected ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (connected: boolean) => {
    return connected ? '✅' : '❌';
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const openTransactionInExplorer = (txHash: string) => {
    const explorerUrl = `https://etherscan.io/tx/${txHash}`;
    window.open(explorerUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Blockchain Verification</h2>
        
        {meetingId && (
          <button
            onClick={recordMeetingOnBlockchain}
            disabled={isRecording || !walletStatus?.connected}
            className="btn btn-primary"
          >
            {isRecording ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Recording...
              </>
            ) : (
              <>🔗 Record on Blockchain</>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="text-red-400">❌</div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Wallet Status</h3>
        
        {walletStatus ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Connection Status</span>
              <div className={`flex items-center gap-2 ${getStatusColor(walletStatus.connected)}`}>
                <span>{getStatusIcon(walletStatus.connected)}</span>
                <span className="text-sm font-medium">
                  {walletStatus.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            
            {walletStatus.address && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Wallet Address</span>
                <span className="text-sm font-mono">
                  {formatAddress(walletStatus.address)}
                </span>
              </div>
            )}
            
            {walletStatus.balance && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Balance</span>
                <span className="text-sm font-medium">
                  {walletStatus.balance} ETH
                </span>
              </div>
            )}
            
            {walletStatus.network && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Network</span>
                <span className="text-sm font-medium">
                  {walletStatus.network}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p>Loading wallet status...</p>
          </div>
        )}
      </div>

      {/* Blockchain Record */}
      {meetingId && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Meeting Verification</h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading verification data...</p>
            </div>
          ) : blockchainRecord ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-green-400 text-lg">✅</div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-green-800">
                      Meeting Verified on Blockchain
                    </h4>
                    <p className="text-sm text-green-700 mt-1">
                      This meeting has been cryptographically verified and recorded
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Transaction Hash</h4>
                  <button
                    onClick={() => openTransactionInExplorer(blockchainRecord.transaction_hash)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-mono break-all"
                  >
                    {blockchainRecord.transaction_hash}
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Block Number</h4>
                  <p className="text-sm font-mono">{blockchainRecord.block_number}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Timestamp</h4>
                  <p className="text-sm">
                    {new Date(blockchainRecord.timestamp).toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Document Hash</h4>
                  <p className="text-sm font-mono break-all text-gray-600">
                    {blockchainRecord.document_hash}
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">What does this mean?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Meeting content and metadata are cryptographically hashed</li>
                  <li>• Hash is permanently recorded on the Ethereum blockchain</li>
                  <li>• Provides tamper-proof evidence of meeting authenticity</li>
                  <li>• Enables IP protection and compliance verification</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔗</div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Meeting Not Yet Recorded
              </h4>
              <p className="text-gray-500 mb-4">
                Record this meeting on the blockchain for permanent verification
              </p>
              
              {!walletStatus?.connected ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    Please connect your wallet to record meetings on blockchain
                  </p>
                </div>
              ) : (
                <button
                  onClick={recordMeetingOnBlockchain}
                  disabled={isRecording}
                  className="btn btn-primary"
                >
                  {isRecording ? 'Recording...' : 'Record on Blockchain'}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Provenance Benefits */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Blockchain Benefits</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Immutable Records</h4>
            <p className="text-xs text-gray-600">
              Meeting data cannot be altered or deleted once recorded
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-2">⏰</div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Timestamp Proof</h4>
            <p className="text-xs text-gray-600">
              Cryptographic proof of when the meeting occurred
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-2">👤</div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Authorship Verification</h4>
            <p className="text-xs text-gray-600">
              Prove who created and owns the meeting content
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
