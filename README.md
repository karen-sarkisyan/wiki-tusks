# Walrus Uploader

A modern web application for uploading markdown files to the Walrus decentralized storage network. Built with React, TypeScript, and Tailwind CSS.

## Features

- 🚀 **Drag & Drop Upload**: Intuitive file upload with drag-and-drop support
- 📁 **Markdown Support**: Specifically designed for .md files
- 🌐 **Network Selection**: Choose between testnet and mainnet
- 📊 **Progress Tracking**: Real-time upload progress with visual feedback
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- ⚡ **Efficient Uploads**: Uses Walrus upload relay for optimal performance
- 📱 **Mobile Friendly**: Responsive design that works on all devices

## How It Works

This application leverages Walrus's **upload relay** system to efficiently upload files to the decentralized storage network:

1. **File Selection**: Users can drag & drop or browse for markdown files
2. **Validation**: Files are validated for type (.md) and size (max 10MB)
3. **Upload**: Files are sent to Walrus via the upload relay
4. **Storage**: Files are distributed across the network using erasure coding
5. **Result**: Users receive a Blob ID for accessing their stored file

## Prerequisites

- Node.js 16.0 or later
- npm or yarn package manager

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd walrus-uploader
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

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
│   └── UploadResult.tsx # Upload result display
├── services/           # Business logic
│   └── walrusService.ts # Walrus API integration
├── types/              # TypeScript type definitions
│   └── types.ts
├── App.tsx            # Main application component
├── index.tsx          # Application entry point
└── index.css          # Global styles with Tailwind
```

## Walrus Integration

### Upload Relay Endpoints

- **Testnet**: `https://upload-relay.testnet.walrus.space`
- **Mainnet**: `https://upload-relay.mainnet.walrus.space`

### Key Features

- **Erasure Coding**: Advanced data distribution for reliability
- **Cost Efficiency**: Storage costs ~5x the file size
- **Public Access**: All files are publicly discoverable
- **Decentralized**: No single point of failure

## Important Notes

⚠️ **Security Considerations**:
- All files uploaded to Walrus are **public and discoverable**
- Do not upload sensitive or private information
- Consider encrypting content before upload if privacy is needed

## Customization

### Changing Upload Endpoints

Modify the `UPLOAD_RELAYS` constant in `src/services/walrusService.ts`:

```typescript
const UPLOAD_RELAYS = {
  testnet: 'https://your-testnet-relay.com',
  mainnet: 'https://your-mainnet-relay.com'
};
```

### File Type Restrictions

To support different file types, modify the validation in `FileUpload.tsx`:

```typescript
// Change this line to support different extensions
if (!file.name.toLowerCase().endsWith('.md')) {
  setError('Please select a markdown (.md) file');
  return;
}
```

### Styling

The application uses Tailwind CSS. Customize the design by modifying:
- `tailwind.config.js` - Theme configuration
- `src/index.css` - Custom CSS classes
- Component-specific Tailwind classes

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Resources

- [Walrus Documentation](https://walrus.space)
- [Walrus GitHub Repository](https://github.com/mystenlabs/walrus)
- [React Documentation](https://reactjs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## Support

For questions or issues related to:
- **This Application**: Open an issue in this repository
- **Walrus Protocol**: Check the [Walrus documentation](https://walrus.space) or [GitHub issues](https://github.com/mystenlabs/walrus/issues)
