# Eth-crypto interoperability tests

![Branches](./badges/coverage-branches.svg)
![Functions](./badges/coverage-functions.svg)
![Lines](./badges/coverage-lines.svg)
![Statements](./badges/coverage-statements.svg)
![Coverage total](./badges/coverage-total.svg)

Suite of tests to demonstrate that the outcomes of these functions are identical to those of [eth-crypto](https://github.com/pubkey/eth-crypto), but written in pureJS without any dependencies on node / browser objects so that they can be used anywhere, including on mobile 📱 without any polyfilling 😁:

- `createIdentity`
- `decryptWithPrivateKey`
- `encryptWithPublicKey`
- `keccak256` (Solidity packed, see [these docs](https://docs.soliditylang.org/en/v0.8.14/abi-spec.html#non-standard-packed-mode) for more info)
- `publicKeyByPrivateKey`
- `recoverPublicKey`
- `sign` (using secp256k1 elliptic curve)

## Outcomes

See these links for test results and coverage reports:

[**Test Results**](https://jamielivi.github.io/eth-crypto-tests/results/index.html)

[**Test Coverage**](https://jamielivi.github.io/eth-crypto-tests/lcov-report/index.html)

### Resources

Mainly uses the [ethereum-cryptography](https://github.com/ethereum/js-ethereum-cryptography) library, which is implemented with 6 [noble & scure](https://paulmillr.com/noble/) dependencies - so basically under the hood we are mainly using:

- [noble-curves](https://github.com/paulmillr/noble-curves)
- [noble-hashes](https://github.com/paulmillr/noble-hashes)
- [noble-ciphers](https://github.com/paulmillr/noble-ciphers)
