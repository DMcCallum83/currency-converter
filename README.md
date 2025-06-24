# Currency Converter App

A modern, accessible, and user-friendly currency converter built with Vite, React, TypeScript, React Query, and SCSS. The app fetches real-time currency data and conversion rates from [currencybeacon.com](https://currencybeacon.com).

## Features

- **Real-time Currency Conversion**: Convert between 170+ currencies using live exchange rates
- **Modern UI/UX**: Clean, responsive design that works on all devices
- **Accessibility**: Full keyboard navigation, screen reader support, and ARIA attributes
- **Type Safety**: Built with TypeScript for better development experience
- **Performance**: Optimized with React Query for efficient data fetching and caching
- **Testing**: Comprehensive test suite with Vitest and React Testing Library

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: SCSS with BEM methodology
- **State Management**: React Query for server state
- **Testing**: Vitest, React Testing Library, jsdom
- **API**: Currency Beacon API for currency data

## Prerequisites

- Node.js 18+
- npm or yarn
- Currency Beacon API key (free at [currencybeacon.com/register](https://currencybeacon.com/register))

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd currency-converter
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env and add your API key
   VITE_CURRENCY_API_KEY=your_api_key_here
   ```

4. **Get your API key**
   - Visit [currencybeacon.com/register](https://currencybeacon.com/register)
   - Create a free account
   - Copy your API key from the dashboard
   - Add it to your `.env` file

## Development

### Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Run tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI (if available)
npm run test:ui
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint code

```bash
npm run lint
```

## Usage

1. **Select currencies**: Choose the currency you want to convert from and to using the dropdown menus
2. **Enter amount**: Type the amount you want to convert in the input field
3. **View results**: The converted amount will appear automatically with the current exchange rate
4. **Swap currencies**: Use the swap button (↔) to quickly switch between currencies

## Project Structure

```
src/
├── api/                    # API functions and types
│   ├── currencyBeacon.ts   # Currency Beacon API integration
│   └── types.ts           # TypeScript interfaces
├── components/            # Reusable UI components
│   ├── CurrencySelector/  # Currency dropdown component
│   ├── AmountInput/       # Numeric input component
│   └── ConversionResult/  # Conversion display component
├── hooks/                 # Custom React hooks
│   ├── useCurrencies.ts   # Currency list fetching
│   └── useConvertCurrency.ts # Currency conversion
├── pages/                 # Page components
│   └── Home/             # Main app page
├── App.tsx               # Root component
├── App.scss              # Global styles
└── main.tsx              # App entry point
```

## API Integration

The app uses the [Currency Beacon API](https://currencybeacon.com/api-documentation) for:

- **Currency List**: `/v1/currencies` - Get all available currencies
- **Conversion**: `/v1/convert` - Convert between currencies

### API Key Security

⚠️ **Important**: The API key is exposed in the frontend as it's a public API. For production applications, consider:

1. **Backend Proxy**: Create a backend service to proxy API calls
2. **Rate Limiting**: Implement rate limiting on your backend
3. **Caching**: Cache exchange rates to reduce API calls

## Testing

The app includes comprehensive tests for:

- **Component Testing**: All UI components with user interactions
- **Accessibility**: ARIA attributes and keyboard navigation
- **Edge Cases**: Error states, loading states, and validation
- **Responsive Design**: Mobile and desktop layouts

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:run -- --coverage

# Run specific test file
npm test CurrencySelector.test.tsx
```

## Styling

The app uses SCSS with:

- **Variables**: Colors, spacing, and breakpoints
- **Mixins**: Reusable styles for common patterns
- **BEM Methodology**: Consistent class naming
- **Responsive Design**: Mobile-first approach

### Key Design Decisions

- **Color Scheme**: Accessible color contrast ratios
- **Typography**: System font stack for performance
- **Spacing**: Consistent spacing scale
- **Breakpoints**: Mobile-first responsive design

## Accessibility

The app follows WCAG 2.1 guidelines:

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and roles
- **Color Contrast**: Meets AA standards
- **Focus Management**: Clear focus indicators
- **Error Handling**: Accessible error messages

## Performance

- **Code Splitting**: Automatic with Vite
- **Caching**: React Query for API response caching
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: Optimized assets

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Maintain accessibility standards
- Use SCSS for styling
- Follow the existing code style

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Currency Beacon](https://currencybeacon.com) for providing the currency API
- [React Query](https://tanstack.com/query) for data fetching
- [Vite](https://vitejs.dev) for the build tool
- [Vitest](https://vitest.dev) for testing

## Support

If you encounter any issues:

1. Check the [Currency Beacon API documentation](https://currencybeacon.com/api-documentation)
2. Verify your API key is correct
3. Check the browser console for errors
4. Open an issue on GitHub

---

Built with ❤️ using modern web technologies
