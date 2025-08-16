# Tusky Uploader

A modern web application for uploading files to the Tusky decentralized storage network. Built with React, TypeScript, and CSS Modules.

## Features

- 🚀 **Simple File Upload**: Clean file selection interface with browse button
- 📁 **Universal File Support**: Supports any file type up to 10MB
- 🌐 **Network Selection**: Choose between testnet and mainnet
- 📊 **Progress Tracking**: Real-time upload progress with visual feedback
- 🎨 **Modern UI**: Beautiful, responsive design with CSS Modules
- ⚡ **Efficient Uploads**: Uses Tusky SDK for optimal performance
- 📱 **Mobile Friendly**: Responsive design that works on all devices
- 🔑 **API Key Authentication**: Secure uploads using API key instead of wallet connection

## How It Works

This application leverages Tusky's **SDK** system to efficiently upload files to the decentralized storage network:

1. **File Selection**: Users can browse for any file type
2. **Validation**: Files are validated for size (max 10MB)
3. **Upload**: Files are sent to Tusky via the SDK using API key authentication
4. **Storage**: Files are distributed across the network using erasure coding
5. **Result**: Users receive a Blob ID for accessing their stored file

## Prerequisites

- Node.js 16.0 or later
- npm or yarn package manager
- **Tusky API Key** (required for uploads)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd tusky-uploader
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add your Tusky API key:
   ```bash
   REACT_APP_TUSKY_API_KEY=your_tusky_api_key_here
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/          # React components
│   ├── FileUpload.tsx  # Main upload component
│   ├── UploadResult.tsx # Upload result display
│   └── WalletProvider.tsx # Wallet provider (commented out)
├── services/           # Business logic
│   ├── tuskyService.ts # Tusky SDK integration
│   └── walrusService.ts # Legacy Walrus integration (kept for reference)
├── types/              # TypeScript type definitions
│   └── types.ts
├── App.tsx            # Main application component
├── index.tsx          # Application entry point
└── index.css          # Global styles
```

## Tusky Integration

### API Key Setup

The application requires a Tusky API key for authentication. To obtain one:

1. Visit [Tusky.io](https://tusky.io)
2. Sign up for an account
3. Generate an API key from your dashboard
4. Add it to your `.env` file as `REACT_APP_TUSKY_API_KEY`

### Network Configuration

- **Testnet**: Default development environment
- **Mainnet**: Production environment

The application automatically configures the appropriate Sui RPC endpoints based on your network selection.

### Key Features

- **Erasure Coding**: Advanced data distribution for reliability
- **Cost Efficiency**: Storage costs ~5x the file size
- **Public Access**: All files are publicly discoverable
- **Decentralized**: No single point of failure
- **API Key Authentication**: No wallet connection required

## Important Notes

⚠️ **Security Considerations**:
- All files uploaded to Tusky are **public and discoverable**
- Do not upload sensitive or private information
- Consider encrypting content before upload if privacy is needed
- Keep your API key secure and never commit it to version control

⚠️ **API Key Security**:
- Store your API key in environment variables only
- Use different API keys for development and production
- Regenerate API keys if compromised

## Customization

### Network Configuration

Modify the network settings in `src/services/tuskyService.ts`:

```typescript
const SUI_NETWORKS = {
  testnet: 'https://fullnode.testnet.sui.io',
  mainnet: 'https://fullnode.mainnet.sui.io'
};
```

### File Size Limits

To change the file size limit, modify the validation in `FileUpload.tsx`:

```typescript
// Change 10MB limit to desired size
if (file.size > 10 * 1024 * 1024) {
  setError('File size must be less than 10MB');
  return;
}
```

### Styling

The application uses CSS Modules. Customize the design by modifying:
- `src/App.module.css` - Main app styles
- `src/components/*.module.css` - Component-specific styles
- `src/index.css` - Global styles

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Resources

- [Tusky Documentation](https://tusky.io)
- [Tusky SDK Documentation](https://github.com/tusky-io/ts-sdk)
- [React Documentation](https://reactjs.org/)
- [CSS Modules Documentation](https://github.com/css-modules/css-modules)

## Support

For questions or issues related to:
- **This Application**: Open an issue in this repository
- **Tusky Protocol**: Check the [Tusky documentation](https://tusky.io) or [SDK documentation](https://github.com/tusky-io/ts-sdk)
