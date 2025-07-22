# Volvo OneView React

A modern React-based Strategic Portfolio Management system for Volvo Group, providing comprehensive initiative tracking, team management, and executive dashboards.

## 🚀 Features

### Authentication & Security
- **Secure Login System**: Password-based authentication with role management
- **User Roles**: Admin, Manager, and User roles with different access levels
- **Session Management**: Persistent login sessions with localStorage

### Portfolio Management
- **Initiative Dashboard**: Executive-level view of all strategic initiatives
- **Real-time Status Tracking**: Visual indicators for project health and progress
- **Advanced Filtering**: Multi-criteria filtering by market, DPM, status, and more
- **Dynamic Search**: Real-time search across initiative data

### Data Management
- **Azure DevOps Integration**: Direct connection to Azure DevOps work items
- **SQL Database Backend**: Robust data storage with Azure SQL Database
- **CRUD Operations**: Full create, read, update, delete functionality
- **Data Synchronization**: Seamless sync between Azure DevOps and local database

### Visualization & Reporting
- **Gantt Charts**: Interactive timeline visualization for project phases
- **Milestone Tracking**: Visual milestone grids with status indicators
- **PDF Export**: One-click export of initiative reports
- **Status Indicators**: Color-coded visual status system

### Team & Resource Management
- **Team Assignment**: Track DPMs, Product Owners, Architects, and more
- **Resource Tracking**: External costs and internal resource allocation
- **Strategic Planning**: Strategic intent and key results management
- **Cybersecurity Integration**: Security lead assignment and tracking

## 🛠️ Technology Stack

### Frontend
- **React 19.1.0**: Modern React with latest features
- **Vite**: Lightning-fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework with custom Volvo theme
- **Date-fns**: Modern date utility library
- **Recharts**: Beautiful chart visualization library
- **Lucide React**: Modern icon library
- **Axios**: HTTP client for API requests

### Backend
- **Azure Functions**: Serverless API endpoints
- **Azure SQL Database**: Enterprise-grade database solution
- **Node.js**: JavaScript runtime for backend services
- **MSSQL Driver**: Native SQL Server connectivity

### Development & Testing
- **Vitest**: Fast unit testing framework
- **Testing Library**: React component testing utilities
- **ESLint**: Code linting and quality assurance
- **PostCSS**: CSS processing and optimization

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- Azure Account (for database and functions)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd oneview-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Azure configuration
   ```

4. **Start development servers**
   ```bash
   # Frontend development server
   npm run dev

   # Backend functions (in another terminal)
   cd api
   npm install
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:7071

## 🔧 Configuration

### Database Setup
The application requires an Azure SQL Database with the following table structure:

```sql
CREATE TABLE Initiatives (
    id NVARCHAR(50) PRIMARY KEY,
    market NVARCHAR(100),
    dpm NVARCHAR(100),
    businessOwner NVARCHAR(100),
    po NVARCHAR(100),
    tdpo NVARCHAR(100),
    architect NVARCHAR(100),
    cybersecurity NVARCHAR(100),
    strategicIntent NVARCHAR(MAX),
    keyResults NVARCHAR(MAX),
    deadlineStatus NVARCHAR(50),
    extCost NVARCHAR(50),
    intRes NVARCHAR(50),
    lastModified DATETIME,
    modifiedBy NVARCHAR(100)
);
```

### Azure DevOps Integration
Update the constants file with your organization details:
```javascript
export const AZURE_DEVOPS_CONFIG = {
  organization: 'YourOrganization',
  project: 'YourProject'
};
```

## 🎨 Customization

### Theme Colors
The application uses a custom Volvo color scheme defined in `src/utils/constants.js`:

```javascript
export const THEME_COLORS = {
  primary: {
    dark: '#2D606F',
    default: '#396976',
    light: '#678C96',
    lighter: '#96B0B6'
  },
  // ... more colors
};
```

### Authentication
Default authentication credentials (development only):
- **Admin**: `admin`
- **Manager**: `volvo123`
- **User**: `oneview2025`

## 📱 Components Overview

### Core Components
- **App.jsx**: Main application component with routing and authentication
- **Layout.jsx**: Application layout wrapper
- **PortfolioCard.jsx**: Initiative display card with full details

### Portfolio Components
- **FilterPanel.jsx**: Advanced filtering interface
- **GanttChart.jsx**: Interactive timeline visualization
- **MilestoneGrid.jsx**: Milestone tracking display
- **StatusIndicator.jsx**: Visual status representation

### Configuration Components
- **InitiativeEditor.jsx**: Full-featured initiative editing modal
- **InitiativeList.jsx**: Sortable, searchable initiative table
- **DataLoader.jsx**: Data synchronization interface

### Common Components
- **Modal.jsx**: Reusable modal dialog
- **Toast.jsx**: Notification system
- **Header.jsx**: Application header with navigation

## 🔒 Security Features

- **Role-based Access Control**: Different access levels for different user types
- **Secure API Endpoints**: CORS-enabled with proper headers
- **Input Sanitization**: Protection against XSS attacks
- **Session Management**: Secure token-based authentication

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📈 Performance

- **Code Splitting**: Automatic code splitting with Vite
- **Lazy Loading**: Components loaded on demand
- **Optimized Images**: SVG icons and optimized assets
- **Caching**: LocalStorage for user preferences and session data

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
npm run preview
```

### Backend Deployment
Deploy Azure Functions using Azure CLI:
```bash
cd api
func azure functionapp publish <your-function-app-name>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software owned by Volvo Group. All rights reserved.

## 🆘 Support

For support and questions:
- **Technical Issues**: Create an issue in the repository
- **Feature Requests**: Submit via the project's issue tracker
- **General Questions**: Contact the development team

## 🔄 Changelog

### Version 2.0.0
- Complete React rewrite of the original HTML version
- Modern component-based architecture
- Enhanced authentication system
- Improved data management with Azure SQL
- Advanced filtering and search capabilities
- Interactive Gantt charts and milestone tracking
- Professional UI with Volvo branding
- Comprehensive test coverage
- Full TypeScript support (coming soon)

---

**Built with ❤️ for Volvo Group Strategic Portfolio Management**
