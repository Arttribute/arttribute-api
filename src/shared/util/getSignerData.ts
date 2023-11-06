import { ethers } from 'ethers';
import { ethPersonalSignRecoverPublicKey } from '@polybase/eth';

export const getSignerData = (message: string, signature: string) => {
  const recoveredAddress = ethers.verifyMessage(message, signature);
  const publicKey = ethPersonalSignRecoverPublicKey(signature, message);
  return { recoveredAddress, publicKey };
};
