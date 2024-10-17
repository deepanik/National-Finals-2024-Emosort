# NFT Marketplace

## Overview

This project is an NFT marketplace built with **React**, **Material UI**, **Tailwind CSS**, and **Web3.js**. The marketplace allows users to connect their MetaMask wallet, browse available NFTs, and purchase them using cryptocurrency. It includes various features such as loading indicators, notifications, and a clean, dark-themed UI inspired by modern NFT marketplaces.

### Key Features:

- **MetaMask Integration**: Users can connect their wallet, view available NFTs, and make purchases.
- **Material UI + Tailwind CSS**: Responsive, modern UI components with a gradient and dark theme.
- **Loading Indicators**: Shows loading states during data fetch and transactions.
- **Snackbar Notifications**: Alerts users about wallet connections, errors, and successful transactions.
- **Customizable Cards**: NFT cards with images, price, and purchase buttons, featuring hover effects and animations.

---
## Demo

![NFT](https://github.com/user-attachments/assets/2d842980-4fb9-46c4-988f-8a9c42bd485d)


---

## Tech Stack

- **React**: Front-end library for building user interfaces.
- **Material UI**: Used for pre-built components like buttons, cards, grids, etc.
- **Tailwind CSS**: For highly customizable, utility-first styling.
- **Web3.js**: JavaScript library to interact with the Ethereum blockchain.
- **Vite**: Fast development server and build tool.

---

## Installation & Setup

To get a local copy up and running, follow these steps:

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (>= 14.x.x)
- **npm** or **yarn**
- **MetaMask** (installed in your browser)

### Steps:

1. **Clone the repository**:

    ```bash
    git clone https://github.com/deepanik/HackIndia-2024-Emosort.git
    ```

2. **Navigate to the project directory**:

    ```bash
    cd nft-marketplace
    ```

3. **Install the dependencies**:

    Using npm:

    ```bash
    npm install
    ```

    Or with yarn:

    ```bash
    yarn install
    ```

4. **Add Contract ABI and Contract Address**:

    - Create a folder `/src/keys/`.
    - Add the **ABI file** of the deployed contract in `DigitalFileMarketplaceABI.json`.
    - Replace the contract address in the code (`CONTRACT_ADDRESS`).

5. **Start the development server**:

    ```bash
    npm run dev
    ```

    Or with yarn:

    ```bash
    yarn dev
    ```

    The app will run on `http://localhost:3000`.

---

## Usage

1. **Connect MetaMask**: Users should connect their MetaMask wallet to interact with the marketplace.
2. **Browse NFTs**: Users can view available NFTs on the marketplace, displayed in customizable NFT cards.
3. **Buy NFTs**: Users can purchase NFTs by clicking on the "Buy Now" button. The transaction is handled via MetaMask.
4. **Receive Notifications**: Snackbar notifications will alert users of transaction statuses and other actions.

---

## Contributing

Contributions are welcome! Please follow the standard GitHub process:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and open a pull request.

---

## License

This project is licensed under the MIT License.

---

## Contact

For any inquiries or contributions, feel free to contact [devdeepanik@gmail.com] or raise an issue in this repository.

---

